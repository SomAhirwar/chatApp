const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: [true, 'A conversation must have an user'],
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

conversationSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'user',
      select: 'fullName email',
    },
    {
      path: 'host',
      select: 'fullName email',
    },
  ])
  next()
})

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation
