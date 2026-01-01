import HubActivity from '../models/HubActivity.js';
import ProjectHub from '../models/ProjectHub.js';

class HubActivityService {
  // Log activity
  async logActivity(activityData) {
    try {
      const activity = new HubActivity(activityData);
      await activity.save();
      return activity;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw new Error(`Error logging activity: ${error.message}`);
    }
  }

  // Get recent activities for a project hub
  async getRecentActivities(projectHubId, limit = 20) {
    try {
      const activities = await HubActivity.find({ projectHubId })
        .populate('user', 'name avatarUrl')
        .sort({ createdAt: -1 })
        .limit(limit);

      return activities;
    } catch (error) {
      throw new Error(`Error fetching recent activities: ${error.message}`);
    }
  }

  // Get activities by type
  async getActivitiesByType(projectHubId, activityType, limit = 20) {
    try {
      const activities = await HubActivity.find({
        projectHubId,
        activityType,
      })
        .populate('user', 'name avatarUrl')
        .sort({ createdAt: -1 })
        .limit(limit);

      return activities;
    } catch (error) {
      throw new Error(`Error fetching activities by type: ${error.message}`);
    }
  }

  // Get activities by user
  async getUserActivities(projectHubId, userId, limit = 20) {
    try {
      const activities = await HubActivity.find({
        projectHubId,
        user: userId,
      })
        .populate('user', 'name avatarUrl')
        .sort({ createdAt: -1 })
        .limit(limit);

      return activities;
    } catch (error) {
      throw new Error(`Error fetching user activities: ${error.message}`);
    }
  }

  // Get activities with pagination
  async getActivitiesWithPagination(projectHubId, options = {}) {
    try {
      const { page = 1, limit = 20, activityType = null, userId = null } = options;
      const skip = (page - 1) * limit;

      const query = { projectHubId };

      if (activityType) {
        query.activityType = activityType;
      }

      if (userId) {
        query.user = userId;
      }

      const [activities, total] = await Promise.all([
        HubActivity.find(query)
          .populate('user', 'name avatarUrl')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        HubActivity.countDocuments(query),
      ]);

      return {
        activities,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error fetching activities: ${error.message}`);
    }
  }

  // Get activity statistics
  async getActivityStatistics(projectHubId, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const activities = await HubActivity.find({
        projectHubId,
        createdAt: { $gte: startDate },
      });

      const stats = {
        total: activities.length,
        byType: {
          task: activities.filter((a) => a.activityType === 'task').length,
          milestone: activities.filter((a) => a.activityType === 'milestone').length,
          devlog: activities.filter((a) => a.activityType === 'devlog').length,
          member: activities.filter((a) => a.activityType === 'member').length,
          file: activities.filter((a) => a.activityType === 'file').length,
          comment: activities.filter((a) => a.activityType === 'comment').length,
          other: activities.filter((a) => a.activityType === 'other').length,
        },
        byDay: {},
      };

      // Group by day
      activities.forEach((activity) => {
        const date = activity.createdAt.toISOString().split('T')[0];
        stats.byDay[date] = (stats.byDay[date] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw new Error(`Error getting activity statistics: ${error.message}`);
    }
  }

  // Delete old activities (cleanup)
  async deleteOldActivities(projectHubId, daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await HubActivity.deleteMany({
        projectHubId,
        createdAt: { $lt: cutoffDate },
      });

      return {
        message: `Deleted ${result.deletedCount} old activities`,
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      throw new Error(`Error deleting old activities: ${error.message}`);
    }
  }

  // Get timeline (activities grouped by date)
  async getTimeline(projectHubId, limit = 50) {
    try {
      const activities = await HubActivity.find({ projectHubId })
        .populate('user', 'name avatarUrl')
        .sort({ createdAt: -1 })
        .limit(limit);

      // Group by date
      const timeline = {};
      activities.forEach((activity) => {
        const date = activity.createdAt.toISOString().split('T')[0];
        if (!timeline[date]) {
          timeline[date] = [];
        }
        timeline[date].push(activity);
      });

      return timeline;
    } catch (error) {
      throw new Error(`Error fetching timeline: ${error.message}`);
    }
  }
}

export default new HubActivityService();
