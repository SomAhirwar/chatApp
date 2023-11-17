const mongoose = require('mongoose')
const Conversation = require('../models/conversationModel')
const { OK_CODE, SUCCESS } = require('../utils/constants')
const Message = require('../models/messageModel')
const catchAsync = require('../utils/catchAsync')

exports.getAllUserConversation = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query
  const skip = (page - 1) * limit
  const conversations = await Conversation.find({
    $or: [{ user: req.user._id }, { host: req.user._id }],
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)

  res.status(OK_CODE).json({
    status: SUCCESS,
    data: conversations,
  })
})

exports.getConversationMessages = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 50 } = req.query
  const skip = (page - 1) * limit
  const { conversationId } = req.params
  const messages = await Message.find({
    conversation: new mongoose.Types.ObjectId(conversationId),
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)

  res.status(OK_CODE).json({
    status: SUCCESS,
    data: messages,
  })
})
