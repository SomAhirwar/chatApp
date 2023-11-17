const { createServer } = require('http')
const express = require('express')
const mongoose = require('mongoose')
const { NOT_FOUND_CODE, INTERNAL_SERVER_ERROR_CODE } = require('./utils/constants')
const AppError = require('./utils/appError')
const getErrorResponse = require('./utils/getErrorResponse')
const authRouter = require('./routers/authRouter')
const conversationRouter = require('./routers/conversationRouter')
const cors = require('cors')

const app = express()
app.use(express.json())

// setting CORS options
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
  },
}

// CORS pre-flight requests enabled for all routes
app.options('*', cors(corsOptions))

// CORS for all routes
app.use(cors(corsOptions))

// Routes
app.use('/auth', authRouter)
app.use('/conversation', conversationRouter)

// 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, NOT_FOUND_CODE))
})

// Global Error handler
app.use((err, req, res, next) => {
  err = getErrorResponse(err)
  res.status(err.isOperational ? err.statusCode : INTERNAL_SERVER_ERROR_CODE).json(err)
})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose
  .connect(DB, {})
  .then(() => {
    console.log('Database connection success')
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error)
  })

// STARTING SERVER

const server = createServer(app)
const PORT = process.env.PORT

server.listen(PORT * 1, () => {
  console.log(`App running on port ${PORT}`)
})

module.exports = server

const serverModule = module.exports
serverModule.app = app
