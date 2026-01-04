import Recruitment from '../models/Recruitment.js';
import Application from '../models/Application.js';
import ProjectHub from '../models/ProjectHub.js';
import HubActivity from '../models/HubActivity.js';
import { ACTIVITY_TYPES } from '../constants/activityTypes.js';

class RecruitmentService {
  // Create new recruitment role
  async createRecruitment(userId, recruitmentData) {
    try {
      // Verify project hub exists and user has permission
      const projectHub = await ProjectHub.findById(recruitmentData.projectHub);
      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      // Check if user is owner or admin
      console.log('Project Hub:', projectHub.owner, userId);
      const isOwner = projectHub.owner.toString() === userId.toString();
      const isMember = projectHub.members.some(
        (member) => member.user.toString() === userId.toString()
      );
      console.log('isOwner:', isOwner, 'isMember:', isMember);

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to create recruitment in this project hub');
      }

      const recruitment = new Recruitment({
        ...recruitmentData,
        postedBy: userId,
      });

      await recruitment.save();

      // Log activity
      await HubActivity.create({
        projectHubId: recruitmentData.projectHub,
        user: userId,
        action: 'posted recruitment role',
        activityType: ACTIVITY_TYPES.RECRUITMENT_CREATED,
        targetId: recruitment._id,
        targetName: recruitment.title,
        details: `Posted role: ${recruitment.title}`,
      });

      return recruitment;
    } catch (error) {
      throw new Error(`Error creating recruitment: ${error.message}`);
    }
  }

  // Get recruitment by ID
  async getRecruitmentById(recruitmentId) {
    try {
      const recruitment = await Recruitment.findById(recruitmentId)
        .populate('postedBy', 'name avatarUrl jobTitle')
        .populate('filledBy', 'name avatarUrl');

      if (!recruitment) {
        throw new Error('Recruitment not found');
      }

      // Get application count
      const applicantCount = await Application.countDocuments({
        recruitment: recruitmentId,
      });

      return {
        ...recruitment.toObject(),
        applicantCount,
      };
    } catch (error) {
      throw new Error(`Error fetching recruitment: ${error.message}`);
    }
  }

  // Get recruitments by project hub
  async getRecruitmentsByProjectHub(projectHubId, filters = {}) {
    try {
      const { status } = filters;
      const query = { projectHub: projectHubId };

      if (status && status !== 'all') {
        query.status = status;
      }

      const recruitments = await Recruitment.find(query)
        .populate('postedBy', 'name avatarUrl jobTitle')
        .populate('filledBy', 'name avatarUrl')
        .sort({ createdAt: -1 });

      // Get application counts for each recruitment
      const recruitmentsWithCounts = await Promise.all(
        recruitments.map(async (recruitment) => {
          const applicantCount = await Application.countDocuments({
            recruitment: recruitment._id,
          });
          return {
            ...recruitment.toObject(),
            applicantCount,
          };
        })
      );

      return recruitmentsWithCounts;
    } catch (error) {
      throw new Error(`Error fetching recruitments: ${error.message}`);
    }
  }

  // Update recruitment
  async updateRecruitment(recruitmentId, userId, updateData) {
    try {
      const recruitment = await Recruitment.findById(recruitmentId);
      if (!recruitment) {
        throw new Error('Recruitment not found');
      }

      // Check permission
      const projectHub = await ProjectHub.findById(recruitment.projectHub);
      const isOwner = projectHub.owner.toString() === userId.toString();
      const isAuthor = recruitment.postedBy.toString() === userId.toString();

      if (!isOwner && !isAuthor) {
        throw new Error('Not authorized to update this recruitment');
      }

      Object.assign(recruitment, updateData);
      await recruitment.save();

      return recruitment;
    } catch (error) {
      throw new Error(`Error updating recruitment: ${error.message}`);
    }
  }

  // Close/Fill recruitment
  async closeRecruitment(recruitmentId, userId, filledByUserId = null) {
    try {
      const recruitment = await Recruitment.findById(recruitmentId);
      if (!recruitment) {
        throw new Error('Recruitment not found');
      }

      // Check permission
      const projectHub = await ProjectHub.findById(recruitment.projectHub);
      const isOwner = projectHub.owner.toString() === userId.toString();
      const isAuthor = recruitment.postedBy.toString() === userId.toString();

      if (!isOwner && !isAuthor) {
        throw new Error('Not authorized to close this recruitment');
      }

      recruitment.status = filledByUserId ? 'filled' : 'closed';
      if (filledByUserId) {
        recruitment.filledBy = filledByUserId;
        recruitment.filledAt = new Date();
      }

      await recruitment.save();

      // Log activity
      await HubActivity.create({
        projectHubId: recruitment.projectHub,
        user: userId,
        action: filledByUserId ? 'filled recruitment role' : 'closed recruitment role',
        activityType: ACTIVITY_TYPES.RECRUITMENT_UPDATED,
        targetId: recruitment._id,
        targetName: recruitment.title,
        details: filledByUserId
          ? `Filled role: ${recruitment.title}`
          : `Closed role: ${recruitment.title}`,
      });

      return recruitment;
    } catch (error) {
      throw new Error(`Error closing recruitment: ${error.message}`);
    }
  }

  // Delete recruitment
  async deleteRecruitment(recruitmentId, userId) {
    try {
      const recruitment = await Recruitment.findById(recruitmentId);
      if (!recruitment) {
        throw new Error('Recruitment not found');
      }

      // Check permission
      const projectHub = await ProjectHub.findById(recruitment.projectHub);
      const isOwner = projectHub.owner.toString() === userId.toString();
      const isAuthor = recruitment.postedBy.toString() === userId.toString();

      if (!isOwner && !isAuthor) {
        throw new Error('Not authorized to delete this recruitment');
      }

      // Delete all applications
      await Application.deleteMany({ recruitment: recruitmentId });

      await recruitment.deleteOne();

      return { message: 'Recruitment deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting recruitment: ${error.message}`);
    }
  }
}

export default new RecruitmentService();
