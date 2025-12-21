import express from 'express';
import MessageController from '../controllers/messageController.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

// List messages in a conversation (authenticated)
router.get('/:conversationId/messages', auth, MessageController.list);

export default router;
