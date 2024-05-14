var express = require('express')
const { validateLogin, create } = require('../controllers/loginController')
var router = express.Router()


router.post('/', validateLogin(),create)

module.exports = router