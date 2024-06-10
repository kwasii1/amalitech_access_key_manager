var express = require('express');
const { listPlans, validatePayment, completePayment, webhook } = require('../controllers/paymentController');
const { auth, verified } = require('../strategies/auth');
const { checkExpiration } = require('../middlewares/checkExpiration');
var router = express.Router();

router.get('/plans',auth,verified,listPlans)
router.post('/pay',auth,verified,validatePayment(),checkExpiration,completePayment)
// router.post('/webhook',webhook)

module.exports = router