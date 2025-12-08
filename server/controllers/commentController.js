import commentService from '../services/commentService.js';

class CommentController {
  // Add comment to project
  async addComment(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;
      const { content } = req.body;
      console.log('Adding comment to projectId:', projectId, 'by userId:', userId, 'with content:', content);

      const comment = await commentService.addComment(projectId, userId, content);

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get comments for project
  async getComments(req, res) {
    try {
      const { projectId } = req.params;

      const comments = await commentService.getComments(projectId);

      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete comment
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;

      await commentService.deleteComment(commentId, userId);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Toggle like on comment
  async toggleCommentLike(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;

      const result = await commentService.toggleCommentLike(commentId, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CommentController();
