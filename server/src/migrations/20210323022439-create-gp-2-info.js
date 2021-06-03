'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('gp2Infos', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			uuid: {
				type: DataTypes.UUID,
				allowNull: false,
			},
		
			gp2InfoCodeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			staffId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			branchId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			dateOfReleased: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			dateOfFirstPayment: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			dateOfLastPayment: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			weeksToPay: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			totalCollected: {
				type: DataTypes.INTEGER,
			},
			loanCycle: {
				type: DataTypes.INTEGER,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		})
	},
	down: async (queryInterface, DataTypes) => {
		await queryInterface.dropTable('gp2Infos')
	},
}
