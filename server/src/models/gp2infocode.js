'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gp2InfoCode extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	gp2InfoCode.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			name: {
				type: DataTypes.STRING(11),
				allowNull: false,
				unique: {
					msg: 'Codename already in used!',
				},
			},
		},
		{
			sequelize,
			modelName: 'Gp2InfoCode',
			tableName: 'gp2InfoCodes',
			hooks: {
				beforeCreate: function (info) {
					info.name = info.name.toLowerCase()
					return info
				},
			},
		}
	)
	return gp2InfoCode
}
