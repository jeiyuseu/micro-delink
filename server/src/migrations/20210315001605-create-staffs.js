'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('staffs', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			branchId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			uuid: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			codeName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			idNo: {
				type: DataTypes.STRING,
			},
			contactNo: {
				type: DataTypes.STRING,
			},
			address: {
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
		})
	},
	down: async (queryInterface, DataTypes) => {
		await queryInterface.dropTable('staffs')
	},
}
