'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gpWithdrawals extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	gpWithdrawals.init(
		{
			gpInfoId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			gpClientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			withdrawBy: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			sequelize,

			modelName: 'GpWithdrawals',
			tableName: 'gpWithdrawals',
		}
	)
	return gpWithdrawals
}
