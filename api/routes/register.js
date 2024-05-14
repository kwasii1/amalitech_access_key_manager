var express = require('express')
const { index, validate } = require('../controllers/registerController')
var router = express.Router()

router.post('/',validate(),index)

module.exports = router