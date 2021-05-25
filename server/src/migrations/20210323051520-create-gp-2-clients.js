'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('gp2Clients', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			uuid: {
				type: DataTypes.UUID,
				allowNull: false,
				unique: true,
			},
			infoId: {
				type: DataTypes.INTEGER,
				// allowNull: false,
			},
			clientId: {
				type: DataTypes.INTEGER,
				// allowNull: false,
				unique: true,
			},
			lr: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			weeks: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			skCum: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			skCum: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			wi: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			pastDue: {
				type: DataTypes.INTEGER,
			},
			loanAmount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			updatedBy: {
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
		await queryInterface.dropTable('gp2Clients')
	},
}
