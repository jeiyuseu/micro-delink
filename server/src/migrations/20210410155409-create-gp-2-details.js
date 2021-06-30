'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('gp2Details', {
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
			gp2InfoId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			branchId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			gp2ClientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				// onDelete: 'CASCADE',
				// references: {
				// 	model: 'gp2Clients',
				// 	key: 'id',
				// },
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
		await queryInterface.dropTable('gp2Details')
	},
}
