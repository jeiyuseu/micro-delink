'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class gpInfoCode extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	gpInfoCode.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			name: {
				type: DataTypes.STRING(55),
				allowNull: false,
				unique: {
					msg: 'Codename is already in used!',
				},
			},
		},
		{
			sequelize,
			modelName: 'GpInfoCode',
			tableName: 'gpInfoCodes',
			hooks: {
				beforeCreate: function (info) {
					info.name = info.name.toLowerCase()
					return info
				},
			},
		}
	)
	return gpInfoCode
}
