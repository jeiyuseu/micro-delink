'use strict'
const { Model, Op } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gpClients extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ GpInfo, Clients, Users, GpDetails, GpWithdrawals }) {
			// define association here
			this.belongsTo(GpInfo, { foreignKey: 'infoId', as: 'gpInfo' })
			this.belongsTo(Clients, { foreignKey: 'clientId', as: 'clientInfo' })
			this.belongsTo(Users, { foreignKey: 'updatedBy', as: 'userInfo' })
			this.hasMany(GpWithdrawals, { foreignKey: 'gpClientId', as: 'gpWithdrawals' })

			this.hasMany(GpDetails, {
				foreignKey: 'gpClientId',
				onDelete: 'CASCADE',
				hooks: true,
			})
		}
	}
	gpClients.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				unique: true,
			},
			infoId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			clientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					isUnique: (client, next) => {
						gpClients
							.findOne({
								attributes: ['id', 'uuid'],
								where: { clientId: client },
								include: ['clientInfo'],
							})
							.then((result) => {
								next(result.clientInfo.firstName + ' ' + result.clientInfo.middleInitial + ' ' + result.clientInfo.lastName + ' is exists!')
							})
							.catch(() => next())
					},
				},
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
			wi: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			pastDue: {
				type: DataTypes.INTEGER,
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
			modelName: 'GpClients',
			tableName: 'gpClients',
			hooks: {
				beforeUpdate: function (value) {
					Cli
				},
			},
		}
	)
	return gpClients
}
