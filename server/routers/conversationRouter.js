const authController = require('../controllers/authController')
const conversationController = require('../controllers/conversationController')
const express = require('express')

const router = express.Router()

router.route('/').get(authController.protect, conversationController.getAllUserConversation)
router
  .route('/:conversationId/messages')
  .get(authController.protect, conversationController.getConversationMessages)

module.exports = router
