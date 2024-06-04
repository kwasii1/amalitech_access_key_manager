var express = require('express');
const { adminValidate, validateProfile, updateAdminProfile, updateAdminPassword } = require('../controllers/adminController');
const { auth, verified, admin } = require('../strategies/auth');
const { getAllKeys, revoke, validateEndpoint, endpoint } = require('../controllers/keyController');
const { checkExpiration } = require('../middlewares/checkExpiration');
var router = express.Router();

router.post('/update-profile',auth,admin,verified,validateProfile(),updateAdminProfile);
router.post('/change-password',auth,admin,verified,adminValidate(),updateAdminPassword);
router.get('/keys',auth,verified,admin,checkExpiration,getAllKeys);
router.post('/keys/revoke/:id',auth,verified,admin,checkExpiration,revoke);
router.post('/endpoint',auth,verified,admin,validateEndpoint(),checkExpiration,endpoint);


module.exports = router