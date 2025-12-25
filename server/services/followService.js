import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import Project from '../models/Project.js';

class FollowService {
  // Follow a user
  async followUser(currentUserId, targetUserId) {
    try {
      // Check if target user exists
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      // Check if already following
      const currentUser = await User.findById(currentUserId);
      if (currentUser.following.includes(targetUserId)) {
        throw new Error('Already following this user');
      }

      // Add to following list of current user
      await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { following: targetUserId } },
        { new: true }
      );

      // Add to followers list of target user
      await User.findByIdAndUpdate(
        targetUserId,
        { $addToSet: { followers: currentUserId } },
        { new: true }
      );

      return {
        followersCount: targetUser.followers.length + 1,
        followingCount: currentUser.following.length + 1,
      };
    } catch (error) {
      throw error;
    }
  }

  // Unfollow a user
  async unfollowUser(currentUserId, targetUserId) {
    try {
      // Check if target user exists
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      // Remove from following list of current user
      await User.findByIdAndUpdate(
        currentUserId,
        { $pull: { following: targetUserId } },
        { new: true }
      );

      // Remove from followers list of target user
      await User.findByIdAndUpdate(
        targetUserId,
        { $pull: { followers: currentUserId } },
        { new: true }
      );

      return {
        followersCount: Math.max(0, targetUser.followers.length - 1),
        followingCount: Math.max(
          0,
          (await User.findById(currentUserId)).following.length
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // Get followers list with pagination
  async getFollowers(userId, page = 1, limit = 20) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const followerIds = user.followers.slice(
        (page - 1) * limit,
        page * limit
      );
      const followerUsers = await UserProfile.find(
        { userId: { $in: followerIds } },
        { userId: 1, avatarUrl: 1, jobTitle: 1, name: 1 } // chỉ lấy các field này
      );
      const total = user.followers.length;

      return {
        followers: followerUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get following list with pagination
  async getFollowing(userId, page = 1, limit = 20) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const followingIds = user.following.slice(
        (page - 1) * limit,
        page * limit
      );
      const followingUsers = await UserProfile.find(
        { userId: { $in: followingIds } },
        { userId: 1, avatarUrl: 1, jobTitle: 1, name: 1 } // chỉ lấy các field này
      );
      const total = user.following.length;

      return {
        following: followingUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Check if current user is following target user
  async checkFollowStatus(currentUserId, targetUserId) {
    try {
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) {
        throw new Error('User not found');
      }

      return currentUser.following.includes(targetUserId);
    } catch (error) {
      throw error;
    }
  }

  // Get follow counts (followers and following)
  async getFollowCounts(userId) {
    try {
      const user = await User.findById(userId).select('followers following');
      if (!user) {
        throw new Error('User not found');
      }

      return {
        followersCount: user.followers.length,
        followingCount: user.following.length,
      };
    } catch (error) {
      throw error;
    }
  }

  // Discover users with profiles and project data
  async discoverUsers(page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;

      // Get users with profiles
      const users = await User.find({})
        .select('userName email imageUrl')
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Get total count
      const total = await User.countDocuments({});

      // Populate each user with profile and project data
      const usersWithData = await Promise.all(
        users.map(async (user) => {
          // Get user profile
          const profile = await UserProfile.findOne({ userId: user._id })
            .select('name jobTitle location avatarUrl bio')
            .lean();

          // Get user's published projects count
          const projectCount = await Project.countDocuments({
            owner: user._id,
            status: 'published'
          });

          // Get 4 recent project cover images
          const recentProjects = await Project.find({
            owner: user._id,
            status: 'published'
          })
            .select('coverImage')
            .sort({ publishedAt: -1 })
            .limit(4)
            .lean();

          // Mock stats for now - can calculate real stats later
          const stats = {
            appreciations: Math.floor(Math.random() * 1000) + 'K',
            followers: Math.floor(Math.random() * 500) + 'K',
            projectViews: projectCount + ' Projects'
          };

          return {
            _id: user._id,
            userName: user.userName,
            profile: {
              name: profile?.name || user.userName,
              location: profile?.location || 'Unknown',
              avatarUrl: profile?.avatarUrl || user.imageUrl || null,
              jobTitle: profile?.jobTitle || 'Creator',
            },
            stats,
            tags: ['Freelance'], // Can be dynamic based on user data
            projects: recentProjects.map(p => p.coverImage).filter(Boolean)
          };
        })
      );

      return {
        users: usersWithData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new FollowService();
