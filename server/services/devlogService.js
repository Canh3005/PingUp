import Devlog from '../models/Devlog.js';
import ProjectHub from '../models/ProjectHub.js';
import HubActivity from '../models/HubActivity.js';
import Comment from '../models/Comment.js';

class DevlogService {
  // Create new devlog
  async createDevlog(userId, devlogData) {
    try {
      const devlog = new Devlog({
        ...devlogData,
        author: userId,
      });

      await devlog.save();
      
      // Populate author before returning
      await devlog.populate('author', 'name avatarUrl jobTitle');

      // Log activity
      await this.logDevlogActivity(
        devlogData.projectHub,
        userId,
        'created devlog',
        devlog._id,
        devlog.title
      );

      return devlog;
    } catch (error) {
      throw new Error(`Error creating devlog: ${error.message}`);
    }
  }

  // Get devlog by ID
  async getDevlogById(devlogId) {
    try {
      const devlog = await Devlog.findById(devlogId)
        .populate('author', 'name avatarUrl jobTitle')
        .populate('reactedUsers.user', 'name avatarUrl');

      if (!devlog) {
        throw new Error('Devlog not found');
      }

      return devlog;
    } catch (error) {
      throw new Error(`Error fetching devlog: ${error.message}`);
    }
  }

  // Get devlogs by project hub
  async getDevlogsByProjectHub(projectHubId, options = {}) {
    try {
      const { page = 1, limit = 10, visibility = null } = options;
      const skip = (page - 1) * limit;

      const query = { projectHub: projectHubId };

      if (visibility) {
        query.visibility = visibility;
      }

      const [devlogs, total] = await Promise.all([
        Devlog.find(query)
          .populate('author', 'name avatarUrl jobTitle')
          .sort({ isPinned: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Devlog.countDocuments(query),
      ]);

      return {
        devlogs,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error fetching devlogs: ${error.message}`);
    }
  }

  // Get recent devlogs (for overview)
  async getRecentDevlogs(projectHubId, limit = 3) {
    try {
      const devlogs = await Devlog.find({ projectHub: projectHubId })
        .populate('author', 'name avatarUrl jobTitle')
        .sort({ createdAt: -1 })
        .limit(limit);

      return devlogs;
    } catch (error) {
      throw new Error(`Error fetching recent devlogs: ${error.message}`);
    }
  }

  // Update devlog
  async updateDevlog(devlogId, userId, updateData) {
    try {
      const devlog = await Devlog.findById(devlogId);

      if (!devlog) {
        throw new Error('Devlog not found');
      }

      // Check if user is author or project owner
      if (devlog.author.toString() !== userId) {
        await this.checkProjectPermission(devlog.projectHub, userId);
      }

      Object.assign(devlog, updateData);
      await devlog.save();

      // Log activity
      await this.logDevlogActivity(
        devlog.projectHub,
        userId,
        'updated devlog',
        devlog._id,
        devlog.title
      );

      return devlog;
    } catch (error) {
      throw new Error(`Error updating devlog: ${error.message}`);
    }
  }

  // Delete devlog
  async deleteDevlog(devlogId, userId) {
    try {
      const devlog = await Devlog.findById(devlogId);

      if (!devlog) {
        throw new Error('Devlog not found');
      }

      // Check if user is author or project owner
      if (devlog.author.toString() !== userId) {
        await this.checkProjectPermission(devlog.projectHub, userId);
      }

      const projectHubId = devlog.projectHub;
      const devlogTitle = devlog.title;

      await devlog.deleteOne();

      // Log activity
      await this.logDevlogActivity(
        projectHubId,
        userId,
        'deleted devlog',
        null,
        devlogTitle
      );

      return { message: 'Devlog deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting devlog: ${error.message}`);
    }
  }

  // Add reaction to devlog
  async addReaction(devlogId, userId, reactionType) {
    try {
      const devlog = await Devlog.findById(devlogId);

      if (!devlog) {
        throw new Error('Devlog not found');
      }

      // Check if user already reacted with this type
      const existingReaction = devlog.reactedUsers.find(
        (r) => r.user.toString() === userId && r.reactionType === reactionType
      );

      if (existingReaction) {
        throw new Error('You already reacted with this type');
      }

      // Remove any previous reaction from this user
      devlog.reactedUsers = devlog.reactedUsers.filter(
        (r) => r.user.toString() !== userId
      );

      // Add new reaction
      devlog.reactedUsers.push({
        user: userId,
        reactionType,
      });

      // Update reaction count
      devlog.reactions[reactionType] = (devlog.reactions[reactionType] || 0) + 1;

      await devlog.save();

      return devlog;
    } catch (error) {
      throw new Error(`Error adding reaction: ${error.message}`);
    }
  }

  // Remove reaction from devlog
  async removeReaction(devlogId, userId) {
    try {
      const devlog = await Devlog.findById(devlogId);

      if (!devlog) {
        throw new Error('Devlog not found');
      }

      // Find user's reaction
      const userReaction = devlog.reactedUsers.find(
        (r) => r.user.toString() === userId
      );

      if (!userReaction) {
        throw new Error('No reaction found');
      }

      // Decrease reaction count
      const reactionType = userReaction.reactionType;
      if (devlog.reactions[reactionType] > 0) {
        devlog.reactions[reactionType]--;
      }

      // Remove user's reaction
      devlog.reactedUsers = devlog.reactedUsers.filter(
        (r) => r.user.toString() !== userId
      );

      await devlog.save();

      return devlog;
    } catch (error) {
      throw new Error(`Error removing reaction: ${error.message}`);
    }
  }

  // Toggle pin status
  async togglePin(devlogId, userId) {
    try {
      const devlog = await Devlog.findById(devlogId);

      if (!devlog) {
        throw new Error('Devlog not found');
      }

      // Only project owner can pin/unpin
      await this.checkProjectPermission(devlog.projectHub, userId, true);

      devlog.isPinned = !devlog.isPinned;
      await devlog.save();

      return devlog;
    } catch (error) {
      throw new Error(`Error toggling pin: ${error.message}`);
    }
  }

  // Get devlogs by date range
  async getDevlogsByDateRange(projectHubId, startDate, endDate) {
    try {
      const devlogs = await Devlog.find({
        projectHub: projectHubId,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
        .populate('author', 'name avatarUrl jobTitle')
        .sort({ createdAt: -1 });

      return devlogs;
    } catch (error) {
      throw new Error(`Error fetching devlogs by date range: ${error.message}`);
    }
  }

  // Check if user has permission
  async checkProjectPermission(projectHubId, userId, ownerOnly = false) {
    const projectHub = await ProjectHub.findById(projectHubId);

    if (!projectHub) {
      throw new Error('Project hub not found');
    }

    const isOwner = projectHub.owner.toString() === userId;

    if (ownerOnly && !isOwner) {
      throw new Error('Only project owner can perform this action');
    }

    if (!ownerOnly) {
      const isMember = projectHub.members.some(
        (member) => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to perform this action');
      }
    }

    return true;
  }

  // Log devlog activity
  async logDevlogActivity(projectHubId, userId, action, targetId, targetName, metadata = null) {
    try {
      const activity = new HubActivity({
        projectHubId,
        user: userId,
        action,
        activityType: 'devlog',
        targetId,
        targetName,
        metadata,
      });

      await activity.save();
    } catch (error) {
      console.error('Error logging devlog activity:', error);
    }
  }
}

export default new DevlogService();
