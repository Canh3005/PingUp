import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

class FollowService {
  // Follow a user
  async followUser(currentUserId, targetUserId) {
    try {
      // Check if target user exists
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        throw new Error("User not found");
      }

      // Check if already following
      const currentUser = await User.findById(currentUserId);
      if (currentUser.following.includes(targetUserId)) {
        throw new Error("Already following this user");
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
        throw new Error("User not found");
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
        throw new Error("User not found");
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
        throw new Error("User not found");
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
        throw new Error("User not found");
      }

      return currentUser.following.includes(targetUserId);
    } catch (error) {
      throw error;
    }
  }

  // Get follow counts (followers and following)
  async getFollowCounts(userId) {
    try {
      const user = await User.findById(userId).select("followers following");
      if (!user) {
        throw new Error("User not found");
      }

      return {
        followersCount: user.followers.length,
        followingCount: user.following.length,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new FollowService();
