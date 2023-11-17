const authController = require('../controllers/authController')
const getErrorResponse = require('../utils/getErrorResponse')

module.exports = async (socket, next) => {
  try {
    const user = await authController.validateUserAuthorizationHeader(
      socket.handshake.headers.authorization,
    )
    socket.user = user
    next()
  } catch (err) {
    next(getErrorResponse(err))
  }
}
