const {PrismaClient} = require('@prisma/client');
const dayjs = require('dayjs')
const prisma = new PrismaClient();

const checkExpiration = async (req,res,next) => {
    try {
        const keys = await prisma.accessKey.updateMany({
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
            data:{
                status:"expired"
            }
        })
    } catch (error) {
        console.log(error);
    }
    next()
}

module.exports = {
    checkExpiration
}