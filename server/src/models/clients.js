'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes, Slugify) => {
	class clients extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
		toJSON() {
			return {
				...this.get(),
				id: undefined,
			}
		}
	}
	clients.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			middleInitial: {
				type: DataTypes.STRING,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			birthdate: {
				type: DataTypes.DATEONLY,
			},
			loanCycle: {
				type: DataTypes.INTEGER,
			},
			contactNo: {
				type: DataTypes.STRING,
			},
			slug: {
				type: DataTypes.STRING,
				unique:true
			},
		},
		{
			sequelize,
			tableName: 'clients',
			modelName: 'Clients',
			hooks: {
				beforeCreate: function (client) {
					client.firstName = client.firstName.toLowerCase()
					client.lastName = client.lastName.toLowerCase()
					client.middleInitial = client.middleInitial.toLowerCase()
					client.address = client.address.toLowerCase()
					client.slug = Slugify(`${client.firstName.toLowerCase()} ${client.middleInitial.toLowerCase()} ${client.lastName.toLowerCase()}`)
					return client
				},
			},
		}
	)

	return clients
}
