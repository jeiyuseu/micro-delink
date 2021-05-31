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
			//eager loading for create then return data. still has issues
			const staffId = await Staffs.create({ ...req.body, branchId: branch.id }, { include: { model: Branch, as: 'branch' } })
			const staff = await Staffs.findOne({ attributes: ['firstName', 'lastName'], where: { uuid: staffId.uuid }, include: { model: Branch, as: 'branch', attributes: ['branchName'] } })
			return res.status(201).send({ success: true, status: 201, msg: staff })
		} catch (error) {
			return res.status(400).send({ error: error.message })
		}
	},
}
