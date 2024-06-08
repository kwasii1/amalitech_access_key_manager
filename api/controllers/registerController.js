const {validationResult, check} = require('express-validator')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { PrismaClient, Prisma } = require('@prisma/client')
const { sendEmail } = require('../utils/sendmail')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()




const validate = () => {
    return [
        check('name')
            .notEmpty().withMessage('Name is Required')
            .isLength({max:255}).withMessage('Name cannot be more than 255 characters')
            .isString().withMessage("Name must be a string")
            .escape()
            .trim(),
        check('email')
            .isEmail().withMessage('Email must be a valid email address')
            .custom(async (value,{req}) => {
                const user = await prisma.user.findUnique({
                    where:{
                        email:value
                    },
                    select:{
                        email:true
                    }
                })
                if(user){
                    throw new Error("Email already taken")
                }
            }).withMessage("Email is already taken"),
        check('schoolname')
            .notEmpty().withMessage('School Name is required')
            .escape()
            .trim(),
        check('password')
            // .isStrongPassword({minLength:5}).withMessage('Password must be more than 8 charaters')
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
    ];
} 


const index = async (req,res) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
        // console.log(result.formatWith(error => error.msg).mapped());
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }

    const hashed_password = bcrypt.hashSync(req.body.password , 10);

    try {
        const user = await prisma.user.create({
            data: {
                id:crypto.randomUUID(),
                name:req.body.name,
                school_name:req.body.schoolname,
                email:req.body.email,
                email_verified_at:null,
                account_type:"user",
                password:hashed_password
            }
        })
        // send verification link through mail
        const token = jwt.sign({id:user.id},'secret',{expiresIn:'1h'});
        const link = `http://localhost:9000/users/verify/${user.id}/${token}`;
        sendEmail(req,res,req.body.email,"Email Verification",link,"Email Verification");


        // return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while creating the user." });
    }

    
    
}

module.exports = {
    index,
    validate,
}