'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gp2Info extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Gp2Clients, Staffs, Gp2InfoCode }) {
			// define association here
			this.hasMany(Gp2Clients, { foreignKey: 'infoId', as: 'gp2Clients' })
			this.belongsTo(Staffs, { foreignKey: 'staffId', as: 'staffs' })
			this.belongsTo(Gp2InfoCode, { foreignKey: 'gp2InfoCodeId', as: 'codename' })
		}
		toJSON() {
			return {
				...this.get(),
				id: undefined,
				gp2InfoCodeId: undefined,
				staffId: undefined,
				branchId: undefined,
				staffs: undefined,
				codename: undefined,
			}
		}
	}
	gp2Info.init(
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
			gp2InfoCodeId: {
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
			modelName: 'Gp2Info',
			tableName: 'gp2Infos',
		}
	)
	return gp2Info
}
