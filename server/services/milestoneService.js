import Milestone from '../models/Milestone.js';
import ProjectHub from '../models/ProjectHub.js';
import projectHubService from './projectHubService.js';

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

      await milestone.deleteOne();

      // Update project progress
      await projectHubService.updateProgress(projectHub._id);

      return { message: 'Milestone deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting milestone: ${error.message}`);
    }
  }
}

export default new MilestoneService();
