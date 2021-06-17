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
						where: { [Op.or]: [{ isVirgin: filter }, sequelize.where(sequelize.col('gp2Clients.lr'), filter1, 0)] },
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
			staffs.gp2Info.forEach((client, i1, array) => {
				gp2Info[i1] = {
					...array[i1].toJSON(),
					totals: {
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
				include: [{ model: Gp2Info, as: 'gp2Info', attributes: ['id', 'uuid', 'branchId'] }],
			})
			const userInfo = await Users.findOne({ where: { uuid: userId.uuid }, attributes: ['id', 'firstName', 'lastName'] })

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

			const gp2clientsall = await Gp2Clients.findAll({ where: { lr: { [Op.gt]: 0 } }, include: [{ model: Gp2Info, as: 'gp2Info', where: { id: gp2clients.gp2Info.id }, attributes: [] }] })

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

			const client = { ...gp2clientsupdate[1][0].toJSON(), infoId: gp2clients.gp2Info.uuid, userInfo, totals }
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

		// try {
		// 	const staff = await Staffs.findOne({
		// 		where: { codeName: codename.split('-')[0] },
		// 		include: ['branch'],
		// 	})

		// 	const branch = await Branch.findOne({ where: { uuid: staff.branch.uuid } })
		// 	const gp2Info = await Gp2Info.findOne({ where: { uuid: gp2InfoUuid } })
		// 	const clients = await Clients.findOne({ where: { uuid: clientUuid } })
		// 	const gp2Clients = await Gp2Clients.findOne({ where: { clientId: clients.id } })

		// 	const authUser = await Users.findOne({ where: { uuid: updatedBy } })

		// 	const payload = {}
		// 	payload.branchId = branch.id
		// 	payload.gp2InfoId = gp2Info.id
		// 	payload.gp2ClientId = gp2Clients.id
		// 	payload.payment = installment || 0
		// 	payload.sk = sk || 0
		// 	payload.penalty = penalty || 0

		// 	await Gp2Details.create({ ...payload })

		// 	const lr = gp2Clients.lr - installment
		// 	const skCum = gp2Clients.skCum + sk

		// 	await Gp2Clients.update({ lr, skCum, pastDue, updatedBy: authUser.id }, { where: { uuid: gp2Clients.uuid } })

		// 	const rowGp2Clients = await Gp2Info.findOne({
		// 		where: { uuid: gp2InfoUuid },
		// 		include: [
		// 			{
		// 				model: Gp2Clients,
		// 				as: 'gp2Clients',
		// 				include: [
		// 					{
		// 						model: Clients,
		// 						as: 'clientInfo',
		// 						order: [['firstName', 'ASC']],
		// 						attributes: ['uuid', 'firstName', 'middleInitial', 'lastName', 'slug'],
		// 					},
		// 					{
		// 						model: Users,
		// 						as: 'userInfo',
		// 						attributes: ['firstName', 'lastName'],
		// 					},
		// 				],
		// 			},
		// 		],
		// 	})

		// 	const payloads = {}
		// 	const gp2InfoPayload = []
		// 	let totals = {}
		// 	rowGp2Clients.gp2Clients.forEach((element1, i1, array) => {
		// 		gp2InfoPayload[i1] = {
		// 			...array[i1].toJSON(),
		// 		}
		// 		totals = {
		// 			lr: array.reduce((a, b) => {
		// 				return a + b.lr
		// 			}, 0),
		// 			skCum: array.reduce((a, b) => {
		// 				return a + b.skCum
		// 			}, 0),
		// 			wi: array.reduce((a, b) => {
		// 				return a + b.wi
		// 			}, 0),
		// 			pastDue: array.reduce((a, b) => {
		// 				return a + b.pastDue
		// 			}, 0),
		// 		}
		// 	})
		// 	payloads.gp2Clients = gp2InfoPayload
		// 	payloads.totals = totals
		// 	payloads.uuid = gp2InfoUuid
		// 	return res.status(200).send({ success: true, msg: clients.firstName + ' ' + clients.lastName + ' is updated!', res: payloads })
		// } catch (error) {
		// 	return res.status(400).send({ success: false, msg: error.message })
		// }
	},
	postClient: async (req, res) => {
		const formData = req.body
		const { uuid } = req.params

		try {
			const clients = await Clients.findAll({ attributes: ['id', 'firstName', 'middleInitial', 'lastName'], where: { uuid: { [Op.in]: formData.map((value) => value.id) } } })
			let gp2info = await Gp2Info.findOne({
				where: { uuid },
			})
			let payload = []
			let totals
			let response = {}
			formData.forEach((value, index) => {
				const lr = gp2info.weeksToPay === 16 && value.loanAmount * 1.2
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
			const gp2Clients = await Gp2Clients.bulkCreate(payload)
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
			return res.status(400).send({ status: 400, success: false, error: error.message })
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
			console.log(error)
			return res.status(400).send({ status: 400, success: false, error: error.message })
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

			return res.status(200).send({ status: 400, success: true, response: { details: gp2details, totals: gp2detailssum } })
		} catch (error) {
			return res.status(400).send({ status: 400, success: false, error: error.message })
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
			return res.status(200).send({ status: 200, success: true, msg: gp2clients })
		} catch (error) {
			return res.status(500).send({ status: 500, success: false, msg: error.message })
		}
	},
	renew: async (req, res) => {
		const { dateOfFirstPayment, dateOfLastPayment, dateOfReleased, uuid, weeksToPay } = req.body
		console.log(req.body)
		try {
			let gp2infos = await Gp2Info.update({ dateOfFirstPayment, dateOfLastPayment, dateOfReleased, weeksToPay, isVirgin: true }, { where: { uuid }, sideEffects: false })
			gp2infos = await Gp2Info.increment('loanCycle', { by: 1, where: { uuid } })
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
			const gp2clientsfind = await Gp2Clients.findOne({ where: { uuid }, include: [{ model: Gp2Info, as: 'gp2Info', attributes: ['weeksToPay', 'uuid'] }] })
			const lr = gp2clientsfind.gp2Info.weeksToPay === 16 && loanAmount * 1.2

			let payload = {
				lr,
				loanAmount,
				weeks: gp2clientsfind.gp2Info.weeksToPay,
				wi: lr / gp2clientsfind.gp2Info.weeksToPay,
				pastDue: 0,
			}

			const gp2clients = await Gp2Clients.update({ ...payload }, { where: { uuid }, returning: true })
			const gp2clientsall = await Gp2Clients.findAll({ where: { lr: 0 }, include: [{ model: Gp2Info, as: 'gp2Info', where: { uuid: gp2clientsfind.gp2Info.uuid }, attributes: [] }] })
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

			return res.status(200).send({ status: 200, success: true, msg: { ...gp2clients[1][0].toJSON(), infoId: gp2clientsfind.gp2Info.uuid, totals } })
		} catch (error) {
			return res.status(400).send({ status: 400, success: true, error: error.message })
		}

		// const { info, client } = req.body
		// const { id, ...newInfo } = info
		// let payload = {}

		// Object.values(client).forEach((data, i) => {
		// 	const lr = info.weeksToPay === 16 && data.loanAmount * 1.2
		// 	payload[i] = {
		// 		uuid: data.clientId,
		// 		lr,
		// 		wi: lr / info.weeksToPay,
		// 		weeks: info.weeksToPay,
		// 		pastDue: 0,
		// 		loanAmount: data.loanAmount,
		// 	}
		// })

		// try {
		// 	const gp2info = await Gp2Info.findOne({
		// 		include: ['codename', 'staffs'],
		// 		where: { uuid: info.id },
		// 	})

		// 	newInfo.loanCycle = gp2info.loanCycle + 1

		// 	const clientid = await Gp2Clients.findAll({
		// 		where: { uuid: { [Op.in]: Object.values(payload).map((v) => v.uuid) } },
		// 	})

		// 	await Gp2Details.destroy({
		// 		where: {
		// 			gp2InfoId: gp2info.id,
		// 			gp2ClientId: { [Op.in]: Object.values(clientid).map((v) => v.id) },
		// 		},
		// 	})
		// 	await Gp2Info.update(newInfo, { where: { uuid: info.id } })
		// 	await Gp2Clients.bulkCreate(Object.values(payload), {
		// 		updateOnDuplicate: ['lr', 'wi', 'weeks', 'pastDue', 'loanAmount'],
		// 	})
		// 	return res.status(201).send({
		// 		status: 201,
		// 		success: true,
		// 		msg: `${gp2info.staffs.codeName}-${gp2info.codename.name}-${gp2info.id} is successfully reloaned!`,
		// 		resId: info.id,
		// 	})
		// } catch (error) {
		// 	return res.status(400).send({ success: false, msg: error.message })
		// }
	},
}
