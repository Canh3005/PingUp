import Task from '../models/Task.js';
import Milestone from '../models/Milestone.js';
import HubActivity from '../models/HubActivity.js';
import ProjectHub from '../models/ProjectHub.js';

class TaskService {
  // Create new task
  async createTask(userId, taskData) {
    try {
      const task = new Task({
        ...taskData,
        createdBy: userId,
      });

      await task.save();

      // Update milestone task count
      if (taskData.mileStoneId) {
        await this.updateMilestoneProgress(taskData.mileStoneId);
      }

      // Log activity
      await this.logTaskActivity(
        taskData.projectHubId,
        userId,
        'created task',
        task._id,
        task.title
      );

      return task;
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  // Get task by ID
  async getTaskById(taskId) {
    try {
      const task = await Task.findById(taskId)
        .populate('assignees', 'name avatarUrl jobTitle')
        .populate('createdBy', 'name avatarUrl')
        .populate('mileStoneId', 'title')
        .populate('attachments.uploadedBy', 'name avatarUrl');

      if (!task) {
        throw new Error('Task not found');
      }

      return task;
    } catch (error) {
      throw new Error(`Error fetching task: ${error.message}`);
    }
  }

  // Get tasks by project hub
  async getTasksByProjectHub(projectHubId, filters = {}) {
    try {
      const query = { projectHubId };

      // Apply filters
      if (filters.column) {
        query.column = filters.column;
      }
      if (filters.priority) {
        query.priority = filters.priority;
      }
      if (filters.assignee) {
        query.assignees = filters.assignee;
      }
      if (filters.labels && filters.labels.length > 0) {
        query.labels = { $in: filters.labels };
      }
      if (filters.milestone) {
        query.mileStoneId = filters.milestone;
      }

      const tasks = await Task.find(query)
        .populate('assignees', 'name avatarUrl jobTitle')
        .populate('createdBy', 'name avatarUrl')
        .populate('mileStoneId', 'title')
        .sort({ column: 1, order: 1 });

      return tasks;
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  }

  // Get tasks by milestone
  async getTasksByMilestone(milestoneId) {
    try {
      const tasks = await Task.find({ mileStoneId: milestoneId })
        .populate('assignees', 'name avatarUrl jobTitle')
        .populate('createdBy', 'name avatarUrl')
        .sort({ column: 1, order: 1 });

      return tasks;
    } catch (error) {
      throw new Error(`Error fetching milestone tasks: ${error.message}`);
    }
  }

  // Update task
  async updateTask(taskId, userId, updateData) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      // Check authorization
      await this.checkTaskPermission(task.projectHubId, userId);

      const oldColumn = task.column;
      const oldStatus = task.status;

      Object.assign(task, updateData);
      await task.save();

      // Update milestone progress if status or column changed
      if (oldColumn !== task.column || oldStatus !== task.status) {
        await this.updateMilestoneProgress(task.mileStoneId);
      }

      // Log activity
      if (oldColumn !== task.column) {
        await this.logTaskActivity(
          task.projectHubId,
          userId,
          'moved task to',
          task._id,
          task.title,
          { from: oldColumn, to: task.column }
        );
      } else {
        await this.logTaskActivity(
          task.projectHubId,
          userId,
          'updated task',
          task._id,
          task.title
        );
      }

      return task;
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
  }

  // Move task to different column
  async moveTask(taskId, userId, newColumn, newOrder) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      await this.checkTaskPermission(task.projectHubId, userId);

      const oldColumn = task.column;
      task.column = newColumn;
      task.order = newOrder;

      // Auto-update status based on column
      if (newColumn === 'done') {
        task.status = 'Completed';
      } else if (newColumn === 'doing' || newColumn === 'review') {
        task.status = 'In Progress';
      } else {
        task.status = 'Not Started';
      }

      await task.save();

      // Update milestone progress
      await this.updateMilestoneProgress(task.mileStoneId);

      // Log activity
      await this.logTaskActivity(
        task.projectHubId,
        userId,
        'moved task to',
        task._id,
        task.title,
        { from: oldColumn, to: newColumn }
      );

      return task;
    } catch (error) {
      throw new Error(`Error moving task: ${error.message}`);
    }
  }

  // Delete task
  async deleteTask(taskId, userId) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      await this.checkTaskPermission(task.projectHubId, userId);

      const milestoneId = task.mileStoneId;
      const projectHubId = task.projectHubId;
      const taskTitle = task.title;

      await task.deleteOne();

      // Update milestone progress
      await this.updateMilestoneProgress(milestoneId);

      // Log activity
      await this.logTaskActivity(
        projectHubId,
        userId,
        'deleted task',
        null,
        taskTitle
      );

      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }

  // Assign user to task
  async assignUser(taskId, userId, assigneeId) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      await this.checkTaskPermission(task.projectHubId, userId);

      if (!task.assignees.includes(assigneeId)) {
        task.assignees.push(assigneeId);
        await task.save();

        await this.logTaskActivity(
          task.projectHubId,
          userId,
          'assigned user to task',
          task._id,
          task.title
        );
      }

      return task;
    } catch (error) {
      throw new Error(`Error assigning user: ${error.message}`);
    }
  }

  // Unassign user from task
  async unassignUser(taskId, userId, assigneeId) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      await this.checkTaskPermission(task.projectHubId, userId);

      task.assignees = task.assignees.filter(
        (id) => id.toString() !== assigneeId.toString()
      );
      await task.save();

      await this.logTaskActivity(
        task.projectHubId,
        userId,
        'unassigned user from task',
        task._id,
        task.title
      );

      return task;
    } catch (error) {
      throw new Error(`Error unassigning user: ${error.message}`);
    }
  }

  // Add attachment to task
  async addAttachment(taskId, userId, attachmentData) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      await this.checkTaskPermission(task.projectHubId, userId);

      task.attachments.push({
        ...attachmentData,
        uploadedBy: userId,
      });
      await task.save();

      await this.logTaskActivity(
        task.projectHubId,
        userId,
        'uploaded file',
        task._id,
        attachmentData.name
      );

      return task;
    } catch (error) {
      throw new Error(`Error adding attachment: ${error.message}`);
    }
  }

  // Remove attachment from task
  async removeAttachment(taskId, userId, attachmentId) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      await this.checkTaskPermission(task.projectHubId, userId);

      task.attachments = task.attachments.filter(
        (att) => att._id.toString() !== attachmentId.toString()
      );
      await task.save();

      return task;
    } catch (error) {
      throw new Error(`Error removing attachment: ${error.message}`);
    }
  }

  // Update milestone progress based on tasks
  async updateMilestoneProgress(milestoneId) {
    try {
      const tasks = await Task.find({ mileStoneId: milestoneId });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      await Milestone.findByIdAndUpdate(milestoneId, {
        totalTasks,
        completedTasks,
        progress,
        status:
          progress === 100
            ? 'Completed'
            : progress > 0
            ? 'In Progress'
            : 'Not Started',
      });
    } catch (error) {
      console.error('Error updating milestone progress:', error);
    }
  }

  // Check if user has permission to modify task
  async checkTaskPermission(projectHubId, userId) {
    const projectHub = await ProjectHub.findById(projectHubId);

    if (!projectHub) {
      throw new Error('Project hub not found');
    }

    const isOwner = projectHub.owner.toString() === userId;
    const isMember = projectHub.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isOwner && !isMember) {
      throw new Error('Not authorized to modify this task');
    }

    return true;
  }

  // Log task activity
  async logTaskActivity(projectHubId, userId, action, targetId, targetName, metadata = null) {
    try {
      const activity = new HubActivity({
        projectHubId,
        user: userId,
        action,
        activityType: 'task',
        targetId,
        targetName,
        metadata,
      });

      await activity.save();
    } catch (error) {
      console.error('Error logging task activity:', error);
    }
  }

  // Get task statistics
  async getTaskStatistics(projectHubId) {
    try {
      const tasks = await Task.find({ projectHubId });

      const stats = {
        total: tasks.length,
        byColumn: {
          backlog: tasks.filter((t) => t.column === 'backlog').length,
          todo: tasks.filter((t) => t.column === 'todo').length,
          doing: tasks.filter((t) => t.column === 'doing').length,
          review: tasks.filter((t) => t.column === 'review').length,
          done: tasks.filter((t) => t.column === 'done').length,
        },
        byPriority: {
          high: tasks.filter((t) => t.priority === 'high').length,
          medium: tasks.filter((t) => t.priority === 'medium').length,
          low: tasks.filter((t) => t.priority === 'low').length,
        },
        byStatus: {
          'Not Started': tasks.filter((t) => t.status === 'Not Started').length,
          'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
          Completed: tasks.filter((t) => t.status === 'Completed').length,
        },
      };

      return stats;
    } catch (error) {
      throw new Error(`Error getting task statistics: ${error.message}`);
    }
  }
}

export default new TaskService();
