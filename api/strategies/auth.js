const {Prisma,PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const auth = (req,res,next) => {
    if(req.isAuthenticated()){
        // return res.json({auth:true})
        return next()
    }
    return res.json({auth:false})
}

const guest = (req,res,next) => {
    if(req.isAuthenticated()){
        return res.json({guest:false})
    }
    return next();
}

const verified = async (req,res,next) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            },
            select:{
                email_verified_at:true
            }
        })

        if(user.email_verified_at == null){
            return res.json({isVerified:false})
        }
        return next();
    } catch (error) {
        console.log(error);
    }
}


const admin = async (req,res,next) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            },
            select:{
                account_type:true
            }
        });

        if(user.account_type == "user"){
            return res.json({isAdmin:false});
        }
        return next();
    } catch (error) {
        console.log(error);
    }
}

const user = async (req,res,next) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            },
            select:{
                account_type:true
            }
        })

        if(user.account_type == "admin"){
            return res.json({isUser:false})
        }
        return next()
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    auth,
    guest,
    verified,
    admin,
    user
}