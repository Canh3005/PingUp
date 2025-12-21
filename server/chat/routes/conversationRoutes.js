import express from 'express';
import ConversationController from '../controllers/conversationController.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

// Add conversation (authenticated)
router.post('/', auth, ConversationController.createConversation);

// Get inbox conversations (authenticated)
router.get('/', auth, ConversationController.listInbox);

export default router;
