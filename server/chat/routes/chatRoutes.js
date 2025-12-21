import express from 'express';
import ChatController from '../controllers/chatController.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

// Update read state for a conversation (authenticated)
router.put('/conversations/:conversationId/read', auth, ChatController.updateRead);

export default router;
