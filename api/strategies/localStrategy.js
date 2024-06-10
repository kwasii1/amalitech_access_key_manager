const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser(async(id,done) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:id
            },
            select:{
                id:true,
                name:true,
                school_name:true,
                account_type:true,
                email:true,
            }
        })
        if(user){
            done(null,user)
        }
        else{
            throw new Error("User not found");
        }
    } catch (error) {
        done(error)
    }
})


passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"},async function verify(email,password,cb){
    try {
        const user = await prisma.user.findUnique({
            where:{
                email:email
            },
        })
        if(!user){
            return cb(null,false,{message:"Incorrect email or password"})
        }
        const match = await bcrypt.compare(password,user.password)

        if(!match){
            return cb(null,false,{message:"Incorrect email or password"})
        }

        return cb(null,user)
    } catch (error) {
        return cb(error)
    }
}))

module.exports = passport



