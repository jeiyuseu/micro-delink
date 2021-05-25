const express = require('express')
const router = express.Router()
const auth = require('../middleware/jwt.js')
const AuthenticationController = require('../controller/AuthenticationController.js')

router.post('/auth', AuthenticationController.refreshToken)
router.post('/login', AuthenticationController.login)
router.post('/register', AuthenticationController.register)
router.get('/logout', auth, AuthenticationController.logout)

module.exports = router
