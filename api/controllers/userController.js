const {Prisma,PrismaClient} = require('@prisma/client');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')

const prisma = new PrismaClient;


const index = async(req,res) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            },
            select:{
                name:true,
                school_name:true,
                id:true,
                account_type:true,
                email:true,
            }
        })

        return res.json({user:user});
    } catch (error) {
        return res.status(501).json({error:error})
    }
}

const validate = (req,res) => {
    return [
        check('name')
            .notEmpty().withMessage('Name is required')
            .isLength({max:255}).withMessage('Name cannot be more than 255 characters')
            .isString().withMessage("Name must be a string")
            .escape()
            .trim(),
        check('school_name')
            .notEmpty().withMessage('School name is required')
            .isLength({max:255}).withMessage('Name cannot be more than 255 characters')
            .custom(async(value) => {
                try {
                    const user = await prisma.user.findFirst({
                        where:{
                            school_name:value
                        }
                    })
                    if(user == null){
                        return true
                    }
                } catch (error) {
                    return res.json({error:error})
                }
            }).withMessage("School name is already taken")
            .isString().withMessage("Name must be a string")
            .escape()
            .trim(),
        check('email')
            .isEmail().withMessage("Email must be a valid email address")
            .custom(async (value,{req}) => {
                const user = await prisma.user.findUnique({
                    where:{
                        email:value,
                        NOT:{
                            email:req.user.email
                        }
                    },
                    select:{
                        email:true
                    }
                })
                if(user){
                    throw new Error("Email already taken")
                }
            }).withMessage("Email is already taken")
            .escape()
            .trim()
    ]
}


const update = async(req,res) => {
    const result = validationResult(req)
    if(!result.isEmpty()){
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }

    try {
        const user = await prisma.user.update({
            where:{
                id:req.user.id,
            },
            data:{
                name:req.body.name,
                school_name:req.body.school_name,
                email:req.body.email
            }
        })
        return res.status(200).json({message:"Profile updated"});
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while updating your profile" });
    }
}

const validatePassword = (req,res) => {
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


const updatePassword = async(req,res) => {
    const result = validationResult(req)
    if(!result.isEmpty()){
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }

    // check old password
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            }
        })
        const match = await bcrypt.compare(req.body.old_password,user.password)
        if(match){
            const hashedPassword = bcrypt.hashSync(req.body.password , 10);
            const updatePassword = await prisma.user.update({
                where:{
                    id:req.user.id
                },
                data:{
                    password:hashedPassword
                }
            })
            return res.status(200).json({password_message:"Password updated"});
        }
        else{
            return res.status(200).json({errors:{old_password:"Old password does not match"}});
        }
    } catch (error) {
        return res.status(500).json({password_message:"There was a problem updating the password"});
    }
}

const getPayment = async (req,res) => {
    try {
        const payments = await prisma.payment.findMany({
            where:{
                user_id:req.user.id
            },
            include:{
                users:{
                    select:{
                        name:true
                    }
                },
                access_keys:{
                    select:{
                        key:true
                    }
                }
            }
        })
        return res.status(200).json({payments:payments});
    } catch (error) {
        return res.status(200).json({message:"There was an error retrieving payments"});
    }
}

const getNotifications = async (req,res) => {
    const {page,pageSize} = req.query;
    const pageNumber = parseInt(page) || 1;
    const size =  parseInt(pageSize)||5;
    try {
        const notifications = await prisma.notification.findMany({
            take:size,
            skip:(pageNumber - 1) * size,
            where:{
                user_id:req.user.id,
                read:false,
            }
        })
        const totalNotifications = await prisma.notification.count({
            where:{
                user_id:req.user.id,
                read:false,
            }
        })


        return res.status(200).json({data:notifications,total:totalNotifications,totalPages:Math.ceil(totalNotifications/size),currentPage:page});
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
}

const markAsRead = async (req,res) => {
    try {
        const notification = await prisma.notification.update({
            where:{
                id:req.params.id
            },
            data:{
                read:true,
            }
        })
        res.status(200).json({message:"Message marked as read"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports = {
    index,
    validate,
    update,
    validatePassword,
    updatePassword,
    getPayment,
    getNotifications,
    markAsRead
}