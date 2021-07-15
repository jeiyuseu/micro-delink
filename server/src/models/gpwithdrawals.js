'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gpWithdrawals extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ GpClients, Users, Clients }) {
			// define association here
			this.belongsTo(GpClients, { foreignKey: 'clientId', as: 'gpClients' })
			this.belongsTo(Users, { foreignKey: 'withdrawBy', as: 'userInfo' })
			this.belongsTo(Clients, { foreignKey: 'clientId', as: 'clientInfo' })
		}
	}
	gpWithdrawals.init(
		{
			uuid: {
				type: DataTypes.UUID,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
			},
			clientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
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
