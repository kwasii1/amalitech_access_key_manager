var express = require('express');
const { index, update, validate } = require('../controllers/userController');
const { auth } = require('../strategies/auth');
var router = express.Router();

/* GET users listing. */
router.get('/',auth,index)
router.post('/update',validate(),update)

module.exports = router;
