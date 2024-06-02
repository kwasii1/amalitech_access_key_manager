var express = require('express');
const { adminValidate, validateProfile, updateAdminProfile, updateAdminPassword } = require('../controllers/adminController');
var router = express.Router();

router.post('/update-profile',validateProfile(),updateAdminProfile)
router.post('/change-password',adminValidate(),updateAdminPassword)


module.exports = router