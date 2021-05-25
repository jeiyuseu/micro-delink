const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const header = req.headers.authorization

  if (typeof header === 'undefined') {
    return res.status(403).send({ error: 'User not authorized' })
  }
  const [, token] = header.split(' ')

  try {
    jwt.verify(token, process.env.JWT_KEY_ACCESS)
    next()
  } catch (error) {
    return res.status(401).send({ error: error.message })
  }
}
