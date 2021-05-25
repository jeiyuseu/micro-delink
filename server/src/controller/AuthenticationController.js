const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Users } = require('../models')

module.exports = {
	refreshToken: async (req, res) => {
		const token = req.cookies['_token']

		if (typeof token === 'undefined') {
			return res.status(403).send({ error: 'Unauthorized!' })
		}

		const users = await Users.count()

		if (!users) {
			return res
				.status(500)
				.cookie('_token', '', { maxAge: 0 })
				.send({ success: false, msg: 'Something went wrong!' })
		}

		jwt.verify(token, process.env.JWT_KEY_REFRESH, (error, data) => {
			if (error) {
				return res.status(403).send({ error: 'Invalid token!' })
			}
			const payload = {}

			payload.uuid = data.uuid
			payload.name = data.name
			payload.email = data.email
			payload.username = data.username

			const signToken = jwt.sign(payload, process.env.JWT_KEY_ACCESS, {
				expiresIn: '10min',
			})
			return res.status(200).send({ success: true, user: payload, token: signToken })
		})
	},

	register: async (req, res) => {
		const { firstName, lastName, email, username, password } = req.body

		try {
			const hashPassword = await bcrypt.hash(password, 12)

			const response = await Users.create({
				firstName: firstName,
				lastName: lastName,
				email: email,
				username: username,
				password: hashPassword,
			})

			return res.status(201).send({ success: true, msg: 'User created!' })
		} catch (error) {
			return res.status(500).send(error)
		}
	},

	login: async (req, res) => {
		const { username, password } = req.body

		try {
			const response = await Users.findAll({ where: { username } })
			const user = response[0]

			if (!user) {
				return res.status(401).send({ error: 'Username is not exists!' })
			}

			const hashConfirm = await bcrypt.compare(password, user.password)

			if (!hashConfirm) {
				return res.status(401).send({ error: 'Password is incorrect!' })
			}

			const payload = {}

			payload.uuid = user.uuid
			payload.name = `${user.firstName} ${user.lastName}`
			payload.email = user.email
			payload.username = user.username

			const token = jwt.sign(payload, process.env.JWT_KEY_ACCESS, {
				expiresIn: '10min',
			})

			const refreshToken = jwt.sign(payload, process.env.JWT_KEY_REFRESH)
			return res
				.cookie('_token', refreshToken, {
					httpOnly: true,
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
				})
				.status(200)
				.send({ success: true, user: payload, token: token })
		} catch (error) {
			return res.status(500).send({ error: error.message })
		}
	},

	logout: async (req, res, next) => {
		return res
			.status(200)
			.cookie('_token', '', { maxAge: 0 })
			.send({ success: true, msg: 'User log out!' })
	},
}
