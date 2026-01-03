import taskService from '../services/taskService.js';

class TaskController {
  // Create task
  async createTask(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      if (!userId) {
        return res.status(401).json({ message: 'User profile not found' });
      }
      const task = await taskService.createTask(userId, req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get task by ID
  async getTask(req, res) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Get tasks by project hub
  async getTasksByProjectHub(req, res) {
    try {
      const { projectHubId } = req.params;
      const filters = {
        column: req.query.column,
        priority: req.query.priority,
        assignee: req.query.assignee,
        labels: req.query.labels ? req.query.labels.split(',') : null,
        milestone: req.query.milestone,
      };

      const tasks = await taskService.getTasksByProjectHub(projectHubId, filters);
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get tasks by milestone
  async getTasksByMilestone(req, res) {
    try {
      const tasks = await taskService.getTasksByMilestone(req.params.milestoneId);
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update task
  async updateTask(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const task = await taskService.updateTask(req.params.id, userId, req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Move task
  async moveTask(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const { newColumn, newOrder } = req.body;
      const task = await taskService.moveTask(req.params.id, userId, newColumn, newOrder);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete task
  async deleteTask(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const result = await taskService.deleteTask(req.params.id, userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Assign user
  async assignUser(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const { assigneeId } = req.body;
      const task = await taskService.assignUser(req.params.id, userId, assigneeId);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Unassign user
  async unassignUser(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const { assigneeId } = req.body;
      const task = await taskService.unassignUser(req.params.id, userId, assigneeId);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Add attachment
  async addAttachment(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const task = await taskService.addAttachment(req.params.id, userId, req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Remove attachment
  async removeAttachment(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const { attachmentId } = req.params;
      const task = await taskService.removeAttachment(req.params.id, userId, attachmentId);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get task statistics
  async getTaskStatistics(req, res) {
    try {
      const { projectHubId } = req.params;
      const stats = await taskService.getTaskStatistics(projectHubId);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Add label to task
  async addLabel(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const { label } = req.body;
      const task = await taskService.addLabel(req.params.id, userId, label);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Remove label from task
  async removeLabel(req, res) {
    try {
      const userId = req.user.profile?._id || req.user.profileId;
      const { label } = req.body;
      const task = await taskService.removeLabel(req.params.id, userId, label);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get available labels
  async getAvailableLabels(req, res) {
    try {
      const labels = await taskService.getAvailableLabels();
      res.json(labels);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TaskController();
