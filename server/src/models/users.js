'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Gp2Clients }) {
			// define association here
			this.hasMany(Gp2Clients, { foreignKey: 'id', as: 'userInfo' })
		}
		toJSON() {
			return { ...this.get(), id: undefined }
		}
	}
	users.init(
		{
			uuid: {
				type: DataTypes.UUID,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: 'User must have a first name' },
					notEmpty: { msg: 'First name must not be empty' },
				},
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: 'User must have a last name' },
					notEmpty: { msg: 'Last name must not be empty' },
				},
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: { msg: 'Username is already taken' },
				validate: {
					notNull: { msg: 'User must have a username' },
					notEmpty: { msg: 'Username must not be empty' },
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: { msg: 'Email is already taken' },
				validate: {
					notNull: { msg: 'User must have a username' },
					notEmpty: { msg: 'Username must not be empty' },
					isEmail: { msg: 'User must provide a valid email address' },
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,

				validate: {
					notNull: { msg: 'User must have a password' },
					notEmpty: { msg: 'Password must not be empty' },
				},
			},
		},
		{
			sequelize,
			tableName: 'users',
			modelName: 'Users',
			hooks: {
				beforeCreate: function (user) {
					user.firstName = user.firstName.toLowerCase()
					user.lastName = user.lastName.toLowerCase()
					user.username = user.username.toLowerCase()

					return user
				},
			},
		}
	)
	return users
}
