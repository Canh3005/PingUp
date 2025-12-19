import followService from '../services/followService.js';

class FollowController {
  // Follow a user
  async followUser(req, res) {
    try {
      const currentUserId = req.user.userId;
      const { userId: targetUserId } = req.params;

      if (currentUserId === targetUserId) {
        return res.status(400).json({ 
          success: false, 
          message: 'You cannot follow yourself' 
        });
      }

      const result = await followService.followUser(currentUserId, targetUserId);
      
      res.status(200).json({
        success: true,
        message: 'Followed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in followUser controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to follow user'
      });
    }
  }

  // Unfollow a user
  async unfollowUser(req, res) {
    try {
      const currentUserId = req.user.userId;
      const { userId: targetUserId } = req.params;

      if (currentUserId === targetUserId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid operation' 
        });
      }

      const result = await followService.unfollowUser(currentUserId, targetUserId);
      
      res.status(200).json({
        success: true,
        message: 'Unfollowed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in unfollowUser controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to unfollow user'
      });
    }
  }

  // Get followers list
  async getFollowers(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await followService.getFollowers(userId, parseInt(page), parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getFollowers controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get followers'
      });
    }
  }

  // Get following list
  async getFollowing(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await followService.getFollowing(userId, parseInt(page), parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getFollowing controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get following'
      });
    }
  }

  // Check follow status
  async checkFollowStatus(req, res) {
    try {
      const currentUserId = req.user.userId;
      const { userId: targetUserId } = req.params;

      const isFollowing = await followService.checkFollowStatus(currentUserId, targetUserId);
      
      res.status(200).json({
        success: true,
        data: { isFollowing }
      });
    } catch (error) {
      console.error('Error in checkFollowStatus controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to check follow status'
      });
    }
  }
}

export default new FollowController();
