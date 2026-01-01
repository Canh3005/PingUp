import devlogService from '../services/devlogService.js';

class DevlogController {
  // Create devlog
  async createDevlog(req, res) {
    try {
      const userId = req.user.profileId;
      const devlog = await devlogService.createDevlog(userId, req.body);
      res.status(201).json(devlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get devlog by ID
  async getDevlog(req, res) {
    try {
      const devlog = await devlogService.getDevlogById(req.params.id);
      res.json(devlog);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Get devlogs by project hub
  async getDevlogsByProjectHub(req, res) {
    try {
      const { projectHubId } = req.params;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        visibility: req.query.visibility,
      };

      const result = await devlogService.getDevlogsByProjectHub(projectHubId, options);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get recent devlogs
  async getRecentDevlogs(req, res) {
    try {
      const { projectHubId } = req.params;
      const limit = parseInt(req.query.limit) || 3;
      const devlogs = await devlogService.getRecentDevlogs(projectHubId, limit);
      res.json(devlogs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update devlog
  async updateDevlog(req, res) {
    try {
      const userId = req.user.profileId;
      const devlog = await devlogService.updateDevlog(req.params.id, userId, req.body);
      res.json(devlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete devlog
  async deleteDevlog(req, res) {
    try {
      const userId = req.user.profileId;
      const result = await devlogService.deleteDevlog(req.params.id, userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Add reaction
  async addReaction(req, res) {
    try {
      const userId = req.user.profileId;
      const { reactionType } = req.body;
      const devlog = await devlogService.addReaction(req.params.id, userId, reactionType);
      res.json(devlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Remove reaction
  async removeReaction(req, res) {
    try {
      const userId = req.user.profileId;
      const devlog = await devlogService.removeReaction(req.params.id, userId);
      res.json(devlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Toggle pin
  async togglePin(req, res) {
    try {
      const userId = req.user.profileId;
      const devlog = await devlogService.togglePin(req.params.id, userId);
      res.json(devlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get devlogs by date range
  async getDevlogsByDateRange(req, res) {
    try {
      const { projectHubId } = req.params;
      const { startDate, endDate } = req.query;
      const devlogs = await devlogService.getDevlogsByDateRange(
        projectHubId,
        startDate,
        endDate
      );
      res.json(devlogs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new DevlogController();
