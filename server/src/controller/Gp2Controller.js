const { Gp2Info, Gp2Clients, Gp2Details, Branch, Staffs, Clients, Users, Gp2InfoCode, Op, sequelize } = require('../models')

module.exports = {
	index: async (req, res) => {
		const { codename } = req.params

		let filter = typeof req.path.split('/')[2] !== 'undefined' ? '<=' : '>'

		try {
			const code = codename.split('-')[0]
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
						attributes: ['id', 'uuid', 'weeksToPay', 'loanCycle', 'dateOfFirstPayment', 'dateOfReleased', 'dateOfLastPayment'],
						where: sequelize.where(sequelize.col('gp2Clients.lr'), filter, 0),
						include: [
							{
								model: Gp2Clients,
								as: 'gp2Clients',

								where: sequelize.where(sequelize.col('lr'), filter, 0),
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

			// attempting to get sum and returning all columns using sequelize function

			// const staffs = await Staffs.findOne({
			// 	include: {
			// 		model: Gp2Info,
			// 		as: 'gp2Info',
			// 		separate: true,
			// 		attributes: [
			// 			'id',
			// 			'uuid',
			// 			'weeksToPay',
			// 			'dateOfFirstPayment',
			// 			'dateOfReleased',
			// 			'dateOfLastPayment',
			// 			'gp2InfoId',
			// 			// [sequelize.col('gp2Clients.id'), 'id'],
			// 			[sequelize.fn('SUM', sequelize.col('gp2Clients.lr')), 'totalLr'],
			// 			// [sequelize.col('gp2Clients.lr'), 'lr'],
			// 		],

			// 		include: [
			// 			{
			// 				model: Gp2Clients,
			// 				as: 'gp2Clients',
			// 				// attributes: [],
			// 				// raw: true,
			// 				required: true,
			// 			},
			// 		],
			// 		// nest: true,
			// 		// group: [
			// 		// 	'gp2Clients.infoId',
			// 		// 	'Gp2Info.id',
			// 		// 	'Gp2Info.uuid',
			// 		// 	'Gp2Info.weeksToPay',
			// 		// 	'Gp2Info.dateOfReleased',
			// 		// 	'Gp2Info.dateOfLastPayment',
			// 		// 	'Gp2Info.dateOfLastPayment',
			// 		// 	'Gp2Info.gp2InfoId',
			// 		// ],
			// 	},

			// 	logging: true,
			// 	where: { codeName: code },
			// })

			const payload = {}
			const gp2Info = []

			payload.codeName = staffs.codeName
			staffs.gp2Info.forEach((element1, i1, array) => {
				element1.gp2Clients.forEach((element2, i2) => {
					gp2Info[i1] = {
						...array[i1].toJSON(),
						totals: {
							lr: element1.gp2Clients.reduce((a, b) => {
								return a + b.lr
							}, 0),
							skCum: element1.gp2Clients.reduce((a, b) => {
								return a + b.skCum
							}, 0),
							wi: element1.gp2Clients.reduce((a, b) => {
								return a + b.wi
							}, 0),
							pastDue: element1.gp2Clients.reduce((a, b) => {
								return a + b.pastDue
							}, 0),
						},
					}
					payload.gp2Info = gp2Info
				})
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
		const { info } = req.body

		try {
			//delete null values in req.body.info
			for (const key in info) {
				if (info[key] === null) {
					delete info[key]
				}
			}

			const staff = await Staffs.findOne({
				include: 'branch',
				where: { codeName: req.body.codename.split('-')[0] },
			})
			const branch = await Branch.findOne({
				where: { uuid: staff.branch.uuid },
			})

			if (req.body.client.client1.clientId === req.body.client.client2.clientId) {
				return res.status(400).send({ error: ["Can't select two same clients!"] })
			}
			const clientId = await Clients.findAndCountAll({
				where: {
					[Op.or]: [{ uuid: req.body.client.client1.clientId }, { uuid: req.body.client.client2.clientId }],
				},
			})

			const isClientExists = await Gp2Clients.findAndCountAll({
				include: 'clientInfo',
				where: {
					[Op.or]: [{ clientId: clientId.rows[0].id }, { clientId: clientId.rows[1].id }],
				},
			})

			const errors = isClientExists.rows.map((value) => value.clientInfo.firstName + ' ' + value.clientInfo.lastName + ' is exists!')

			if (isClientExists.count > 0) {
				return res.status(400).send({ error: errors })
			}
			const infocode = await Gp2InfoCode.create({ name: info.infoDesc })
			const gp2infocodeexists = await Gp2InfoCode.findOne({ where: { uuid: infocode.uuid } })
			const gp2infocount = await Gp2Info.count({
				where: { staffId: staff.id, gp2InfoCodeId: gp2infocodeexists.id },
			})
			info.gp2InfoCodeId = gp2infocodeexists.id

			const { uuid, dateOfFirstPayment, dateOfLastPayment, dateOfReleased, loanCycle, weeksToPay } = await Gp2Info.create({
				...info,	
				staffId: staff.id,
				branchId: branch.id,
			})

			if (gp2infocount <= 20) {
				const client1 = {}
				const lr1 = req.body.info.weeksToPay === 16 && req.body.client.client1.loanAmount * 1.2

				client1.clientId = clientId.rows[0].id

				client1.loanAmount = parseInt(req.body.client.client1.loanAmount)
				client1.lr = lr1
				client1.wi = lr1 / req.body.info.weeksToPay
				client1.weeks = req.body.info.weeksToPay
				client1.pastDue = 0

				const client2 = {}
				const lr2 = req.body.info.weeksToPay === 16 && req.body.client.client2.loanAmount * 1.2

				client2.clientId = clientId.rows[1].id
				client2.loanAmount = parseInt(req.body.client.client2.loanAmount)
				client2.lr = lr2
				client2.wi = lr2 / req.body.info.weeksToPay
				client2.weeks = req.body.info.weeksToPay
				client2.pastDue = 0

				const gp2InfoIds = await Gp2Info.findOne({
					where: { uuid },
				})

				client1.infoId = gp2InfoIds.id
				client2.infoId = gp2InfoIds.id

				const gp2Clients = await Gp2Clients.bulkCreate(Object.values({ client1, client2 }), { include: ['userInfo'] })

				let payload = {}
				let client = []

				gp2Clients.forEach((value, index, array) => {
					client[index] = {
						...array[index].toJSON(),
						userInfo: null,
						clientInfo: clientId.rows[index],
					}
				})

				const filteredGp2Info = {
					uuid,
					dateOfFirstPayment,
					dateOfReleased,
					dateOfLastPayment,
					weeksToPay,
					id: (staff.codeName + '-' + gp2infocodeexists.name).toUpperCase(),
					loanCycle,
					
				}
				for (const key in filteredGp2Info) {
					payload = {
						...filteredGp2Info,
						gp2Clients: client,
						totals: {
							lr: gp2Clients.reduce((a, b) => {
								return a + b.lr
							}, 0),
							skCum: gp2Clients.reduce((a, b) => {
								return a + b.skCum
							}, 0),
							wi: gp2Clients.reduce((a, b) => {
								return a + b.wi
							}, 0),
							pastDue: gp2Clients.reduce((a, b) => {
								return a + b.pastDue
							}, 0),
						},
					}
				}

				return res.status(201).send({
					success: true,
					status: 201,
					msg: payload,
				})
			} else {
				return res.status(400).send({
					error: [`Clients is already full for "${gp2infocodeexists.name}", maximum of 20 clients!`],
				})
			}
		} catch (error) {
			return res.status(500).send({ error: [error.message] })
		}
	},
	update: async (req, res) => {
		const { codename, clientUuid, gp2InfoUuid, installment, penalty, sk, updatedBy } = req.body

		try {
			const staff = await Staffs.findOne({
				where: { codeName: codename.split('-')[0] },
				include: ['branch'],
			})

			const branch = await Branch.findOne({ where: { uuid: staff.branch.uuid } })
			const gp2Info = await Gp2Info.findOne({ where: { uuid: gp2InfoUuid } })
			const clients = await Clients.findOne({ where: { uuid: clientUuid } })
			const gp2Clients = await Gp2Clients.findOne({ where: { clientId: clients.id } })

			const authUser = await Users.findOne({ where: { uuid: updatedBy } })
			let pastDue
			if (installment === 0) {
				pastDue = gp2Clients.wi + gp2Clients.pastDue
			} else if (installment < gp2Clients.wi) {
				pastDue = gp2Clients.wi - installment + gp2Clients.pastDue
			} else {
				pastDue = 0
			}

			const payload = {}
			payload.branchId = branch.id
			payload.gp2InfoId = gp2Info.id
			payload.gp2ClientId = gp2Clients.id
			payload.payment = installment || 0
			payload.sk = sk || 0
			payload.penalty = penalty || 0

			await Gp2Details.create({ ...payload })

			const lr = gp2Clients.lr - installment
			const skCum = gp2Clients.skCum + sk

			await Gp2Clients.update({ lr, skCum, pastDue, updatedBy: authUser.id }, { where: { uuid: gp2Clients.uuid }})

			const rowGp2Clients = await Gp2Info.findOne({
			
				where: { uuid: gp2InfoUuid },
				include: [{ model: Gp2Clients, as: 'gp2Clients', include:[{
					model: Clients,
					as: 'clientInfo',
					order: [['firstName', 'ASC']],
					attributes: ['uuid', 'firstName', 'middleInitial', 'lastName', 'slug'],
				},{
					model: Users,
					as: 'userInfo',
					attributes: ['firstName', 'lastName'],
				},] }],
			})
		
			const payloads = {}
			const gp2InfoPayload = []
			let totals = {}
			rowGp2Clients.gp2Clients.forEach((element1, i1, array) => {
				gp2InfoPayload[i1] = {
					...array[i1].toJSON(),
				}
				totals = {
					lr: array.reduce((a, b) => {
						return a + b.lr
					}, 0),
					skCum: array.reduce((a, b) => {
						return a + b.skCum
					}, 0),
					wi: array.reduce((a, b) => {
						return a + b.wi
					}, 0),
					pastDue: array.reduce((a, b) => {
						return a + b.pastDue
					}, 0),
				}
				
			})
			payloads.gp2Clients = gp2InfoPayload
			payloads.totals = totals
			payloads.uuid = gp2InfoUuid
			return res.status(200).send({ success: true, msg: clients.firstName + ' ' + clients.lastName + ' is updated!', res: payloads })
		} catch (error) {
			return res.status(400).send({ success: false, msg: error.message })
		}
	},

	details: async (req, res) => {
		const { uuid } = req.params

		const slug = uuid.split('.')[0]
		const clientUuid = uuid.split('.')[1]

		try {
			const clients = await Clients.findOne({
				where: { [Op.and]: [{ slug, uuid: clientUuid }] },
			})

			const gp2clients = await Gp2Clients.findOne({
				include: { model: Gp2Info, as: 'gp2Info' },
				where: { [Op.and]: [{ clientId: clients.id }] },
			})

			const infoId = gp2clients.gp2Info.id

			const gp2details = await Gp2Details.findAll({
				where: { [Op.and]: [{ gp2InfoId: infoId, gp2ClientId: gp2clients.id }] },
				order: [['createdAt', 'ASC']],
			})
			const gp2detailssum = await Gp2Details.findOne({
				attributes: [
					[sequelize.fn('SUM', sequelize.col('payment')), 'payment'],
					[sequelize.fn('SUM', sequelize.col('sk')), 'sk'],
					[sequelize.fn('SUM', sequelize.col('penalty')), 'penalty'],
				],
				where: { [Op.and]: [{ gp2InfoId: infoId, gp2ClientId: gp2clients.id }] },
			})

			return res.status(200).send({ response: { details: gp2details, totals: gp2detailssum } })
		} catch (error) {
			return res.status(400).send({ success: false, error: error.message })
		}
	},

	updateDetails: async (req, res) => {
		const { id, uuid, payment, sk, penalty } = req.body
		const [clientSlug, clientUuid] = uuid.split('.')
		try {
			const gp2detailsfind = await Gp2Details.findOne({ where: { uuid: id } })
			let gp2details = await Gp2Details.update({ payment, sk, penalty }, { where: { uuid: id }, returning: true })
			let gp2clients = await Gp2Clients.findOne({
				include: [{ model: Clients, as: 'clientInfo', where: { uuid: clientUuid, slug: clientSlug } }],
			})
			gp2details = gp2details[1]

			const payload = {}

			if (gp2detailsfind.sk > sk) {
				payload.sk = gp2clients.skCum - (gp2detailsfind.sk - sk)
			} else if (gp2detailsfind.sk < sk) {
				payload.sk = gp2clients.skCum + (sk - gp2detailsfind.sk)
			} else {
				payload.sk = 0
			}

			const clients = await Clients.findOne({ where: { uuid: clientUuid, slug: clientSlug } })

			gp2clients = await Gp2Clients.update({ skCum: payload.sk }, { where: { clientId: clients.id } })
			return res.status(200).send({ success: true, msg: gp2clients })
		} catch (error) {
			return res.status(500).send({ success: false, msg: error.message })
		}
	},

	reloan: async (req, res) => {
		const { info, client } = req.body
		const { id, ...newInfo } = info
		let payload = {}

		Object.values(client).forEach((data, i) => {
			const lr = info.weeksToPay === 16 && data.loanAmount * 1.2
			payload[i] = {
				uuid: data.clientId,
				lr,
				wi: lr / info.weeksToPay,
				weeks: info.weeksToPay,
				pastDue: 0,
				loanAmount: data.loanAmount,
			}
		})

		try {
			const gp2info = await Gp2Info.findOne({
				include: ['codename', 'staffs'],
				where: { uuid: info.id },
			})

			newInfo.loanCycle = gp2info.loanCycle + 1

			const clientid = await Gp2Clients.findAll({
				where: { uuid: { [Op.in]: Object.values(payload).map((v) => v.uuid) } },
			})

			await Gp2Details.destroy({
				where: {
					gp2InfoId: gp2info.id,
					gp2ClientId: { [Op.in]: Object.values(clientid).map((v) => v.id) },
				},
			})
			await Gp2Info.update(newInfo, { where: { uuid: info.id } })
			await Gp2Clients.bulkCreate(Object.values(payload), {
				updateOnDuplicate: ['lr', 'wi', 'weeks', 'pastDue', 'loanAmount'],
			})
			return res.status(201).send({
				status:201,
				success: true,
				msg: `${gp2info.staffs.codeName}-${gp2info.codename.name}-${gp2info.id} is successfully reloaned!`,
				resId:info.id
			})
		} catch (error) {
			return res.status(400).send({ success: false, msg: error.message })
		}
	},

	info: async (req, res) => {
		try {
			const codename = await Gp2InfoCode.findAll()
			return res.status(200).send(codename)
		} catch (error) {
			return res.status(400).send({ error: error.message })
		}
	},
}
