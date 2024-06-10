const {PrismaClient} = require('@prisma/client');
const dayjs = require('dayjs');
const { sendNotification } = require('../utils/sendNotification');
const prisma = new PrismaClient();

const checkExpiration = async (req,res,next) => {
    try {
        const keys = await prisma.accessKey.findMany({
            where:{
                expiry_date:{
                    lte:dayjs()
                },
                NOT:[
                    {
                        status:"expired",
                    }
                ]
            },
        })
        console.log(keys.length);
        if(keys.length > 0){
            const updateKeys = await prisma.accessKey.updateMany({
                where:{
                    id:{
                        in:keys.map(key => key.id)
                    }
                },
                data:{
                    status:"expired",
                    notified:true
                }
            })
            const admin = await prisma.user.findFirst({
                where:{
                    account_type:"admin"
                }
            })
            keys.forEach(element => {
                if(!element.notified){
                    sendNotification(req.user.id,`Access key ${element.key} has expired`,"Expired Access Key");
                    sendNotification(admin.id,`Access key ${element.key} has expired`,"Expired Access Key");
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
    next()
}

module.exports = {
    checkExpiration
}