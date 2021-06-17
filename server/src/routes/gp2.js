const express = require('express')
const router = express.Router()
const auth = require('../middleware/jwt.js')
const Gp2Controller = require('../controller/Gp2Controller.js')

router.get('/:codename', auth, Gp2Controller.index)
router.get('/:codename/completed-accounts', auth, Gp2Controller.index)
router.patch('/:codename/completed-accounts/:uuid/reloan', auth, Gp2Controller.reloan)
router.patch('/:codename/completed-accounts/:uuid/renew', auth, Gp2Controller.renew)
router.get('/:codename/:uuid', auth, Gp2Controller.details)
router.post('/:codename', auth, Gp2Controller.post)
router.post('/:codename/:uuid', auth, Gp2Controller.postClient)
router.patch('/:codename/:uuid/edit', auth, Gp2Controller.editInfo)
router.patch('/:codename/:uuid/update', auth, Gp2Controller.updateClient)
router.patch('/:codename/:uuid', auth, Gp2Controller.updateDetails)

module.exports = router
