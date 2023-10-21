const ACCESS_SECRET = process.env.ACCESS_SECRET
const jwt = require('jsonwebtoken')

const sendResponse = (res, status, data, message, httpStatusCode = 200) => {
  res.status(httpStatusCode).json({
    status,
    data,
    message,
  })
}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, ACCESS_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification failed:', err)
        return sendResponse(res, 'error', null, 'Token not valid')
      }
      // console.log('Decoded user data from JWT:', user)
      req.user = user
      next()
    })
  } else {
    console.error('Authorization header missing')
    return sendResponse(res, 'error', null, 'Authorization header missing')
  }
}

module.exports = {
  sendResponse,
  authenticateJWT,
}
