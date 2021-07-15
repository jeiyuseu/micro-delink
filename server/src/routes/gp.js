const express = require('express')
const router = express.Router()
const auth = require('../middleware/jwt.js')
const GpController = require('../controller/GpController.js')

router.get('/:codename', auth, GpController.index)
router.get('/:codename/:codeno', auth, GpController.clients)
router.get('/:codename/:codeno/completed-accounts', auth, GpController.completed)
router.get('/:codename/:codeno/withdrawals', auth, GpController.withdrawals)
router.post('/:codename/:uuid/withdraw', auth, GpController.postWithdrawals)
router.patch('/:codename/completed-accounts/:uuid/reloan', auth, GpController.reloan)
router.patch('/:codename/completed-accounts/:uuid/renew', auth, GpController.renew)
router.get('/:codename/:uuid/payments', auth, GpController.details)
router.post('/:codename', auth, GpController.post)
router.post('/:codename/:codeno', auth, GpController.postClient)
router.patch('/:codename/:uuid/edit-info', auth, GpController.editInfo)
router.patch('/:codename/:uuid/update-client', auth, GpController.updateClient)
router.patch('/:codename/:uuid/edit-client', auth, GpController.editClient)
router.patch('/:codename/:uuid/edit-client-completed', auth, GpController.editClientCompleted)
router.patch('/:codename/:uuid/cluster-resolution', auth, GpController.clusterResolution)
router.delete('/:codename/:uuid/delete-client', auth, GpController.deleteClient)
router.delete('/:codename/:uuid/delete-client-completed', auth, GpController.deleteClientCompleted)
router.delete('/:codename/:uuid/delete-info', auth, GpController.deleteInfo)
router.patch('/:codename/:uuid/edit-details', auth, GpController.editDetails)

module.exports = router
