import hubActivityService from '../services/hubActivityService.js';

class HubActivityController {
  // Get recent activities
  async getRecentActivities(req, res) {
    try {
      const { projectHubId } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      const activities = await hubActivityService.getRecentActivities(projectHubId, limit);
      res.json(activities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get activities by type
  async getActivitiesByType(req, res) {
    try {
      const { projectHubId, activityType } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      const activities = await hubActivityService.getActivitiesByType(
        projectHubId,
        activityType,
        limit
      );
      res.json(activities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get user activities
  async getUserActivities(req, res) {
    try {
      const { projectHubId, userId } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      const activities = await hubActivityService.getUserActivities(
        projectHubId,
        userId,
        limit
      );
      res.json(activities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get activities with pagination
  async getActivitiesWithPagination(req, res) {
    try {
      const { projectHubId } = req.params;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        activityType: req.query.activityType,
        userId: req.query.userId,
      };

      const result = await hubActivityService.getActivitiesWithPagination(
        projectHubId,
        options
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get activity statistics
  async getActivityStatistics(req, res) {
    try {
      const { projectHubId } = req.params;
      const days = parseInt(req.query.days) || 7;
      const stats = await hubActivityService.getActivityStatistics(projectHubId, days);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get timeline
  async getTimeline(req, res) {
    try {
      const { projectHubId } = req.params;
      const limit = parseInt(req.query.limit) || 50;
      const timeline = await hubActivityService.getTimeline(projectHubId, limit);
      res.json(timeline);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new HubActivityController();
