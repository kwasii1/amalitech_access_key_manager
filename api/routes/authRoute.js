var express = require('express');
const { auth } = require('../strategies/auth');
const { logout } = require('../controllers/loginController');
var router = express.Router();


router.get('/',auth,(req,res) => {
    return res.json({auth:true})
});
router.post('/logout',logout);

module.exports = router