const { check, validationResult } = require("express-validator");
var passport = require('passport');
const { csrfSync } = require('csrf-sync');
const { generateToken,revokeToken } = csrfSync()


const validateLogin = () => {
    return [
        check('email')
            .isEmail().withMessage('Provide a valid email address')
            .trim()
            .escape(),
        check('password')
            .notEmpty().withMessage('Password cannot be empty')
            .escape()
            .trim(),
    ];
}


const create = async (req,res,next) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.json({ errors: result.formatWith(error => error.msg).mapped() });
    }
    

    passport.authenticate('local', (err,user,info,status) => {
        if(err){
            return next(err)
        }
        if(!user){
            return res.json({errors:{email:'Incorrect Email or Password'}})
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'An error occurred during login.' });
            }
            return res.status(200).json({ success: true, message: 'Authentication successful.', user,admin:user.account_type });
        });
    })(req,res,next)


}


const logout = (req,res,next) => {
    req.logout(function(err){
        if(err){
            return next(err)
        }
        generateToken(req,true);
        return res.json({signout:true})
    })
}

module.exports = {
    validateLogin,
    create,
    logout
}