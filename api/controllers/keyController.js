const { PrismaClient } = require("@prisma/client");
const { check, validationResult } = require("express-validator");
const { sendNotification } = require("../utils/sendNotification");
const prisma = new PrismaClient();



const getKeys = async (req,res) => {
    try {
        const keys = await prisma.accessKey.findMany({
            where:{
                user_id:req.user.id
            },
            include:{
                payment:{
                    select:{
                        payment_method:true,
                        amount:true,
                        plan:true,
                        status:true
                    }
                }
            }
        });

        return res.status(200).json({data:keys,message:"success"});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


const getAllKeys = async (req,res) => {
    try {
        const keys = await prisma.accessKey.findMany({
            include:{
                payment:{
                    select:{
                        payment_method:true,
                        amount:true,
                        plan:true,
                        status:true
                    }
                },
                user:{
                    select:{
                        name:true,
                    }
                }
            }
        });
        return res.status(200).json({data:keys,message:"success"});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

const revoke = async (req,res) => {
    try {
        const exists = await prisma.accessKey.findUnique({
            where:{
                id:req.params.id,
                OR:[
                    {
                        status:"expired"
                    },
                    {
                        status:"revoked"
                    }
                ]
            }
        });
        if(exists){
            return res.status(200).json({message:`${exists.key} has been revoked already`})
        }
        const key = await prisma.accessKey.update({
            where:{
                id:req.params.id
            },
            data:{
                status:"revoked"
            }
        })
        const admin = await prisma.user.findFirst({
            where:{
                account_type:"admin",
            }
        })
        sendNotification(key.user_id,`Your access key ${req.params.id} has been revoked`,"Access Key Revoked");
        sendNotification(admin.id,`Access Key ${req.params.id} has been revoked`,"Access Key Revoked");

        return res.status(200).json({message:`${key.key} has been revoked`})
    } catch (error) {
        return res.status(500).json({message:"There was an error revoking key"})
    }
}

const validateEndpoint = (req,res) => {
    return [
        check('email')
            .isEmail().withMessage("The field must be a valid email address")
            .notEmpty().withMessage("Email is required")
            .trim()
            .escape()
    ]
}


const endpoint = async (req,res) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }

    try {
        const key = await prisma.accessKey.findFirst({
            where:{
                user:{
                    email:req.body.email
                },
                status:"active",
            },
            include:{
                user:{
                    select:{
                        name:true,
                    }
                }
            }
        });

        if(key){
            return res.status(200).json({key:key,message:"Active Key Found"});
        }
        else{
            return res.status(404).json({key:{},message:"Active Key not found"});
        }
    } catch (error) {
        return res.status(500).json({message:"There was an error finding key"});
    }
}


module.exports = {
    getKeys,
    getAllKeys,
    revoke,
    validateEndpoint,
    endpoint
}