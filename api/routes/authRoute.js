var express = require('express');
const { auth, guest, verified } = require('../strategies/auth');
const { logout } = require('../controllers/loginController');
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
router.post('/logout',logout);

module.exports = router