const axios = require('axios');
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');
const { sendNotification } = require('../utils/sendNotification');


const listPlans = async (req,res) => {
    try {
        const response = await axios.get('https://api.paystack.co/plan',{headers:{
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        }})

        if(response.data.status){
            res.status(200).json({plans:response.data.data})
        }
        else{
            res.status(500).json({message:"There was an error fetching plans"});
        }
    } catch (error) {
        res.status(500).json({message:"There was an error fetching plans"});
    }
}


const validatePayment = (req,res) => {
    return [
        check('plan')
            .notEmpty().withMessage("Plan is required")
            .trim()
            .escape(),
        check('amount')
            .notEmpty().withMessage("Amount is required")
            .trim()
            .escape(),
        check('payment_method')
            .notEmpty().withMessage('Payment method is required')
            .trim()
            .escape(),
        check('provider')
            .if((value,{req}) => req.body.payment_method === "mobile_money").notEmpty().withMessage("Provider is required if payment method is mobile money")
            .trim()
            .escape(),
        check('number')
            .isMobilePhone('en-GH')
            .if((value,{req}) => req.body.payment_method === "mobile_money").notEmpty().withMessage("Phone number is required if payment method is mobile money")
            
    ]
}


const completePayment = async (req,res) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
        // console.log(result.formatWith(error => error.msg).mapped());
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }

    // check if there is an active access key
    const exist = await prisma.accessKey.findFirst({
        where:{
            user_id:req.user.id,
            status:"active",
        }
    });

    if(exist){
        return res.json({errors:{custom:"You already have an active key"}})
    }

    const params = {
        "amount":req.body.amount * 100,
        "email":req.user.email,
        "currency":"GHS",
        "mobile_money": { 
            "phone": req.body.number, 
            "provider": req.body.provider
        },
        "metadata":{
            "plan":req.body.plan,
            "user_id":req.user.id,
            "phone":req.body.number,
        }
    }

    try {
        const response = await axios.post('https://api.paystack.co/charge',params,{
            headers:{
                Authorization:`Bearer ${process.env.PAYSTACK_SECRET}`,
                'Content-Type':'application/json',
            }
        })

        if(response.status === 200){
            if(response.data.data.status === "success"){
                res.json({ message: "Payment successful, awaiting verification." });
            }
            else if(response.data.data.status === "timeout"){
                res.json({message:response.data.data.message})
            }
            else if(response.data.data.status === "failed"){
                res.json({message:response.data.data.message})
            }
        }
    } catch (error) {
        res.status(500).json({message:"There was an error during payment"})
    }

}

const webhook = async (req,res) => {
    //validate event
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        // Retrieve the request's body
        const event = req.body;
        if(event.event === 'charge.success'){
            // create key and payment
            const admin = await prisma.user.findFirst({
                where:{
                    account_type:"admin"
                }
            })
            try {
                const expiry = (event.data.metadata.plan == "monthly" ? dayjs().add(1,'month'):dayjs().add(1,'year'));
                const key = await prisma.accessKey.create({
                    data:{
                        user_id:event.data.metadata.user_id, 
                        status:"active",
                        date_of_procurement:new Date(),
                        expiry_date:expiry,
                        key:crypto.randomUUID(),
                        notified:false,
                    }
                });

                const payment = await prisma.payment.create({
                    data:{
                        user_id:event.data.metadata.user_id,
                        access_key_id:key.id,
                        payment_method:event.data.channel,
                        plan:event.data.metadata.plan,
                        amount:event.data.amount/100,
                        status:"paid",
                        mobile_number:event.data.metadata.phone,
                    }
                })
            } catch (error) {
                // send a notification
                sendNotification(event.data.metadata.user_id,"Payment verified and completed but there was an error creating the key","Payment Success")
                sendNotification(admin.id,"Payment verified and completed but there was an error creating the key","Payment Success")
                return res.status(200).json({message:"Error creating key"});
            }
            // send a notification
            sendNotification(event.data.metadata.user_id,"Payment verified and completed","Payment Success")
            sendNotification(admin.id,`Payment verified and completed`,"Payment Success")
            return res.status(200).json({message:"Payment Completed"});
        }
    }
    return res.status(200);
}

module.exports = {
    listPlans,
    validatePayment,
    completePayment,
    webhook
}