;('use strict')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes, SequelizeSlugify) => {
	class branch extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Staffs }) {
			// define association here
			this.hasMany(Staffs, { foreignKey: 'branchId', as: 'staffs' })
		}

		toJSON() {
			return { ...this.get(), id: undefined }
		}
	}
	branch.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			branchName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: 'Branch must have a name' },
					notEmpty: { msg: 'Branch must not be empty' },
				},
			},
			slug: {
				type: DataTypes.STRING,
				unique: true,
			},
		},
		{
			sequelize,
			tableName: 'branches',
			modelName: 'Branch',
			hooks: {
				beforeCreate: function (branch) {
					branch.branchName = branch.branchName.toLowerCase()
				},
			},
		}
	)

	SequelizeSlugify.slugifyModel(branch, {
		source: ['branchName'],
	})

	return branch
}
