const { Staffs, Branch, Gp2Info, Gp2Clients, Op, sequelize } = require('../models')

module.exports = {
	index: async (req, res) => {
		try {
			const staffs = await Staffs.findAll({
				include: 'branch',
			})
			return res.status(200).send(staffs)
		} catch (error) {
			return res.status(400).send({ error: error })
		}
	},
	post: async (req, res) => {
		try {
			const branch = await Branch.findOne({ where: { uuid: req.body.uuidBranchId } })
			const { firstName, lastName } = await Staffs.create({ ...req.body, branchId: branch.id })
			return res.status(201).send({ success: true, msg: `${firstName} ${lastName} is added!` })
		} catch (error) {
			return res.status(400).send({ error: error.message })
		}
	},
}
