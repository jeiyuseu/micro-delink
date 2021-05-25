const express = require('express')
const router = express.Router()
const auth = require('../middleware/jwt.js')
const BranchController = require('../controller/BranchController.js')

router.get(['/', '/:slug'], auth, BranchController.index)
router.post('/', auth, BranchController.post)
router.patch('/:uuid', auth, BranchController.update)
router.delete('/:uuid', auth, BranchController.delete)

module.exports = router
