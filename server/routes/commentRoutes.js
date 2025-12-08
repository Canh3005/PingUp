import express from 'express';
import commentController from '../controllers/commentController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Add comment to project (authenticated)
router.post('/:projectId/comments', auth, commentController.addComment);

// Get comments for project (public)
router.get('/:projectId/comments', commentController.getComments);

// Delete comment (authenticated)
router.delete('/:commentId', auth, commentController.deleteComment);

// Toggle like on comment (authenticated)
router.post('/:commentId/like', auth, commentController.toggleCommentLike);

export default router;
