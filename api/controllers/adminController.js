const { PrismaClient } = require("@prisma/client");
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();


const validateProfile = () => {
    return [
        check('name')
            .notEmpty().withMessage('Name is required')
            .escape()
            .trim()
    ]
}

const updateAdminProfile = async (req,res) => {
    const result = validationResult(req)
    if(!result.isEmpty()){
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }
    try {
        const user = await prisma.user.update({
            where:{
                id:req.user.id
            },
            data:{
                name:req.body.name
            }
        })
        return res.status(200).json({message:"Profile updated"});
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while updating your profile" });
    }
}

const adminValidate = (req,res) => {
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

const updateAdminPassword = async (req,res) => {
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
        return res.status(500).json({ password_message: "An error occurred while updating your profile" });
    }
    
}


module.exports = {
    adminValidate,
    updateAdminPassword,
    validateProfile,
    updateAdminProfile
}