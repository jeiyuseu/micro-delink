'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gp2Clients extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Gp2Info, Clients, Users }) {
			// define association here
			this.belongsTo(Gp2Info, { foreignKey: 'infoId', as: 'gp2Info' })
			this.belongsTo(Clients, { foreignKey: 'clientId', as: 'clientInfo' })
			this.belongsTo(Users, { foreignKey: 'updatedBy', as: 'userInfo' })
		}
		toJSON() {
			return {
				...this.get(),
				id: undefined,
				infoId: undefined,
				clientId: undefined,
			}
		}
	}
	gp2Clients.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				unique: true,
			},
			infoId: {
				type: DataTypes.INTEGER,
				// allowNull: false,
			},
			clientId: {
				type: DataTypes.INTEGER,
				// allowNull: false,
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
				defaultValue: 0,
			},
			wi: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			pastDue: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			loanAmount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			updatedBy: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: 'Gp2Clients',
			tableName: 'gp2Clients',
		}
	)
	return gp2Clients
}
