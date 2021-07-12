'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gpDetails extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ GpClients }) {
			this.belongsTo(GpClients, {
				foreignKey: 'gpClientId',
				as: 'gpClients',
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

	gpDetails.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
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
		},
		{
			sequelize,
			modelName: 'GpDetails',
			tableName: 'gpDetails',
		}
	)
	return gpDetails
}
