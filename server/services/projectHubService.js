import ProjectHub from '../models/ProjectHub.js';
import Milestone from '../models/Milestone.js';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';

class ProjectHubService {
  // Create new project hub
  async createProjectHub(userId, hubData) {
    try {
      const projectHub = new ProjectHub({
        ...hubData,
        owner: userId,
      });

      await projectHub.save();
      return projectHub;
    } catch (error) {
      throw new Error(`Error creating project hub: ${error.message}`);
    }
  }

  // Get project hub by ID
  async getProjectHubById(hubId) {
    try {
      const projectHub = await ProjectHub.findById(hubId)
        .populate('owner', 'userName email imageUrl')
        .populate('members.user', 'name jobTitle avatarUrl')
        .populate('milestones')
        .populate('showcaseProjectId', 'title coverImage');

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      return projectHub;
    } catch (error) {
      throw new Error(`Error fetching project hub: ${error.message}`);
    }
  }

  // Get user's project hubs
  async getUserProjectHubs(userId) {
    try {
      const projectHubs = await ProjectHub.find({
        $or: [
          { owner: userId },
          { 'members.user': userId }
        ]
      })
        .populate('owner', 'userName email imageUrl')
        .populate('members.user', 'name jobTitle avatarUrl')
        .populate('milestones')
        .sort({ updatedAt: -1 });

      return projectHubs;
    } catch (error) {
      throw new Error(`Error fetching user's project hubs: ${error.message}`);
    }
  }

  // Get all project hubs with pagination and filters
  async getAllProjectHubs(page = 1, limit = 10, tags = null) {
    try {
      const query = {};
      
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : tags.split(',');
        query.tags = { $in: tagArray };
      }

      const skip = (page - 1) * limit;

      const [projectHubs, total] = await Promise.all([
        ProjectHub.find(query)
          .populate('owner', 'userName email imageUrl')
          .populate('members.user', 'name jobTitle avatarUrl')
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit),
        ProjectHub.countDocuments(query),
      ]);

      return {
        projectHubs,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error fetching project hubs: ${error.message}`);
    }
  }

  // Update project hub
  async updateProjectHub(hubId, userId, updateData) {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Check if user is owner or member
      const isOwner = projectHub.owner.toString() === userId;
      const isMember = projectHub.members.some(
        member => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to update this project hub');
      }

      Object.assign(projectHub, updateData);
      await projectHub.save();

      return projectHub;
    } catch (error) {
      throw new Error(`Error updating project hub: ${error.message}`);
    }
  }

  // Delete project hub
  async deleteProjectHub(hubId, userId) {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Only owner can delete
      if (projectHub.owner.toString() !== userId) {
        throw new Error('Not authorized to delete this project hub');
      }

      // Delete all associated milestones
      await Milestone.deleteMany({ project: hubId });

      await projectHub.deleteOne();
      return { message: 'Project hub deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting project hub: ${error.message}`);
    }
  }

  // Add member to project hub
  async addMember(hubId, userId, memberId, role = 'Member') {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Only owner can add members
      if (projectHub.owner.toString() !== userId) {
        throw new Error('Not authorized to add members');
      }

      // Check if member already exists
      const memberExists = projectHub.members.some(
        member => member.user.toString() === memberId
      );

      if (memberExists) {
        throw new Error('Member already exists in this project hub');
      }

      // Verify member exists
      const userProfile = await UserProfile.findOne({ userId: memberId });
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      projectHub.members.push({
        user: userProfile._id,
        role,
      });

      await projectHub.save();
      await projectHub.populate('members.user', 'name jobTitle avatarUrl');

      return projectHub;
    } catch (error) {
      throw new Error(`Error adding member: ${error.message}`);
    }
  }

  // Remove member from project hub
  async removeMember(hubId, userId, memberIdToRemove) {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Only owner can remove members
      if (projectHub.owner.toString() !== userId) {
        throw new Error('Not authorized to remove members');
      }

      // Find and remove member
      const memberIndex = projectHub.members.findIndex(
        member => member.user.toString() === memberIdToRemove
      );

      if (memberIndex === -1) {
        throw new Error('Member not found in this project hub');
      }

      projectHub.members.splice(memberIndex, 1);
      await projectHub.save();

      return projectHub;
    } catch (error) {
      throw new Error(`Error removing member: ${error.message}`);
    }
  }

  // Update member role
  async updateMemberRole(hubId, userId, memberIdToUpdate, newRole) {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Only owner can update member roles
      if (projectHub.owner.toString() !== userId) {
        throw new Error('Not authorized to update member roles');
      }

      // Find and update member role
      const member = projectHub.members.find(
        member => member.user.toString() === memberIdToUpdate
      );

      if (!member) {
        throw new Error('Member not found in this project hub');
      }

      member.role = newRole;
      await projectHub.save();
      await projectHub.populate('members.user', 'name jobTitle avatarUrl');

      return projectHub;
    } catch (error) {
      throw new Error(`Error updating member role: ${error.message}`);
    }
  }

  // Link showcase project
  async linkShowcaseProject(hubId, userId, showcaseProjectId) {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Check if user is owner or member
      const isOwner = projectHub.owner.toString() === userId;
      const isMember = projectHub.members.some(
        member => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to link showcase project');
      }

      projectHub.showcaseProjectId = showcaseProjectId;
      await projectHub.save();

      return projectHub;
    } catch (error) {
      throw new Error(`Error linking showcase project: ${error.message}`);
    }
  }

  // Update integrations
  async updateIntegrations(hubId, userId, integrations) {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Check if user is owner or member
      const isOwner = projectHub.owner.toString() === userId;
      const isMember = projectHub.members.some(
        member => member.user.toString() === userId
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to update integrations');
      }

      projectHub.integrations = {
        ...projectHub.integrations,
        ...integrations,
      };

      await projectHub.save();

      return projectHub;
    } catch (error) {
      throw new Error(`Error updating integrations: ${error.message}`);
    }
  }

  // Calculate and update project progress
  async updateProgress(hubId) {
    try {
      const projectHub = await ProjectHub.findById(hubId);

      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      const milestones = await Milestone.find({ project: hubId });
      
      const totalMilestones = milestones.length;
      const completedMilestones = milestones.filter(
        m => m.status === 'Completed'
      ).length;

      projectHub.totalTasks = totalMilestones;
      projectHub.completedTasks = completedMilestones;
      projectHub.progress = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

      await projectHub.save();

      return projectHub;
    } catch (error) {
      throw new Error(`Error updating progress: ${error.message}`);
    }
  }
}

export default new ProjectHubService();
