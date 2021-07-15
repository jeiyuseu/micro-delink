'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('clients', {
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
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			middleInitial: {
				type: DataTypes.STRING,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			birthdate: {
				type: DataTypes.DATEONLY,
			},
			loanCycle: {
				type: DataTypes.INTEGER,
			},
			skCum: {
				type: DataTypes.INTEGER,
			},
			contactNo: {
				type: DataTypes.STRING,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			slug: {
				type: DataTypes.STRING,
				unique: true,
			},
		})
	},
	down: async (queryInterface, DataTypes) => {
		await queryInterface.dropTable('clients')
	},
}
