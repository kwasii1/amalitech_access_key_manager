var express = require('express');
const { index, update, validate, validatePassword, updatePassword } = require('../controllers/userController');
const { validateAuth, sendMail, validateReset, updateReset, verifyEmail, sendVerificationMail } = require('../controllers/authController')
const { auth } = require('../strategies/auth');
var router = express.Router();

/* GET users listing. */
router.get('/',auth,index);
router.post('/update',auth,validate(),update);
router.post('/updatepassword',validatePassword(),updatePassword);
router.post('/reset-password',validateAuth(),sendMail);
router.post('/reset-password/:id/:token',validateReset(),updateReset);
router.get('/verify/:id/:token',auth,verifyEmail)
router.post('/send-verification',auth,sendVerificationMail)

module.exports = router;
