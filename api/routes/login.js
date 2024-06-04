var express = require('express')
const { validateLogin, create } = require('../controllers/loginController')
const { checkExpiration } = require('../middlewares/checkExpiration')
var router = express.Router()


router.post('/', validateLogin(),checkExpiration,create)

module.exports = router