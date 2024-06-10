const { check, validationResult } = require("express-validator");
const { Prisma,PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { sendEmail } = require("../utils/sendmail");

const validateAuth = (req,res) => {
    return [
        check('email')
            .isEmail().withMessage('Email must be a valid email address')
            .custom(async(value) => {
                try {
                    const user = await prisma.user.findUnique({
                        where:{
                            email:value
                        }
                    })

                    if(user){
                        return true;
                    }
                    else{
                        throw new Error("Email not found");
                    }
                } catch (error) {
                    return res.json({error:error})
                }
            }).withMessage("Email not found")
            .escape()
            .trim(),
    ]
}


const sendMail = async (req,res) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }

    // generate token and send mail
    try {
        var token = await prisma.token.findFirst({
            where:{
                token:req.body.token
            }
        })
        if(!token){
            token = await prisma.token.create({
                data:{
                    email:req.body.email,
                    token:jwt.sign({email:req.body.email},"secret",{expiresIn:'1h'}),
                }
            })
        }
        const user = await prisma.user.findUnique({
            where:{
                email:token.email
            }
        })
        var link = `${process.env.CLIENT_URL}/reset-password-form/${user.id}/${token.token}`;
        sendEmail(req,res,req.body.email,"Reset Password",link,"Password Reset Link");
        // mailer
        // var transporter = nodemailer.createTransport({
        //     service:"smtp",
        //     port:1025,
        //     host:"localhost",
        //     secure:false,
        //     auth:{
        //         user:"",
        //         pass:""
        //     }
        // })
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'clarissa.okon97@ethereal.email',
        //         pass: 'QBFS6db3DfqK2wM2dh'
        //     }
        // });

        // var mailOptions = {
        //     from: 'hello@example.com',
        //     to: 'kesbijnr@gmail.com',
        //     subject: 'Password Reset',
        //     text: 'That was easy!',
        //     html: `<a href='${link}'>Click here to reset your password</a>`
        // };

        // transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //         res.status(500).json({message:"There was a problem sending the email"})
        //     } else {
        //         res.status(200).json({message:"An email will be received if the email account exists"})
        //     }
        // });
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }

}

const validateReset = (req,res) => {
    return [
        check('password')
            .isLength({min:8}).withMessage('Password should be more than 8 characters')
            .escape()
            .trim(),
        check('confirm_password')
            .custom((value,{req}) => {
                if(value !== req.body.password){
                    throw new Error("Passwords do not match");
                }
                return true;
            })
    ]
}

const updateReset = async(req,res) => {
    const result = validationResult(req)
    if(!result.isEmpty()){
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }

    
    try {
        // check token
        const user = await prisma.user.findUnique({
            where:{
                id:req.body.id
            }
        })
        if(!user){
            return res.json({error_message:"Invalid or expired token"})
        }

        const token = await prisma.token.findUnique({
            where:{
                token:req.body.token
            }
        })
        if(!token){
            return res.json({error_message:"Invalid or expired token"})
        }

        jwt.verify(req.body.token,'secret', async(err,decoded) => {
            if(err){
                return res.json({error_message:"Invalid or expired token"})
            }
            if(decoded.email == user.email){
                const hashedPassword = bcrypt.hashSync(req.body.password , 10);
                const updatePassword = await prisma.user.update({
                    where:{
                        id:req.body.id
                    },
                    data:{
                        password:hashedPassword
                    }
                })
                // delete old token
                const deleteToken = await prisma.token.delete({
                    where:{
                        token:req.body.token
                    }
                })
                return res.status(200).json({message:"Password updated"});
            }
            return res.json({error_message:"Invalid or expired token"})
        })
    } catch (error) {
        return res.json({error_message:error.message})
    }
}


const verifyEmail = async (req,res) => {
    const id = req.params.id;
    const token = req.params.token;

    jwt.verify(token,'secret', async (err,decoded) => {
        if(err){
            return res.json({error_message:"Invalid or expired token"})
            // return res.redirect('http://localhost:5173')
        }
        if(decoded.id != id){
            return res.json({error_message:"Invalid or expired token"})
            // return res.redirect('http://localhost:5173')
        }

        // set user email_verified_at to current date
        try {
            const user = await prisma.user.update({
                where:{
                    id:id
                },
                data:{
                    email_verified_at:new Date(),
                }
            })

            return res.redirect(`${process.env.CLIENT_URL}?status=success`)
        } catch (error) {
            console.log(error);
        }
    })
}




const sendVerificationMail = async (req,res) => {
    const token = jwt.sign({id:req.user.id},'secret',{expiresIn:'1h'});
    const link = `${process.env.BASE_URL}/users/verify/${req.user.id}/${token}`;
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            }
        })
        if(user.email_verified_at != null){
            return res.json({message:"Email already verified"})
        }
    } catch (error) {
        return res.json({message:error.message})
    }
    sendEmail(req,res,req.user.email,"Email Verification",link,"Email Verification");
}





module.exports = {
    validateAuth,
    sendMail,
    validateReset,
    updateReset,
    verifyEmail,
    sendVerificationMail
}