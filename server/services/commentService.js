import Comment from '../models/Comment.js';
import UserProfile from '../models/UserProfile.js';
import Project from '../models/Project.js';

class CommentService {
  // Add comment to project
  async addComment(projectId, userId, content) {
    try {
      if (!content || !content.trim()) {
        throw new Error('Comment content is required');
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const comment = new Comment({
        project: projectId,
        author: userId,
        content: content.trim(),
      });

      await comment.save();

      // Populate author info
      await comment.populate('author', 'userName imageUrl');
      
      // Populate author's profile
      const authorProfile = await UserProfile.findOne({ userId: comment.author._id })
        .select('name jobTitle avatarUrl');
      
      const commentObj = comment.toObject();
      if (authorProfile) {
        commentObj.author.profile = authorProfile;
      }

      return commentObj;
    } catch (error) {
      throw new Error(`Error adding comment: ${error.message}`);
    }
  }

  // Get comments for project
  async getComments(projectId) {
    try {
      const comments = await Comment.find({ project: projectId, parentComment: null })
        .sort({ createdAt: -1 })
        .populate('author', 'userName imageUrl')
        .populate('likes', 'userName imageUrl');

      // Populate author profiles
      const commentsWithProfiles = await Promise.all(
        comments.map(async (comment) => {
          const commentObj = comment.toObject();
          const authorProfile = await UserProfile.findOne({ userId: comment.author._id })
            .select('name jobTitle avatarUrl');
          
          if (authorProfile) {
            commentObj.author.profile = authorProfile;
          }
          
          return commentObj;
        })
      );

      return commentsWithProfiles;
    } catch (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }
  }

  // Delete comment
  async deleteComment(commentId, userId) {
    try {
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.author.toString() !== userId) {
        throw new Error('Not authorized to delete this comment');
      }

      await Comment.findByIdAndDelete(commentId);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`);
    }
  }

  // Toggle like on comment
  async toggleCommentLike(commentId, userId) {
    try {
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        throw new Error('Comment not found');
      }

      const likeIndex = comment.likes.indexOf(userId);
      
      if (likeIndex > -1) {
        comment.likes.splice(likeIndex, 1);
      } else {
        comment.likes.push(userId);
      }

      await comment.save();
      return {
        isLiked: likeIndex === -1,
        likesCount: comment.likes.length,
      };
    } catch (error) {
      throw new Error(`Error toggling comment like: ${error.message}`);
    }
  }
}

export default new CommentService();
