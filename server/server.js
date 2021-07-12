const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { sequelize } = require('./src/models')
const userRoutes = require('./src/routes/user.js')
const branchRoutes = require('./src/routes/branch.js')
const clientsRoutes = require('./src/routes/clients.js')
const staffsRoutes = require('./src/routes/staffs.js')
const gpRoutes = require('./src/routes/gp.js')
require('dotenv').config()

app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({ credentials: true, origin: 'http://localhost:8081' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use('/api/v1/', userRoutes)
app.use('/api/v1/branch', branchRoutes)
app.use('/api/v1/clients', clientsRoutes)
app.use('/api/v1/staffs', staffsRoutes)
app.use('/api/v1/gp', gpRoutes)

app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))

const port = process.env.PORT || 4000

app.listen(port, async () => {
	try {
		console.log(`Running on http://localhost:${port}`)
		await sequelize.authenticate()
		console.log('Database connected!')
	} catch (error) {
		console.log('Database connection failed:', error)
	}
})
