'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('gpDetails', {
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
			gpInfoId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			branchId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			gpClientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			payment: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sk: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			penalty: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
		await queryInterface.dropTable('gpDetails')
	},
}
