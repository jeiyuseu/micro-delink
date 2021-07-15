'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gpInfo extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ GpClients, Staffs, GpInfoCode, GpDetails, GpWithdrawals }) {
			// define association here
			this.hasMany(GpClients, { foreignKey: 'infoId', as: 'gpClients', onDelete: 'CASCADE', hooks: true })
			this.belongsTo(Staffs, { foreignKey: 'staffId', as: 'staffs' })
			this.belongsTo(GpInfoCode, { foreignKey: 'gpInfoCodeId', as: 'codename', onDelete: 'CASCADE', hooks: true })
			this.hasMany(GpWithdrawals, { foreignKey: 'gpInfoId', as: 'gpWithdrawals' })
		}
		toJSON() {
			return {
				...this.get(),
				id: undefined,
				gpInfoCodeId: undefined,
				staffId: undefined,
				branchId: undefined,
				staffs: undefined,
				codename: undefined,
			}
		}
	}
	gpInfo.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			staffId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			branchId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			gpInfoCodeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			isVirgin: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			dateOfReleased: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			dateOfFirstPayment: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			dateOfLastPayment: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			weeksToPay: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			totalCollected: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			loanCycle: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			codeNameId: {
				type: DataTypes.VIRTUAL,
				get() {
					return this.get('codename').name
				},
			},
			staffCodeNameId: {
				type: DataTypes.VIRTUAL,
				get() {
					return this.get('staffs').codeName
				},
			},
		},
		{
			sequelize,
			modelName: 'GpInfo',
			tableName: 'gpInfos',
		}
	)
	return gpInfo
}
