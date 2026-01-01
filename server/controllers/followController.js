import followService from '../services/followService.js';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import Project from '../models/Project.js';

class FollowController {
  // Follow a user
  async followUser(req, res) {
    try {
      const currentUserId = req.user._id;
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
      const currentUserId = req.user._id;
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

  // Discover users (for People grid)
  async discoverUsers(req, res) {
    try {
      const { page = 1, limit = 12 } = req.query;

      const result = await followService.discoverUsers(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error in discoverUsers controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to discover users'
      });
    }
  }

  // Check follow status
  async checkFollowStatus(req, res) {
    try {
      const currentUserId = req.user._id;
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

  // Search users
  async searchUsers(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length < 2) {
        return res.status(200).json({
          success: true,
          users: []
        });
      }

      // Use aggregation to get users with project count
      const users = await User.aggregate([
        // Match users by userName or email
        {
          $match: {
            $or: [
              { userName: { $regex: q, $options: 'i' } },
              { email: { $regex: q, $options: 'i' } }
            ]
          }
        },
        // Lookup published projects count
        {
          $lookup: {
            from: 'projects',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$owner', '$$userId'] },
                      { $eq: ['$status', 'published'] }
                    ]
                  }
                }
              },
              { $count: 'count' }
            ],
            as: 'projectStats'
          }
        },
        // Add projectCount field
        {
          $addFields: {
            projectCount: {
              $ifNull: [{ $arrayElemAt: ['$projectStats.count', 0] }, 0]
            }
          }
        },
        // Sort by project count descending (users with more projects first)
        { $sort: { projectCount: -1 } },
        // Limit results
        { $limit: 20 },
        // Project only needed fields
        {
          $project: {
            userName: 1,
            email: 1,
            imageUrl: 1,
            projectCount: 1
          }
        }
      ]);

      // Populate avatarUrl from UserProfile for each user
      const usersWithProfile = await Promise.all(
        users.map(async (user) => {
          const profile = await UserProfile.findOne({ userId: user._id })
            .select('avatarUrl')
            .lean();
          
          return {
            ...user,
            avatarUrl: profile?.avatarUrl || user.imageUrl || null
          };
        })
      );

      res.status(200).json({
        success: true,
        users: usersWithProfile
      });
    } catch (error) {
      console.error('Error in searchUsers controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search users'
      });
    }
  }
}

export default new FollowController();
