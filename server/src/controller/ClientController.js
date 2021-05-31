const { Clients, Op, sequelize } = require('../models')
const slug = require('slug')

module.exports = {
	index: async (req, res) => {
		const page = parseInt(req.query.page)
		const limit = parseInt(req.query.items)
		const search = req.query.search || ''
		const start = (page - 1) * limit
		let numPages
		const payload = {}

		try {
			const clients = await Clients.findAndCountAll({
				where: {
					[Op.or]: [
						sequelize.where(sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')), {
							[Op.like]: `%${search}%`,
						}),
						{
							address: { [Op.like]: `%${search}%` },
						},
					],
				},
			})

			numPages = Math.ceil(clients.count / limit)
			payload.totalPages = numPages
			payload.totalItems = clients.count

			if (!isNaN(limit)) {
				const clientsData = await Clients.findAll({
					order: [['updatedAt', 'DESC']],
					where: {
						[Op.or]: [
							sequelize.where(sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')), {
								[Op.like]: `%${search}%`,
							}),
							{
								address: { [Op.like]: `%${search}%` },
							},
						],
					},
					offset: start,
					limit: limit,
				})

				payload.currentPage = page <= numPages ? page : 'undefined'
				payload.nextPage = page < numPages ? page + 1 : 'undefined'
				payload.prevPage = page - 1
				payload.clients = clientsData

				return res.status(200).send(payload)
			} else {
				const clientsData = await Clients.findAll({
					order: [['updatedAt', 'DESC']],
					where: {
						[Op.or]: [
							sequelize.where(sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')), {
								[Op.like]: `%${search}%`,
							}),
							{
								address: { [Op.like]: `%${search}%` },
							},
						],
					},
				})
				return res.status(200).send({ clients: clientsData })
			}
		} catch (error) {
			return res.status(500).send({ error: error.message })
		}
	},

	post: async (req, res) => {
		let payload = req.body
		payload.birthdate = payload.birthdate === '' ? null : payload.birthdate

		try {
			const clients = await Clients.create(payload)

			return res.status(201).send({ status: 201, success: true, msg: clients })
		} catch (error) {
			return res.status(400).send({ error: error.message })
		}
	},

	update: async (req, res) => {
		const { id } = req.params
		const payload = req.body
		payload.birthdate = payload.birthdate === '' ? null : payload.birthdate
		for (const key in payload) {
			if (key === 'id') {
				delete payload[key]
			}
		}

		try {
			const client = await Clients.update({ ...payload }, { where: { uuid: id } })

			return res.status(200).send({ success: true, msg: 'Client updated!' })
		} catch (error) {
			return res.status(400).send({ success: false, error: error.message })
		}
	},

	delete: async (req, res) => {
		const { id } = req.params

		try {
			await Clients.destroy({ where: { uuid: id } })
			return res.status(200).send({ success: true, msg: 'Client deleted!' })
		} catch (error) {
			return res.status(400).send({ error: error.message })
		}
	},
}
