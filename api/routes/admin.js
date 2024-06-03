var express = require('express');
const { adminValidate, validateProfile, updateAdminProfile, updateAdminPassword } = require('../controllers/adminController');
const { auth, verified, admin } = require('../strategies/auth');
const { getAllKeys, revoke, validateEndpoint, endpoint } = require('../controllers/keyController');
var router = express.Router();

router.post('/update-profile',auth,admin,verified,validateProfile(),updateAdminProfile);
router.post('/change-password',auth,admin,verified,adminValidate(),updateAdminPassword);
router.get('/keys',auth,verified,admin,getAllKeys);
router.delete('/keys/revoke/:id',auth,verified,admin,revoke);
router.post('/endpoint',auth,verified,admin,validateEndpoint(),endpoint);


module.exports = router