'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('gpInfos', {
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

			gpInfoCodeId: {
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
			isVirgin: {
				type: DataTypes.BOOLEAN,
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
		await queryInterface.dropTable('gpInfos')
	},
}
