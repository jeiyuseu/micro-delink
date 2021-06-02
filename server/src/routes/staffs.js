const express = require('express')
const router = express.Router()
const auth = require('../middleware/jwt.js')
const StaffController = require('../controller/StaffController.js')

router.get('/', auth, StaffController.index)
router.post('/', auth, StaffController.post)
router.patch('/:id', auth, StaffController.update)

module.exports = router
