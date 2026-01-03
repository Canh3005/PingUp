import Milestone from '../models/Milestone.js';
import ProjectHub from '../models/ProjectHub.js';
import Task from '../models/Task.js';
import projectHubService from './projectHubService.js';
import hubActivityService from './hubActivityService.js';
import ACTIVITY_TYPES from '../constants/activityTypes.js';

class MilestoneService {
  // Create new milestone
  async createMilestone(userId, milestoneData) {
    try {
      const { projectHubId } = milestoneData;
      // Verify project hub exists and user has access
      const projectHub = await ProjectHub.findById(projectHubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Check if user is owner or member
      const isOwner = projectHub.owner.toString() === userId;
      const isMember = projectHub.members.some(
        member => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to create milestone in this project hub');
      }

      const milestone = new Milestone(milestoneData);
      await milestone.save();

      // Add milestone to project hub
      projectHub.milestones.push(milestone._id);
      await projectHub.save();

      // Log activity
      await hubActivityService.logActivity({
        projectHubId: projectHubId,
        user: userId,
        action: 'created milestone',
        activityType: ACTIVITY_TYPES.MILESTONE_CREATED,
        targetId: milestone._id,
        targetName: milestone.title,
        details: `Created milestone: ${milestone.title}`,
      });

      // Update project progress
      await projectHubService.updateProgress(projectHubId);

      return milestone;
    } catch (error) {
      throw new Error(`Error creating milestone: ${error.message}`);
    }
  }

  // Get milestone by ID
  async getMilestoneById(milestoneId) {
    try {
      const milestone = await Milestone.findById(milestoneId)
        .populate('projectHubId', 'name owner');

      if (!milestone) {
        throw new Error('Milestone not found');
      }

      return milestone;
    } catch (error) {
      throw new Error(`Error fetching milestone: ${error.message}`);
    }
  }

  // Get milestones by project hub ID
  async getMilestonesByProject(projectHubId, status = null) {
    try {
      const query = { projectHubId };

      if (status) {
        query.status = status;
      }

      const milestones = await Milestone.find(query)
        .sort({ dueDate: 1, createdAt: -1 });

      return milestones;
    } catch (error) {
      throw new Error(`Error fetching milestones: ${error.message}`);
    }
  }

  // Update milestone
  async updateMilestone(milestoneId, userId, updateData) {
    try {
      const milestone = await Milestone.findById(milestoneId)
        .populate('projectHubId');

      if (!milestone) {
        throw new Error('Milestone not found');
      }

      const projectHub = milestone.projectHubId;

      // Check if user is owner or member
      const isOwner = projectHub.owner.toString() === userId;
      const isMember = projectHub.members.some(
        member => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to update this milestone');
      }

      Object.assign(milestone, updateData);
      await milestone.save();

      // Log activity
      await hubActivityService.logActivity({
        projectHubId: projectHub._id,
        user: userId,
        action: 'updated milestone',
        activityType: ACTIVITY_TYPES.MILESTONE_UPDATED,
        targetId: milestone._id,
        targetName: milestone.title,
        details: `Updated milestone: ${milestone.title}`,
      });

      // Update project progress if status changed
      if (updateData.status) {
        await projectHubService.updateProgress(projectHub._id);
      }

      return milestone;
    } catch (error) {
      throw new Error(`Error updating milestone: ${error.message}`);
    }
  }

  // Update milestone status
  async updateMilestoneStatus(milestoneId, userId, status) {
    try {
      const validStatuses = ['Not Started', 'In Progress', 'Completed'];
      
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }

      const milestone = await Milestone.findById(milestoneId)
        .populate('projectHubId');

      if (!milestone) {
        throw new Error('Milestone not found');
      }

      const projectHub = milestone.projectHubId;

      // Check if user is owner or member
      const isOwner = projectHub.owner.toString() === userId;
      const isMember = projectHub.members.some(
        member => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to update this milestone');
      }

      milestone.status = status;
      await milestone.save();

      // Log activity
      await hubActivityService.logActivity({
        projectHubId: projectHub._id,
        user: userId,
        action: 'changed milestone status',
        activityType: ACTIVITY_TYPES.MILESTONE_STATUS_CHANGED,
        targetId: milestone._id,
        targetName: milestone.title,
        details: `Changed milestone status to: ${status}`,
      });

      // Update project progress
      await projectHubService.updateProgress(projectHub._id);

      return milestone;
    } catch (error) {
      throw new Error(`Error updating milestone status: ${error.message}`);
    }
  }

  // Delete milestone
  async deleteMilestone(milestoneId, userId) {
    try {
      const milestone = await Milestone.findById(milestoneId)
        .populate('projectHubId');

      if (!milestone) {
        throw new Error('Milestone not found');
      }

      const projectHub = milestone.projectHubId;

      // Check if user is owner or member
      const isOwner = projectHub.owner.toString() === userId;
      const isMember = projectHub.members.some(
        member => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to delete this milestone');
      }

      // Remove milestone from project hub
      projectHub.milestones = projectHub.milestones.filter(
        m => m.toString() !== milestoneId
      );
      await projectHub.save();

      // Log activity
      await hubActivityService.logActivity({
        projectHubId: projectHub._id,
        user: userId,
        action: 'deleted milestone',
        activityType: ACTIVITY_TYPES.MILESTONE_DELETED,
        targetId: milestone._id,
        targetName: milestone.title,
        details: `Deleted milestone: ${milestone.title}`,
      });

      await milestone.deleteOne();

      // Update project progress
      await projectHubService.updateProgress(projectHub._id);

      return { message: 'Milestone deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting milestone: ${error.message}`);
    }
  }

  // Recalculate milestone progress based on tasks
  async recalculateMilestoneProgress(milestoneId) {
    try {
      const milestone = await Milestone.findById(milestoneId);

      if (!milestone) {
        throw new Error('Milestone not found');
      }

      // Get all tasks for this milestone
      const tasks = await Task.find({ milestone: milestoneId });

      if (tasks.length === 0) {
        milestone.progress = 0;
      } else {
        const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
        milestone.progress = Math.round((completedTasks / tasks.length) * 100);
      }

      await milestone.save();
      return milestone;
    } catch (error) {
      throw new Error(`Error recalculating milestone progress: ${error.message}`);
    }
  }
}

export default new MilestoneService();
