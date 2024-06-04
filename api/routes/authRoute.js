var express = require('express');
const { auth, guest, verified, admin, user } = require('../strategies/auth');
const { logout } = require('../controllers/loginController');
const { tokenGenerate } = require('../libs/csrfProtection');
var router = express.Router();


router.get('/',auth,(req,res) => {
    return res.json({auth:true})
});
router.get('/guest',guest,(req,res) => {
    return res.json({guest:true})
});
router.get('/verified',auth,verified,(req,res) => {
    return res.json({isVerified:true})
})
router.get('/admin',auth,admin,(req,res) => {
    return res.json({isAdmin:true})
})
router.get('/user',auth,user,(req,res) => {
    return res.json({isUser:true})
})

router.get('/csrf-token',tokenGenerate);
router.post('/logout',logout);

module.exports = router