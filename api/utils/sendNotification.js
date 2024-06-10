const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const sendNotification = async (user_id,message,title) => {
    try {
        const notification = await prisma.notification.create({
            data:{
                user_id:user_id,
                data:{
                    "message":message,
                    "title":title
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendNotification
}