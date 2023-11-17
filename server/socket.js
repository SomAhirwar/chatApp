const socketIO = require('socket.io')
const server = require('./server')
const authSocketMiddleware = require('./socketMiddlewares/authSocketMiddleware')
const {
  ROLE_HOST,
  HOST_ROOM,
  ROLE_USER,
  SUCCESS,
  BAD_REQUEST_CODE,
  FORBIDDEN_CODE,
} = require('./utils/constants')
const Conversation = require('./models/conversationModel')
const AppError = require('./utils/appError')
const Message = require('./models/messageModel')
const catchAsyncSocketEvent = require('./utils/catchAsyncSocketEvent')

const globalSocketUsers = {}

const io = new socketIO.Server(server, {
  cors: {
    origin: function (origin, callback) {
      callback(null, true)
    },
    allowedHeaders: ['authorization'],
    credentials: true,
  },
})

io.use(authSocketMiddleware)

io.on('connection', (socket) => {
  // Saving users socketId
  globalSocketUsers[socket.user._id.toString()] = socket.id
  if (socket.user.role === ROLE_HOST) socket.join(HOST_ROOM)

  socket.on(
    'newConversation',
    catchAsyncSocketEvent(async (_, callback) => {
      if (socket.user.role !== ROLE_USER)
        throw new AppError('Only user can start the conversation', BAD_REQUEST_CODE)

      const conversation = (await Conversation.create({ user: socket.user._id })).toObject()
      conversation.user = { fullName: socket.user.fullName, email: socket.user.email }
      callback({ status: SUCCESS, data: { conversation } })
      socket.to(HOST_ROOM).emit('conversationRequest', { conversation })
    }),
  )

  socket.on(
    'acceptConversation',
    catchAsyncSocketEvent(async ({ conversationId }, callback) => {
      // Only host can accept the conversation
      let conversation = await Conversation.findById(conversationId)
      if (socket.user.role === ROLE_USER)
        throw new AppError('You are not authorized to accept the conversation', FORBIDDEN_CODE)

      if (conversation.host)
        throw new AppError('Someone is already accepted the conversation', BAD_REQUEST_CODE)

      conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { host: socket.user._id },
        { new: true },
      )
      callback({ status: SUCCESS, data: { conversation } })
      socket.to(globalSocketUsers[conversation.user._id.toString()]).emit('conversationJoined', {
        conversation,
      })
      io.to(HOST_ROOM).emit('conversationAccepted', { conversationId })
    }),
  )

  socket.on(
    'sendMessage',
    catchAsyncSocketEvent(async ({ conversationId, text }, callback) => {
      const conversation = await Conversation.findById(conversationId)
      const userId = socket.user._id.toString()
      if (!conversation._id) throw new AppError('Invalid conversation', BAD_REQUEST_CODE)
      if (
        userId !== conversation.user._id.toString() &&
        userId !== conversation.host._id.toString()
      )
        throw new AppError('You are not authorized to message on the conversation')

      // create message and emit event of message
      const message = await Message.create({
        conversation: conversationId,
        text,
        sender: userId,
      })

      callback({ status: SUCCESS })

      io.to(globalSocketUsers[conversation.host._id.toString()])
        .to(globalSocketUsers[conversation.user._id.toString()])
        .emit('receivedMessage', message)
    }),
  )

  socket.on(
    'disconnect',
    catchAsyncSocketEvent(() => {
      delete globalSocketUsers[socket.user._id.toString()]
    }),
  )
})
module.exports = io

const ioModule = module.exports
ioModule.globalSocketUsers = globalSocketUsers
