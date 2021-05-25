const express = require('express')
const router = express.Router()
const auth = require('../middleware/jwt.js')
const Gp2Controller = require('../controller/Gp2Controller.js')

router.get('/:codename', auth, Gp2Controller.index)
router.get('/:codename/completed-accounts', auth, Gp2Controller.index)
router.get('/:codename/info', auth, Gp2Controller.info)
router.patch('/:codename/completed-accounts', auth, Gp2Controller.reloan)
router.get('/:codename/:uuid', auth, Gp2Controller.details)
router.post('/:codename', auth, Gp2Controller.post)
router.patch('/:codename', auth, Gp2Controller.update)
router.patch('/:codename/:uuid', auth, Gp2Controller.updateDetails)

module.exports = router
