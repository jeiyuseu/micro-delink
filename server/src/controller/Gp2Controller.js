const { Gp2Info, Gp2Clients, Gp2Details, Branch, Staffs, Clients, Users, Gp2InfoCode, Op, sequelize } = require('../models')

module.exports = {
	index: async (req, res) => {
		const { codename } = req.params

		try {
			const code = codename.split('-')[0]

			let filter = typeof req.path.split('/')[2] !== 'undefined' ? false : true
			let filter1 = typeof req.path.split('/')[2] !== 'undefined' ? '=' : '!='

			const staffs = await Staffs.findOne({
				attributes: ['codeName'],
				include: 'branch',
				include: [
					{
						model: Gp2Info,
						as: 'gp2Info',
						order: [
							['id', 'ASC'],
							['gp2InfoCodeId', 'ASC'],
						],
						separate: true,
						attributes: ['id', 'codeNameId', 'staffCodeNameId', 'uuid', 'weeksToPay', 'loanCycle', 'dateOfFirstPayment', 'dateOfReleased', 'dateOfLastPayment', 'isVirgin'],
						where: {
							[Op.or]: [{ isVirgin: filter }, sequelize.where(sequelize.col('gp2Clients.lr'), filter1, 0)],
						},
						include: [
							{
								model: Gp2Clients,
								as: 'gp2Clients',
								required: false,
								where: sequelize.where(sequelize.col('gp2Clients.lr'), filter1, 0),
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
							{ model: Gp2InfoCode, as: 'codename', attributes: ['name'] },
						],
					},
				],
				where: { codeName: code },
			})

			const payload = {}
			const gp2Info = []

			payload.codeName = staffs.codeName
			staffs.gp2Info.forEach((client, i1, array) => {
				gp2Info[i1] = {
					...array[i1].toJSON(),
					totals: {
						loanAmount: client.gp2Clients.reduce((a, b) => {
							return a + b.loanAmount
						}, 0),
						lr: client.gp2Clients.reduce((a, b) => {
							return a + b.lr
						}, 0),
						skCum: client.gp2Clients.reduce((a, b) => {
							return a + b.skCum
						}, 0),
						wi: client.gp2Clients.reduce((a, b) => {
							return a + b.wi
						}, 0),
						pastDue: client.gp2Clients.reduce((a, b) => {
							return a + b.pastDue
						}, 0),
					},
				}
				payload.gp2Info = gp2Info
			})

			if (!staffs) {
				return res.status(404).send({ msg: 'Staff not found!' })
			} else {
				return res.status(200).send(payload)
			}
		} catch (error) {
			return res.status(400).send({ error: error, msg: error.message })
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

			const infocode = await Gp2InfoCode.create({ name: clusterCode })
			const gp2info = await Gp2Info.create({
				dateOfReleased,
				dateOfFirstPayment,
				dateOfLastPayment,
				weeksToPay,
				isVirgin: true,
				gp2InfoCodeId: infocode.id,
				staffId: staff.id,
				branchId: staff.branch.id,
			})
			const info = await Gp2Info.findOne({
				where: { uuid: gp2info.uuid },
				include: [
					{ model: Gp2Clients, as: 'gp2Clients' },
					{ model: Staffs, as: 'staffs', attributes: ['codeName'] },
					{ model: Gp2InfoCode, as: 'codename', attributes: ['name'] },
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
			const gp2clients = await Gp2Clients.findOne({
				where: { uuid },
				include: [
					{
						model: Gp2Info,
						as: 'gp2Info',
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
				pastDue = gp2clients.wi + gp2clients.pastDue
			} else if (installment < gp2clients.wi) {
				pastDue = gp2clients.wi - installment + gp2clients.pastDue
			} else {
				pastDue = 0
			}
			const lr = gp2clients.lr - installment
			const skCum = gp2clients.skCum + sk
			await Gp2Info.update({ isVirgin: false }, { where: { uuid: gp2clients.gp2Info.uuid }, sideEffects: false })
			let gp2clientsupdate = await Gp2Clients.update({ lr, skCum, updatedBy: userInfo.id }, { where: { uuid }, returning: true })

			const gp2clientsall = await Gp2Clients.findAll({
				where: { lr: { [Op.gt]: 0 } },
				include: [
					{
						model: Gp2Info,
						as: 'gp2Info',
						where: { id: gp2clients.gp2Info.id },
						attributes: [],
					},
				],
			})

			const totals = {
				lr: gp2clientsall.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gp2clientsall.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gp2clientsall.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gp2clientsall.reduce((a, b) => {
					return a + b.pastDue
				}, 0),
			}

			const client = {
				...gp2clientsupdate[1][0].toJSON(),
				infoId: gp2clients.gp2Info.uuid,
				userInfo,
				totals,
			}
			const details = {}
			details.branchId = gp2clients.gp2Info.branchId
			details.gp2InfoId = gp2clients.gp2Info.id
			details.gp2ClientId = gp2clients.id
			details.payment = installment || 0
			details.sk = sk || 0
			details.penalty = penalty || 0
			await Gp2Details.create({ ...details })
			return res.status(200).send({ status: 200, success: true, msg: client })
		} catch (error) {
			console.log(error)
			return res.status(400).send({ error: error.message })
		}
	},
	postClient: async (req, res) => {
		const formData = req.body
		const { uuid } = req.params

		try {
			const clients = await Clients.findAll({
				attributes: ['id', 'uuid', 'firstName', 'middleInitial', 'lastName', 'slug'],
				where: { uuid: { [Op.in]: formData.map((value) => value.id) } },
			})
			let gp2info = await Gp2Info.findOne({
				where: { uuid },
			})
			let payload = []
			let totals
			let response = {}
			formData.forEach((value, index) => {
				const lr = gp2info.weeksToPay === 18 ? (value.loanAmount * 124.2) / 100 : (value.loanAmount * 120) / 100

				payload[index] = {
					clientId: clients.map((value) => value.id)[index],
					infoId: gp2info.id,
					lr,
					loanAmount: value.loanAmount,
					weeks: gp2info.weeksToPay,
					wi: lr / gp2info.weeksToPay,
					pastDue: 0,
				}
			})
			payload = payload.filter((value) => value.clientId !== undefined)

			const gp2Clients = await Gp2Clients.bulkCreate(payload, {
				validate: true,
			})
			await Gp2Info.update({ isVirgin: false }, { where: { uuid }, sideEffects: false })
			gp2Clients.forEach((value, index, array) => {
				payload[index] = {
					...array[index].toJSON(),
					clientInfo: clients[index],
					userInfo: null,
				}
			})

			gp2info = await Gp2Info.findOne({
				where: { uuid },
				include: [
					{
						model: Gp2Clients,
						as: 'gp2Clients',
					},
				],
			})

			totals = {
				lr: gp2info.gp2Clients.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gp2info.gp2Clients.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gp2info.gp2Clients.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gp2info.gp2Clients.reduce((a, b) => {
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
			const gp2client = await Gp2Clients.update(
				{ lr, wi, skCum, pastDue, updatedBy: user.id },
				{ where: { uuid }, returning: ['loanAmount', 'lr', 'pastDue', 'skCum', 'weeks', 'wi', 'updatedAt', 'updatedBy', 'infoId'] }
			)
			const gp2info = await Gp2Info.findOne({
				where: { id: gp2client[1][0].infoId },
				include: [
					{
						model: Gp2Clients,
						as: 'gp2Clients',
					},
				],
			})
			gp2client[1][0].infoId = gp2client.uuid
			let payload = {}
			gp2client[1].forEach((value) => {
				payload = {
					...value.toJSON(),
					userInfo: user,
					totals: {
						lr: gp2info.gp2Clients.reduce((a, b) => {
							return a + b.lr
						}, 0),
						skCum: gp2info.gp2Clients.reduce((a, b) => {
							return a + b.skCum
						}, 0),
						wi: gp2info.gp2Clients.reduce((a, b) => {
							return a + b.wi
						}, 0),
						pastDue: gp2info.gp2Clients.reduce((a, b) => {
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
			let gp2InfoFind = await Gp2Info.findOne({
				where: { uuid },
				include: [
					{ model: Gp2InfoCode, as: 'codename' },
					{ model: Staffs, as: 'staffs' },
				],
			})
			await Gp2InfoCode.update({ name: codename }, { where: { uuid: gp2InfoFind.codename.uuid } })

			await Gp2Info.update({ dateOfFirstPayment, dateOfLastPayment, dateOfReleased, weeksToPay }, { where: { uuid: gp2InfoFind.uuid }, sideEffects: false })
			gp2InfoFind = await Gp2Info.findOne({
				where: { uuid },

				include: [
					{ model: Gp2InfoCode, as: 'codename' },
					{ model: Staffs, as: 'staffs' },
				],
			})
			return res.status(200).send({ status: 200, success: true, msg: gp2InfoFind })
		} catch (error) {
			return res.status(400).send({ status: 400, success: false, error: error })
		}
	},
	details: async (req, res) => {
		const { uuid } = req.params
		const [slug, clientId] = uuid.split('.')

		try {
			const gp2clients = await Gp2Clients.findOne({
				include: [
					{ model: Clients, as: 'clientInfo', where: { [Op.and]: [{ slug, uuid: clientId }] } },
					{ model: Gp2Info, as: 'gp2Info', attributes: ['id'] },
				],
			})

			const gp2details = await Gp2Details.findAll({
				where: {
					[Op.and]: [{ gp2InfoId: gp2clients.gp2Info.id, gp2ClientId: gp2clients.id }],
				},
				attributes: { exclude: ['gp2ClientId', 'gp2InfoId'] },
				order: [['createdAt', 'ASC']],
			})

			const totals = {
				payment: gp2details.reduce((a, b) => {
					return a + b.payment
				}, 0),
				sk: gp2details.reduce((a, b) => {
					return a + b.sk
				}, 0),
				penalty: gp2details.reduce((a, b) => {
					return a + b.penalty
				}, 0),
			}

			return res.status(200).send({
				status: 400,
				success: true,
				msg: { details: gp2details, totals },
			})
		} catch (error) {
			return res.status(400).send({ status: 400, success: false, error: error.message })
		}
	},

	editDetails: async (req, res) => {
		const { uuid, payment, sk, penalty } = req.body

		try {
			let [, gp2details] = await Gp2Details.update({ payment, sk, penalty }, { where: { uuid }, returning: true })
			const gp2totals = await Gp2Details.findAll({ where: { [Op.and]: [{ gp2InfoId: gp2details[0].gp2InfoId, gp2ClientId: gp2details[0].gp2ClientId }] } })
			const totals = {
				payment: gp2totals.reduce((a, b) => {
					return a + b.payment
				}, 0),
				sk: gp2totals.reduce((a, b) => {
					return a + b.sk
				}, 0),
				penalty: gp2totals.reduce((a, b) => {
					return a + b.penalty
				}, 0),
			}

			await Gp2Clients.update(
				{ skCum: totals.sk },
				{
					where: { id: gp2details[0].gp2ClientId },
				}
			)

			gp2details[0].gp2InfoId = undefined
			gp2details[0].gp2ClientId = undefined

			return res.status(200).send({ status: 200, success: true, msg: { ...gp2details[0].toJSON(), totals } })
		} catch (error) {
			return res.status(500).send({ status: 400, success: false, msg: error.message })
		}
	},
	renew: async (req, res) => {
		const { dateOfFirstPayment, dateOfLastPayment, dateOfReleased, uuid, weeksToPay } = req.body
		console.log(req.body)
		try {
			let gp2infos = await Gp2Info.update(
				{
					dateOfFirstPayment,
					dateOfLastPayment,
					dateOfReleased,
					weeksToPay,
					isVirgin: true,
				},
				{ where: { uuid }, sideEffects: false }
			)
			gp2infos = await Gp2Info.increment('loanCycle', {
				by: 1,
				where: { uuid },
			})
			let payload = {}
			gp2infos[0][0].forEach((value, index) => {
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
			const gp2clientsfind = await Gp2Clients.findOne({
				where: { uuid },
				include: [{ model: Gp2Info, as: 'gp2Info', attributes: ['weeksToPay', 'uuid'] }],
			})
			const lr = gp2clientsfind.gp2Info.weeksToPay === 18 ? (loanAmount * 124.2) / 100 : (loanAmount * 120) / 100

			let payload = {
				lr,
				loanAmount,
				weeks: gp2clientsfind.gp2Info.weeksToPay,
				wi: lr / gp2clientsfind.gp2Info.weeksToPay,
				pastDue: 0,
			}

			const gp2clients = await Gp2Clients.update({ ...payload }, { where: { uuid }, returning: true })
			const gp2clientsall = await Gp2Clients.findAll({
				where: { lr: 0 },
				include: [
					{
						model: Gp2Info,
						as: 'gp2Info',
						where: { uuid: gp2clientsfind.gp2Info.uuid },
						attributes: [],
					},
				],
			})
			const totals = {
				lr: gp2clientsall.reduce((a, b) => {
					return a + b.lr
				}, 0),
				skCum: gp2clientsall.reduce((a, b) => {
					return a + b.skCum
				}, 0),
				wi: gp2clientsall.reduce((a, b) => {
					return a + b.wi
				}, 0),
				pastDue: gp2clientsall.reduce((a, b) => {
					return a + b.pastDue
				}, 0),
			}

			return res.status(200).send({
				status: 200,
				success: true,
				msg: {
					...gp2clients[1][0].toJSON(),
					infoId: gp2clientsfind.gp2Info.uuid,
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
			const deleteinfo = await Gp2Info.findOne({ where: { uuid } })
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
			const deleteclient = await Gp2Clients.findOne({
				where: { uuid },
				include: [{ model: Gp2Info, as: 'gp2Info', attributes: ['uuid'] }],
			})

			info.infoId = deleteclient.gp2Info.uuid
			info.clientId = uuid

			/*

			2021-06-26
			onDelete : 'CASCADE' not working without destroy()
			see in https://github.com/sequelize/sequelize/issues/8444 
			
			workaround
			add destory()
			or reference your model and key in migrations, -> server/src/migrations/20210410155409-create-gp-2-details.js

			*/
			await deleteclient.destroy()

			const gp2clientsall = await Gp2Clients.findAll({
				where: { lr: { [Op.ne]: 0 } },
				include: [
					{
						model: Gp2Info,
						as: 'gp2Info',
						where: { uuid: info.infoId },
						attributes: [],
					},
				],
			})
			const msg = {
				...info,
				totals: {
					lr: gp2clientsall.reduce((a, b) => {
						return a + b.lr
					}, 0),
					skCum: gp2clientsall.reduce((a, b) => {
						return a + b.skCum
					}, 0),
					wi: gp2clientsall.reduce((a, b) => {
						return a + b.wi
					}, 0),
					pastDue: gp2clientsall.reduce((a, b) => {
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
}
