const { check, validationResult } = require("express-validator");
const { Prisma,PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
        var link = `http://localhost:5173/reset-password-form/${user.id}/${token.token}`
        // mailer
        var transporter = nodemailer.createTransport({
            service:"smtp",
            port:1025,
            host:"localhost",
            secure:false,
            auth:{
                user:"",
                pass:""
            }
        })
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'clarissa.okon97@ethereal.email',
        //         pass: 'QBFS6db3DfqK2wM2dh'
        //     }
        // });

        var mailOptions = {
            from: 'hello@example.com',
            to: 'kesbijnr@gmail.com',
            subject: 'Password Reset',
            text: 'That was easy!',
            html: `<a href='${link}'>Click here to reset your password</a>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.status(500).json({message:"There was a problem sending the email"})
            } else {
                res.status(200).json({message:"Email sent"})
            }
        });
    } catch (error) {
        res.status(500).json({error_message:"Internal Server Error"});
    }

}

const validateReset = (req,res) => {
    return [
        check('old_password')
            .notEmpty().withMessage('Old password is required')
            .escape()
            .trim(),
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

    // check old password
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.body.id
            }
        })
        const match = await bcrypt.compare(req.body.old_password,user.password)
        if(match){
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
            
        }
        else{
            return res.status(200).json({errors:{old_password:"Old password does not match"}});
        }
    } catch (error) {
        console.log(error);
    }
}





module.exports = {
    validateAuth,
    sendMail,
    validateReset,
    updateReset
}