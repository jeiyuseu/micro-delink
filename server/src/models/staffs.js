'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class staffs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Branch, GpInfo }) {
			// define association here
			this.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' })
			this.hasMany(GpInfo, { foreignKey: 'staffId', as: 'gpInfo' })
		}

		toJSON() {
			return { ...this.get(), id: undefined, branchId: undefined }
		}
	}
	staffs.init(
		{
			branchId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			codeName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					msg: 'Codename already in used!',
				},
			},
			idNo: {
				type: DataTypes.STRING,
			},
			contactNo: {
				type: DataTypes.STRING,
			},
			address: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: 'Staffs',
			tableName: 'staffs',
			hooks: {
				beforeCreate: function (staff) {
					staff.firstName = staff.firstName.toLowerCase()
					staff.lastName = staff.lastName.toLowerCase()
					staff.codeName = staff.lastName !== null && staff.codeName.toLowerCase()
					staff.address = staff.address !== null && staff.address.toLowerCase()
					return staff
				},
			},
		}
	)
	return staffs
}
