const express = require('express')
const router = express.Router()
const auth = require('../middleware/jwt.js')
const ClientController = require('../controller/ClientController.js')

router.get('/', auth, ClientController.index)
router.post('/', auth, ClientController.post)
router.patch('/:id', auth, ClientController.update)
router.delete('/:id', auth, ClientController.delete)

module.exports = router
