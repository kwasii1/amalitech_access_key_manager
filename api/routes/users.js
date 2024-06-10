var express = require('express');
const { index, update, validate, validatePassword, updatePassword, getPayment, getNotifications, markAsRead } = require('../controllers/userController');
const { validateAuth, sendMail, validateReset, updateReset, verifyEmail, sendVerificationMail } = require('../controllers/authController')
const { getKeys } = require('../controllers/keyController');
const { auth, verified, user } = require('../strategies/auth');
const { checkExpiration } = require('../middlewares/checkExpiration');
var router = express.Router();

/* GET users listing. */
router.get('/',auth,verified,index);
router.post('/update',auth,verified,user,validate(),update);
router.post('/updatepassword',auth,verified,user,validatePassword(),updatePassword);
router.post('/reset-password',validateAuth(),sendMail);
router.post('/reset-password/:id/:token',validateReset(),updateReset);
router.get('/verify/:id/:token',auth,verifyEmail)
router.post('/send-verification',auth,sendVerificationMail)
router.get('/keys',auth,verified,user,checkExpiration,getKeys)
router.get('/payments',auth,verified,user,getPayment)
router.get('/notifications',auth,verified,user,getNotifications)
router.post('/notifications/markasread/:id',auth,verified,markAsRead)

module.exports = router;
