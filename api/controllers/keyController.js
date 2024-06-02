const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const getKeys = async (req,res) => {
    try {
        const keys = await prisma.accessKey.findMany({
            where:{
                user_id:req.user.id
            }
        });

        return res.status(200).json({data:keys,message:"success"});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


module.exports = {
    getKeys,
}