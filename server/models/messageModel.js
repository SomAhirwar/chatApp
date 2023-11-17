const mongoose = require('mongoose')
const { MAX_MESSAGE_LENGTH } = require('../utils/constants')

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Message must have a text'],
    maxlength: [MAX_MESSAGE_LENGTH, `Message must be less then ${MAX_MESSAGE_LENGTH}`],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a sender'],
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: [true, 'Message must have a conversation'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

messageSchema.index({ conversation: 1, createdAt: 1 })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
