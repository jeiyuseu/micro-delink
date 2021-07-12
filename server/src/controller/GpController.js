'use strict'
const {
	GpInfo,
	GpClients,
	GpDetails,
	Branch,
	Staffs,
	Clients,
	Users,
	GpInfoCode,
	GpWithdrawals,
	Op,
	sequelize,
} = require('../models')
const gpinfo = require('../models/gpinfo')

module.exports = {
	index: async (req, res) => {
		const { codename } = req.params
		try {
			const staffs = await Staffs.findOne({
				where: { codeName: codename },
				attributes: ['firstName', 'lastName', 'codeName'],
				include: [
					{
						model: GpInfo,
						as: 'gpInfo',
						attributes: [
							'id',
							'codeNameId',
							'staffCodeNameId',
							'uuid',
							'weeksToPay',
							'loanCycle',
							'dateOfFirstPayment',
							'dateOfReleased',
							'dateOfLastPayment',
							'isVirgin',
						],
						include: [
							{
								model: GpClients,
								as: 'gpClients',
								required: false,
								where: { lr: { [Op.ne]: 0 } },
								include: [
									{
										model: Users,
										as: 'userInfo',
										attributes: ['firstName', 'lastName'],
									},
									{
										model: Clients,
										as: 'clientInfo',
										order: [['firstName', 'ASC']],
										attributes: ['uuid', 'firstName', 'middleInitial', 'lastName', 'slug'],
									},
								],
							},
							{ model: Staffs, as: 'staffs', attributes: ['codeName'] },
							{ model: GpInfoCode, as: 'codename', attributes: ['name'] },
						],
					},
				],
			})
			let payload = { ...staffs.toJSON() }
			let gpInfo = []
			staffs.gpInfo.forEach((client, i1, array) => {
				gpInfo[i1] = {
					...array[i1].toJSON(),
					totals: {
						loanAmount: client.gpClients.reduce((a, b) => {
							return a + b.loanAmount
						}, 0),
						lr: client.gpClients.reduce((a, b) => {
							return a + b.lr
						}, 0),
						skCum: client.gpClients.reduce((a, b) => {
							return a + b.skCum
						}, 0),
						wi: client.gpClients.reduce((a, b) => {
							return a + b.wi
						}, 0),
						pastDue: client.gpClients.reduce((a, b) => {
							return a + b.pastDue
						}, 0),
					},
				}
				payload.gpInfo = gpInfo
			})

			return res.status(200).send(payload)
		} catch (error) {
			return res.status(400).send({ error: error, msg: error.message })
		}
	},
	clients: async (req, res) => {
		const { codename, codeno } = req.params

		try {
			const gpinfo = await GpInfo.findOne({
				attributes: ['uuid', 'weeksToPay', 'loanCycle', 'dateOfFirstPayment', 'dateOfReleased', 'dateOfLastPayment'],
				include: [
					{
						model: GpClients,
						as: 'gpClients',
						where: { lr: { [Op.ne]: 0 } },
						required: false,
						include: [
							{
								model: Users,
								as: 'userInfo',
								attributes: ['firstName', 'lastName'],
							},
							{
								model: Clients,
								as: 'clientInfo',
								order: [['firstName', 'ASC']],
								attributes: ['uuid', 'firstName', 'middleInitial', 'lastName', 'slug'],
							},
						],
					},
					{
						model: Staffs,
						as: 'staffs',
						attributes: ['firstName', 'lastName', 'codeName'],
						where: { codeName: codename },
					},
					{ model: GpInfoCode, as: 'codename', attributes: ['name'], where: { name: codeno } },
				],
			})
			const totals = {
				loanAmount: gpinfo.gpClients.reduce((a, b) => {
					return a + b.loanAmount
				}, 0),
				lr: gpinfo.gpClients.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gpinfo.gpClients.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gpinfo.gpClients.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gpinfo.gpClients.reduce((a, b) => {
					return a + b.pastDue
				}, 0),
			}

			return res.status(200).send({
				...gpinfo.toJSON(),
				...gpinfo.staffs.toJSON(),
				...gpinfo.codename.toJSON(),

				totals,
			})
		} catch (error) {
			return res.status(400).send({ error: error, msg: error.message })
		}
	},
	completed: async (req, res) => {
		const { codename, codeno } = req.params

		try {
			const gpinfo = await GpInfo.findOne({
				attributes: [
					'isVirgin',
					'uuid',
					'weeksToPay',
					'loanCycle',
					'dateOfFirstPayment',
					'dateOfReleased',
					'dateOfLastPayment',
				],
				include: [
					{
						model: GpClients,
						as: 'gpClients',
						where: { lr: 0 },
						required: false,
						include: [
							{
								model: Users,
								as: 'userInfo',
								attributes: ['firstName', 'lastName'],
							},
							{
								model: Clients,
								as: 'clientInfo',
								order: [['firstName', 'ASC']],
								attributes: ['uuid', 'firstName', 'middleInitial', 'lastName', 'slug'],
							},
						],
					},
					{
						model: Staffs,
						as: 'staffs',
						attributes: ['firstName', 'lastName', 'codeName'],
						where: { codeName: codename },
					},
					{ model: GpInfoCode, as: 'codename', attributes: ['name'], where: { name: codeno } },
				],
			})
			const totals = {
				loanAmount: gpinfo.gpClients.reduce((a, b) => {
					return a + b.loanAmount
				}, 0),
				lr: gpinfo.gpClients.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gpinfo.gpClients.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gpinfo.gpClients.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gpinfo.gpClients.reduce((a, b) => {
					return a + b.pastDue
				}, 0),
			}

			return res.status(200).send({
				...gpinfo.toJSON(),
				...gpinfo.staffs.toJSON(),
				...gpinfo.codename.toJSON(),
				totals,
			})
		} catch (error) {
			return res.status(400).send({ error: error, msg: error.message })
		}
	},
	withdrawals: async (req, res) => {
		try {
			const gpwithdrawals = await GpWithdrawals.findAll({ gp2Info: 1 })
			return res.status(200).send(gpwithdrawals)
		} catch (error) {
			return res.status(400).send({ error })
		}
	},
	post: async (req, res) => {
		const { dateOfReleased, dateOfFirstPayment, dateOfLastPayment, weeksToPay, clusterCode } = req.body
		const { codename } = req.params

		try {
			const staff = await Staffs.findOne({
				include: 'branch',
				where: { codeName: codename.split('-')[0] },
			})

			const infocode = await GpInfoCode.create({ name: clusterCode })
			const gpinfo = await GpInfo.create({
				dateOfReleased,
				dateOfFirstPayment,
				dateOfLastPayment,
				weeksToPay,
				isVirgin: true,
				gpInfoCodeId: infocode.id,
				staffId: staff.id,
				branchId: staff.branch.id,
			})
			const info = await GpInfo.findOne({
				where: { uuid: gpinfo.uuid },
				attributes: { exclude: ['createdAt', 'updatedAt', 'isVirgin'] },
				include: [
					{ model: Staffs, as: 'staffs', attributes: ['codeName'] },
					{ model: GpInfoCode, as: 'codename', attributes: ['name'] },
				],
			})

			return res.status(201).send({ status: 201, success: true, msg: info })
		} catch (error) {
			return res.status(400).send({ error: error.message })
		}
	},

	updateClient: async (req, res) => {
		const { installment, sk, penalty, userId } = req.body
		const { uuid } = req.params

		try {
			const gpclients = await GpClients.findOne({
				where: { uuid },
				include: [
					{
						model: GpInfo,
						as: 'gpInfo',
						attributes: ['id', 'uuid', 'branchId'],
					},
				],
			})
			const userInfo = await Users.findOne({
				where: { uuid: userId },
				attributes: ['id', 'firstName', 'lastName'],
			})

			let pastDue
			if (installment === 0) {
				pastDue = gpclients.wi + gpclients.pastDue
			} else if (installment < gpclients.wi) {
				pastDue = gpclients.wi - installment + gpclients.pastDue
			} else {
				pastDue = 0
			}
			const lr = gpclients.lr - installment
			const skCum = gpclients.skCum + sk
			await GpInfo.update({ isVirgin: false }, { where: { uuid: gpclients.gpInfo.uuid }, sideEffects: false })
			let gpclientsupdate = await GpClients.update(
				{ lr, skCum, updatedBy: userInfo.id },
				{
					where: { uuid },
					returning: [
						'createdAt',
						'infoId',
						'loanAmount',
						'lr',
						'pastDue',
						'skCum',
						'updatedAt',
						'updatedBy',
						'uuid',
						'wi',
					],
				}
			)

			const gpclientsall = await GpClients.findAll({
				where: { lr: { [Op.gt]: 0 } },
				include: [
					{
						model: GpInfo,
						as: 'gpInfo',
						where: { id: gpclients.gpInfo.id },
						attributes: [],
					},
				],
			})

			const totals = {
				loanAmount: gpclientsall.reduce((a, b) => {
					return a + b.loanAmount
				}, 0),
				lr: gpclientsall.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gpclientsall.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gpclientsall.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gpclientsall.reduce((a, b) => {
					return a + b.pastDue
				}, 0),
			}

			const client = {
				...gpclientsupdate[1][0].toJSON(),
				infoId: gpclients.gpInfo.uuid,
				userInfo,
				totals,
			}
			const details = {}
			details.branchId = gpclients.gpInfo.branchId
			details.gpInfoId = gpclients.gpInfo.id
			details.gpClientId = gpclients.id
			details.payment = installment || 0
			details.sk = sk || 0
			details.penalty = penalty || 0
			await GpDetails.create({ ...details })
			return res.status(200).send({ status: 200, success: true, msg: client })
		} catch (error) {
			console.log(error)
			return res.status(400).send({ error: error.message })
		}
	},
	postClient: async (req, res) => {
		const formData = req.body

		const { codeno } = req.params

		try {
			const clients = await Clients.findAll({
				attributes: ['id', 'uuid', 'firstName', 'middleInitial', 'lastName', 'slug'],
				where: { uuid: { [Op.in]: formData.map((value) => value.id) } },
			})
			let gpinfo = await GpInfo.findOne({
				include: [{ model: GpInfoCode, as: 'codename', where: { name: codeno } }],
			})

			let payload = []
			let totals
			let response = {}
			formData.forEach((value, index) => {
				const lr = gpinfo.weeksToPay === 18 ? (value.loanAmount * 124.2) / 100 : (value.loanAmount * 120) / 100

				payload[index] = {
					clientId: clients.map((value) => value.id)[index],
					infoId: gpinfo.id,
					lr,
					loanAmount: value.loanAmount,
					weeks: gpinfo.weeksToPay,
					wi: lr / gpinfo.weeksToPay,
					skCum: 0,
					pastDue: 0,
				}
			})
			payload = payload.filter((value) => value.clientId !== undefined)

			const gpClients = await GpClients.bulkCreate(payload, {
				validate: true,
			})
			await GpInfo.update({ isVirgin: false }, { where: { uuid: gpinfo.uuid }, sideEffects: false })
			gpClients.forEach((value, index, array) => {
				payload[index] = {
					...array[index].toJSON(),
					clientInfo: clients[index],
					userInfo: null,
				}
			})

			gpinfo = await GpInfo.findOne({
				where: { uuid: gpinfo.uuid },
				include: [
					{
						model: GpClients,
						as: 'gpClients',
					},
				],
			})

			totals = {
				loanAmount: gpinfo.gpClients.reduce((a, b) => {
					return a + b.loanAmount
				}, 0),
				lr: gpinfo.gpClients.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gpinfo.gpClients.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gpinfo.gpClients.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gpinfo.gpClients.reduce((a, b) => {
					return a + b.pastDue
				}, 0),
			}
			response.clients = payload
			response.totals = totals
			return res.status(201).send({ status: 201, success: true, msg: response })
		} catch (error) {
			return res.status(400).send({
				status: 400,
				success: false,
				error: error.errors.map((e) => e.message),
			})
		}
	},
	editClient: async (req, res) => {
		const { uuid, lr, wi, skCum, pastDue, userId } = req.body

		try {
			const user = await Users.findOne({
				where: { uuid: userId },
				attributes: ['id', 'firstName', 'lastName'],
			})
			//future update
			//* change client when editing client =>'clientId'
			const gpclient = await GpClients.update(
				{ lr, wi, skCum, pastDue, updatedBy: user.id },
				{
					where: { uuid },
					returning: [
						'loanAmount',
						'lr',
						'pastDue',
						'skCum',
						'weeks',
						'wi',
						'updatedAt',
						'updatedBy',
						'infoId',
						'uuid',
					],
				}
			)
			const gpinfo = await GpInfo.findOne({
				where: { id: gpclient[1][0].infoId },
				include: [
					{
						model: GpClients,
						as: 'gpClients',
						where: { lr: { [Op.ne]: 0 } },
					},
				],
			})
			gpclient[1][0].infoId = gpclient.uuid
			let payload = {}
			gpclient[1].forEach((value) => {
				payload = {
					...value.toJSON(),
					userInfo: user,
					totals: {
						loanAmount: gpinfo.gpClients.reduce((a, b) => {
							return a + b.loanAmount
						}, 0),
						lr: gpinfo.gpClients.reduce((a, b) => {
							return a + b.lr
						}, 0),
						skCum: gpinfo.gpClients.reduce((a, b) => {
							return a + b.skCum
						}, 0),
						wi: gpinfo.gpClients.reduce((a, b) => {
							return a + b.wi
						}, 0),
						pastDue: gpinfo.gpClients.reduce((a, b) => {
							return a + b.pastDue
						}, 0),
					},
				}
			})

			return res.status(200).send({ status: 200, success: true, msg: payload })
		} catch (error) {
			return res.status(400).send({
				status: 400,
				success: false,
				error: error.message,
			})
		}
	},
	editClientCompleted: async (req, res) => {
		const { uuid, lr, wi, skCum, pastDue, userId } = req.body

		try {
			const user = await Users.findOne({
				where: { uuid: userId },
				attributes: ['id', 'firstName', 'lastName'],
			})
			//future update
			//* change client when editing client =>'clientId'
			const gpclient = await GpClients.update(
				{ lr, wi, skCum, pastDue, updatedBy: user.id },
				{
					where: { uuid },
					returning: [
						'uuid',
						'loanAmount',
						'lr',
						'pastDue',
						'skCum',
						'weeks',
						'wi',
						'updatedAt',
						'updatedBy',
						'infoId',
					],
				}
			)
			const gpinfo = await GpInfo.findOne({
				where: { id: gpclient[1][0].infoId },
				include: [
					{
						model: GpClients,
						as: 'gpClients',
						where: { lr: 0 },
					},
				],
			})
			gpclient[1][0].infoId = gpclient.uuid
			let payload = {}
			gpclient[1].forEach((value) => {
				payload = {
					...value.toJSON(),
					userInfo: user,
					totals: {
						loanAmount: gpinfo.gpClients.reduce((a, b) => {
							return a + b.loanAmount
						}, 0),
						lr: gpinfo.gpClients.reduce((a, b) => {
							return a + b.lr
						}, 0),
						skCum: gpinfo.gpClients.reduce((a, b) => {
							return a + b.skCum
						}, 0),
						wi: gpinfo.gpClients.reduce((a, b) => {
							return a + b.wi
						}, 0),
						pastDue: gpinfo.gpClients.reduce((a, b) => {
							return a + b.pastDue
						}, 0),
					},
				}
			})

			return res.status(200).send({ status: 200, success: true, msg: payload })
		} catch (error) {
			return res.status(400).send({
				status: 400,
				success: false,
				error: error.message,
			})
		}
	},
	editInfo: async (req, res) => {
		const { codename, dateOfFirstPayment, dateOfLastPayment, dateOfReleased, weeksToPay } = req.body
		const { uuid } = req.params

		try {
			let gpInfoFind = await GpInfo.findOne({
				where: { uuid },
				include: [
					{ model: GpInfoCode, as: 'codename' },
					{ model: Staffs, as: 'staffs' },
				],
			})
			await GpInfoCode.update({ name: codename }, { where: { uuid: gpInfoFind.codename.uuid } })

			await GpInfo.update(
				{ dateOfFirstPayment, dateOfLastPayment, dateOfReleased, weeksToPay },
				{ where: { uuid: gpInfoFind.uuid }, sideEffects: false }
			)
			gpInfoFind = await GpInfo.findOne({
				where: { uuid },

				include: [
					{ model: GpInfoCode, as: 'codename' },
					{ model: Staffs, as: 'staffs' },
				],
			})
			return res.status(200).send({ status: 200, success: true, msg: gpInfoFind })
		} catch (error) {
			return res.status(400).send({ status: 400, success: false, error: error })
		}
	},
	details: async (req, res) => {
		const { uuid } = req.params
		const [slug, clientId] = uuid.split('.')

		try {
			const gpclients = await GpClients.findOne({
				include: [
					{ model: Clients, as: 'clientInfo', where: { [Op.and]: [{ slug, uuid: clientId }] } },
					{ model: GpInfo, as: 'gpInfo', attributes: ['id'] },
				],
			})

			const gpdetails = await GpDetails.findAll({
				where: {
					[Op.and]: [{ gpInfoId: gpclients.gpInfo.id, gpClientId: gpclients.id }],
				},
				attributes: { exclude: ['gpClientId', 'gpInfoId'] },
				order: [['createdAt', 'ASC']],
			})

			const totals = {
				payment: gpdetails.reduce((a, b) => {
					return a + b.payment
				}, 0),
				sk: gpdetails.reduce((a, b) => {
					return a + b.sk
				}, 0),
				penalty: gpdetails.reduce((a, b) => {
					return a + b.penalty
				}, 0),
			}

			return res.status(200).send({
				status: 400,
				success: true,
				msg: { details: gpdetails, totals },
			})
		} catch (error) {
			return res.status(400).send({ status: 400, success: false, error: error.message })
		}
	},

	editDetails: async (req, res) => {
		const { uuid, payment, sk, penalty } = req.body

		try {
			let [, gpdetails] = await GpDetails.update({ payment, sk, penalty }, { where: { uuid }, returning: true })
			const gptotals = await GpDetails.findAll({
				where: { [Op.and]: [{ gpInfoId: gpdetails[0].gpInfoId, gpClientId: gpdetails[0].gpClientId }] },
			})
			const totals = {
				payment: gptotals.reduce((a, b) => {
					return a + b.payment
				}, 0),
				sk: gptotals.reduce((a, b) => {
					return a + b.sk
				}, 0),
				penalty: gptotals.reduce((a, b) => {
					return a + b.penalty
				}, 0),
			}

			await GpClients.update(
				{ skCum: totals.sk },
				{
					where: { id: gpdetails[0].gpClientId },
				}
			)

			gpdetails[0].gpInfoId = undefined
			gpdetails[0].gpClientId = undefined

			return res.status(200).send({ status: 200, success: true, msg: { ...gpdetails[0].toJSON(), totals } })
		} catch (error) {
			return res.status(500).send({ status: 400, success: false, msg: error.message })
		}
	},
	renew: async (req, res) => {
		const { dateOfFirstPayment, dateOfLastPayment, dateOfReleased, uuid, weeksToPay } = req.body

		try {
			let gpinfos = await GpInfo.update(
				{
					dateOfFirstPayment,
					dateOfLastPayment,
					dateOfReleased,
					weeksToPay,
					isVirgin: true,
				},
				{ where: { uuid }, returning: true, sideEffects: false }
			)

			await GpDetails.destroy({ where: { gpInfoId: gpinfos[1][0].id } })
			gpinfos = await GpInfo.increment('loanCycle', {
				by: 1,
				where: { uuid },
			})
			let payload = {}
			gpinfos[0][0].forEach((value, index) => {
				payload = {
					uuid: value.uuid,
					dateOfFirstPayment: value.dateOfFirstPayment,
					dateOfLastPayment: value.dateOfLastPayment,
					dateOfReleased: value.dateOfReleased,
					weeksToPay: value.weeksToPay,
					loanCycle: value.loanCycle,
					isVirgin: value.isVirgin,
				}
			})
			return res.status(200).send({ status: 200, success: true, msg: payload })
		} catch (error) {
			return res.status(400).send({ status: 400, success: true, error: error.message })
		}
	},
	reloan: async (req, res) => {
		const { uuid, loanAmount } = req.body

		try {
			const gpclientsfind = await GpClients.findOne({
				where: { uuid },
				include: [{ model: GpInfo, as: 'gpInfo', attributes: ['weeksToPay', 'uuid'] }],
			})
			const lr = gpclientsfind.gpInfo.weeksToPay === 18 ? (loanAmount * 124.2) / 100 : (loanAmount * 120) / 100

			let payload = {
				lr,
				loanAmount,
				weeks: gpclientsfind.gpInfo.weeksToPay,
				wi: lr / gpclientsfind.gpInfo.weeksToPay,
				pastDue: 0,
			}

			const gpclients = await GpClients.update({ ...payload }, { where: { uuid }, returning: true })
			const gpclientsall = await GpClients.findAll({
				where: { lr: 0 },
				include: [
					{
						model: GpInfo,
						as: 'gpInfo',
						where: { uuid: gpclientsfind.gpInfo.uuid },
						attributes: [],
					},
				],
			})
			const totals = {
				loanAmount: gpclientsall.reduce((a, b) => {
					return a + b.loanAmount
				}, 0),
				lr: gpclientsall.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gpclientsall.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gpclientsall.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gpclientsall.reduce((a, b) => {
					return a + b.pastDue
				}, 0),
			}

			return res.status(200).send({
				status: 200,
				success: true,
				msg: {
					...gpclients[1][0].toJSON(),
					infoId: gpclientsfind.gpInfo.uuid,
					totals,
				},
			})
		} catch (error) {
			return res.status(400).send({ status: 400, success: true, error: error.message })
		}
	},
	deleteInfo: async (req, res) => {
		const { uuid } = req.params
		try {
			const deleteinfo = await GpInfo.findOne({ where: { uuid } })
			await deleteinfo.destroy()
			console.log(deleteinfo)
			return res.status(200).send({ status: 200, success: true, msg: { infoId: uuid } })
		} catch (error) {
			return res.status(400).send({ success: false, error: error.message })
		}
	},
	deleteClient: async (req, res) => {
		const { uuid } = req.params

		try {
			let info = {}
			const deleteclient = await GpClients.findOne({
				where: { uuid },
				include: [{ model: GpInfo, as: 'gpInfo', attributes: ['uuid'] }],
			})

			info.infoId = deleteclient.gpInfo.uuid
			info.clientId = uuid

			/*

			01-06-6
			onDelete : 'CASCADE' not working without destroy()
			see in https://github.com/sequelize/sequelize/issues/8444 
			
			workaround
			add destory()
			or reference your model and key in migrations, -> server/src/migrations/010410155409-create-gp--details.js

			*/
			await deleteclient.destroy()

			const gpclientsall = await GpClients.findAll({
				where: { lr: { [Op.ne]: 0 } },
				include: [
					{
						model: GpInfo,
						as: 'gpInfo',
						where: { uuid: info.infoId },
						attributes: [],
					},
				],
			})
			const msg = {
				...info,
				totals: {
					loanAmount: gpclientsall.reduce((a, b) => {
						return a + b.loanAmount
					}, 0),
					lr: gpclientsall.reduce((a, b) => {
						return a + b.lr
					}, 0),
					skCum: gpclientsall.reduce((a, b) => {
						return a + b.skCum
					}, 0),
					wi: gpclientsall.reduce((a, b) => {
						return a + b.wi
					}, 0),
					pastDue: gpclientsall.reduce((a, b) => {
						return a + b.pastDue
					}, 0),
				},
			}

			return res.status(200).send({
				status: 200,
				success: true,
				msg,
			})
		} catch (error) {
			return res.status(400).send({
				status: 400,
				success: false,
				error: error.message,
			})
		}
	},
	deleteClientCompleted: async (req, res) => {
		const { uuid } = req.params

		try {
			let info = {}
			const deleteclient = await GpClients.findOne({
				where: { uuid },
				include: [{ model: GpInfo, as: 'gpInfo', attributes: ['uuid'] }],
			})

			info.infoId = deleteclient.gpInfo.uuid
			info.clientId = uuid

			/*

			01-06-6
			onDelete : 'CASCADE' not working without destroy()
			see in https://github.com/sequelize/sequelize/issues/8444 
			
			workaround
			add destory()
			or reference your model and key in migrations, -> server/src/migrations/010410155409-create-gp--details.js

			*/
			await deleteclient.destroy()

			const gpclientsall = await GpClients.findAll({
				where: { lr: 0 },
				include: [
					{
						model: GpInfo,
						as: 'gpInfo',
						where: { uuid: info.infoId },
						attributes: [],
					},
				],
			})
			const msg = {
				...info,
				totals: {
					loanAmount: gpclientsall.reduce((a, b) => {
						return a + b.loanAmount
					}, 0),
					lr: gpclientsall.reduce((a, b) => {
						return a + b.lr
					}, 0),
					skCum: gpclientsall.reduce((a, b) => {
						return a + b.skCum
					}, 0),
					wi: gpclientsall.reduce((a, b) => {
						return a + b.wi
					}, 0),
					pastDue: gpclientsall.reduce((a, b) => {
						return a + b.pastDue
					}, 0),
				},
			}

			return res.status(200).send({
				status: 200,
				success: true,
				msg,
			})
		} catch (error) {
			return res.status(400).send({
				status: 400,
				success: false,
				error: error.message,
			})
		}
	},
	clusterResolution: async (req, res) => {
		const { uuid } = req.params
		try {
			const gpinfo = await GpInfo.findOne({
				where: { uuid },
				attributes: ['id'],
				include: [
					{
						model: GpClients,
						as: 'gpClients',
						required: false,
						where: { lr: { [Op.ne]: 0 } },
						include: [
							{
								model: Users,
								as: 'userInfo',
								attributes: ['firstName', 'lastName'],
							},
							{
								model: Clients,
								as: 'clientInfo',
								order: [['firstName', 'ASC']],
								attributes: ['uuid', 'firstName', 'middleInitial', 'lastName', 'slug', 'id'],
							},
						],
					},
					{ model: Staffs, as: 'staffs', attributes: [] },
					{ model: GpInfoCode, as: 'codename', attributes: [] },
				],
			})
			let payload = []
			let errors = []
			let status
			gpinfo.gpClients.forEach((value) => {
				if (value.skCum <= value.lr) {
					status = false
					errors.push(
						'SK CUM of ' +
							value.clientInfo.firstName +
							' ' +
							value.clientInfo.middleInitial +
							' ' +
							value.clientInfo.lastName +
							'  is not enough!'
					)
				}
				if (errors.length === 0) {
					status = true
					payload.push({
						uuid: value.uuid,
						infoId: gpinfo.id,
						clientId: value.clientInfo.id,
						lr: 0,
						skCum: value.skCum - value.lr,
						weeks: value.weeks,
						wi: value.wi,
						pastDue: value.pastDue,
						loanAmount: value.loanAmount,
					})
				}
			})

			if (status) {
				await GpInfo.update({ isVirgin: false }, { where: { uuid }, sideEffects: false })
				const gpclients = await GpClients.bulkCreate(payload, {
					updateOnDuplicate: ['lr', 'skCum'],
					returning: ['loanAmount', 'lr', 'pastDue', 'skCum', 'updatedAt', 'createdAt', 'uuid', 'weeks', 'wi'],
				})
				return res.status(200).send({
					status: 200,
					success: true,
					msg: gpclients,
				})
			} else {
				return res.status(400).send({
					status: 400,
					success: false,
					error: errors,
				})
			}
		} catch (error) {
			return res.status(400).send({
				status: 400,
				success: false,
				error: error.message,
			})
		}
	},
}
