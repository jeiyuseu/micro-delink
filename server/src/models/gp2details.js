'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gp2Details extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Gp2Clients }) {
			this.belongsTo(Gp2Clients, {
				foreignKey: 'gp2ClientId',
				as: 'gp2Clients',
			})
		}
		toJSON() {
			return {
				...this.get(),
				id: undefined,
				branchId: undefined,
			}
		}
	}

	gp2Details.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
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
		},
		{
			sequelize,
			modelName: 'Gp2Details',
			tableName: 'gp2Details',
		}
	)
	return gp2Details
}
