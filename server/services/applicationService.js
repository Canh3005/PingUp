import Application from '../models/Application.js';
import Recruitment from '../models/Recruitment.js';
import ProjectHub from '../models/ProjectHub.js';
import HubActivity from '../models/HubActivity.js';
import { ACTIVITY_TYPES } from '../constants/activityTypes.js';

class ApplicationService {
  // Create new application
  async createApplication(userId, applicationData) {
    try {
      // Verify recruitment exists and is open
      const recruitment = await Recruitment.findById(applicationData.recruitment);
      if (!recruitment) {
        throw new Error('Recruitment not found');
      }

      if (recruitment.status !== 'open') {
        throw new Error('This recruitment is no longer accepting applications');
      }

      // Check if user is owner or member of the project hub
      const projectHub = await ProjectHub.findById(recruitment.projectHub);
      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      const isOwner = projectHub.owner.toString() === userId.toString();
      const isMember = projectHub.members.some(
        (member) => member.user.toString() === userId.toString()
      );

      if (isOwner || isMember) {
        throw new Error('You cannot apply to your own project hub');
      }

      // Check if user already applied
      const existingApplication = await Application.findOne({
        recruitment: applicationData.recruitment,
        applicant: userId,
      });

      if (existingApplication) {
        throw new Error('You have already applied to this role');
      }

      const application = new Application({
        ...applicationData,
        applicant: userId,
      });

      await application.save();

      // Populate before returning
      await application.populate('applicant', 'name avatarUrl bio skills');
      await application.populate('recruitment', 'title type');

      // Log activity
      await HubActivity.create({
        projectHubId: recruitment.projectHub,
        user: userId,
        action: 'applied to recruitment',
        activityType: ACTIVITY_TYPES.APPLICATION_CREATED,
        targetId: recruitment._id,
        targetName: recruitment.title,
        details: `Applied to: ${recruitment.title}`,
      });

      return application;
    } catch (error) {
      throw new Error(`Error creating application: ${error.message}`);
    }
  }

  // Get application by ID
  async getApplicationById(applicationId) {
    try {
      const application = await Application.findById(applicationId)
        .populate({
          path: 'applicant',
          select: 'name avatarUrl bio skills jobTitle userId',
          populate: {
            path: 'userId',
            select: 'email'
          }
        })
        .populate('recruitment', 'title description type location credits')
        .populate('reviewedBy', 'name avatarUrl');

      if (!application) {
        throw new Error('Application not found');
      }

      return application;
    } catch (error) {
      throw new Error(`Error fetching application: ${error.message}`);
    }
  }

  // Get applications by recruitment
  async getApplicationsByRecruitment(recruitmentId, filters = {}) {
    try {
      const { status } = filters;
      const query = { recruitment: recruitmentId };

      if (status && status !== 'all') {
        query.status = status;
      }

      const applications = await Application.find(query)
        .populate({
          path: 'applicant',
          select: 'name avatarUrl bio skills jobTitle userId',
          populate: {
            path: 'userId',
            select: 'email'
          }
        })
        .populate('recruitment', 'title description type location credits')
        .populate('reviewedBy', 'name avatarUrl')
        .sort({ createdAt: -1 });

      return applications;
    } catch (error) {
      throw new Error(`Error fetching applications: ${error.message}`);
    }
  }

  // Get applications by user
  async getApplicationsByUser(userId) {
    try {
      const applications = await Application.find({ applicant: userId })
        .populate('recruitment', 'title description type location credits status projectHub')
        .populate({
          path: 'recruitment',
          populate: {
            path: 'projectHub',
            select: 'name logo',
          },
        })
        .sort({ createdAt: -1 });

      return applications;
    } catch (error) {
      throw new Error(`Error fetching user applications: ${error.message}`);
    }
  }

  // Update application status
  async updateApplicationStatus(applicationId, userId, status, reviewNotes = '') {
    try {
      const application = await Application.findById(applicationId).populate('recruitment');
      if (!application) {
        throw new Error('Application not found');
      }

      // Check permission - must be project hub owner or admin
      const recruitment = application.recruitment;
      const projectHub = await ProjectHub.findById(recruitment.projectHub);
      
      if (!projectHub) {
        throw new Error('Project hub not found');
      }

      const isOwner = projectHub.owner.toString() === userId.toString();
      const isMember = projectHub.members.some(
        (member) =>
          member.user.toString() === userId.toString() &&
          (member.role === 'admin' || member.role === 'owner')
      );

      if (!isOwner && !isMember) {
        throw new Error('Not authorized to review this application');
      }

      application.status = status;
      application.reviewedBy = userId;
      application.reviewedAt = new Date();
      if (reviewNotes) {
        application.reviewNotes = reviewNotes;
      }

      await application.save();

      // If accepted, add to project hub members and check if recruitment should be filled
      if (status === 'accepted') {
        const existingMember = projectHub.members.find(
          (m) => m.user.toString() === application.applicant.toString()
        );

        if (!existingMember) {
          projectHub.members.push({
            user: application.applicant,
            role: 'member',
            joinedAt: new Date(),
          });
          await projectHub.save();
        }

        // Check if recruitment should be filled
        const acceptedCount = await Application.countDocuments({
          recruitment: recruitment._id,
          status: 'accepted',
        });

        // If we have enough accepted applications, mark recruitment as filled
        if (acceptedCount >= (recruitment.positions || 1)) {
          recruitment.status = 'filled';
          recruitment.filledAt = new Date();
          await recruitment.save();

          console.log('Recruitment marked as filled');
        }

        // Log activity
        await HubActivity.create({
          projectHubId: recruitment.projectHub,
          user: userId,
          action: 'accepted application',
          activityType: ACTIVITY_TYPES.MEMBER_JOINED,
          targetId: application.applicant,
          details: `Accepted application for: ${recruitment.title}`,
        });
      }

      return application;
    } catch (error) {
      throw new Error(`Error updating application status: ${error.message}`);
    }
  }

  // Withdraw application (by applicant)
  async withdrawApplication(applicationId, userId) {
    try {
      const application = await Application.findById(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      // Check if user is the applicant
      if (application.applicant.toString() !== userId) {
        throw new Error('Not authorized to withdraw this application');
      }

      // Can only withdraw if pending or shortlisted
      if (application.status === 'accepted' || application.status === 'rejected') {
        throw new Error('Cannot withdraw an already processed application');
      }

      await application.deleteOne();

      return { message: 'Application withdrawn successfully' };
    } catch (error) {
      throw new Error(`Error withdrawing application: ${error.message}`);
    }
  }

  // Get applications count by status for a recruitment
  async getApplicationStats(recruitmentId) {
    try {
      const stats = await Application.aggregate([
        { $match: { recruitment: recruitmentId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const statsObj = {
        total: 0,
        pending: 0,
        shortlisted: 0,
        accepted: 0,
        rejected: 0,
      };

      stats.forEach((stat) => {
        statsObj[stat._id] = stat.count;
        statsObj.total += stat.count;
      });

      return statsObj;
    } catch (error) {
      throw new Error(`Error fetching application stats: ${error.message}`);
    }
  }
}

export default new ApplicationService();
