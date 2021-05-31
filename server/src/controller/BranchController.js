const { Branch, Clients, Staffs, Gp2Info, Gp2Clients, Users } = require('../models')

module.exports = {
	index: async (req, res) => {
		try {
			if (req.params.slug) {
				const branch = await Branch.findOne({
					attributes: ['branchName'],
					include: {
						model: Staffs,
						as: 'staffs',
						attributes: ['firstName', 'lastName', 'codeName'],
					},
					where: { slug: req.params.slug },
				})
				if (!branch) {
					return res.status(404).send({ msg: 'Branch not found!' })
				} else {
					return res.status(200).send(branch)
				}
			} else {
				const branch = await Branch.findAll({ attributes: ['branchName', 'slug', 'uuid'] })
				return res.status(200).send(branch)
			}
		} catch (error) {
			return res.status(500).send({ error })
		}
	},
	post: async (req, res) => {
		try {
			const branch = await Branch.create(req.body)
			return res.status(201).send({ sucess: true, status: 201, msg: branch })
		} catch (error) {
			return res.status(400).send({ success: false, status: 400, error: error.message })
		}
	},

	update: async (req, res) => {
		try {
			await Branch.update(req.body, { where: req.params })
			return res.status(200).send({ success: true, msg: 'Branch updated' })
		} catch (error) {
			return res.status(400).send({ error })
		}
	},
	delete: async (req, res) => {
		try {
			const response = await Branch.destroy({ where: req.params })
			return res.status(200).send({ success: true, msg: 'Branch deleted' })
		} catch (error) {
			return res.status(400).send({ error })
		}
	},
}
