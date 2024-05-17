const {Prima,PrismaClient} = require('@prisma/client');
const { check, validationResult } = require('express-validator');

const prisma = new PrismaClient;


const index = async(req,res) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
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

module.exports = {
    index,
    validate,
    update
}