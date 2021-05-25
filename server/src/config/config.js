require('dotenv').config()

module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    database: 'micro-delink',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}
