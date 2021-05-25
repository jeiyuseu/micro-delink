'use strict'
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable('branches', {
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
			branchName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			slug: {
				type: DataTypes.STRING,
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
		await queryInterface.dropTable('branches')
	},
}
