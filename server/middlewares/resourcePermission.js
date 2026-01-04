import ProjectHub from '../models/ProjectHub.js';
import Recruitment from '../models/Recruitment.js';
import Milestone from '../models/Milestone.js';
import Task from '../models/Task.js';
import Devlog from '../models/Devlog.js';
import Application from '../models/Application.js';
import { 
  PROJECT_HUB_ROLES, 
  PROJECT_HUB_PERMISSIONS,
  hasPermission,
  isAdminOrOwner,
} from '../constants/projectHubRoles.js';

/**
 * Helper to get hubId from different resource types
 */
const getHubIdFromResource = async (resourceType, resourceId) => {
  try {
    let hubId = null;

    switch (resourceType) {
      case 'recruitment': {
        const recruitment = await Recruitment.findById(resourceId).select('projectHub');
        hubId = recruitment?.projectHub;
        break;
      }
      case 'milestone': {
        const milestone = await Milestone.findById(resourceId).select('project.projectHubId');
        hubId = milestone?.project?.projectHubId;
        break;
      }
      case 'task': {
        const task = await Task.findById(resourceId).select('projectHubId');
        hubId = task?.projectHubId;
        break;
      }
      case 'devlog': {
        const devlog = await Devlog.findById(resourceId).select('projectHub');
        hubId = devlog?.projectHub;
        break;
      }
      case 'application': {
        const application = await Application.findById(resourceId)
          .populate({
            path: 'recruitment',
            select: 'projectHub',
          });
        hubId = application?.recruitment?.projectHub;
        break;
      }
      default:
        break;
    }

    return hubId;
  } catch (error) {
    return null;
  }
};

/**
 * Get user's permission role in a project hub
 */
export const getUserRole = async (hubId, userId) => {
  try {
    const projectHub = await ProjectHub.findById(hubId);
    
    if (!projectHub) {
      return null;
    }

    // Find user in members
    const member = projectHub.members.find(
      m => m.user.toString() === userId
    );

    return member ? member.permissionRole : null;
  } catch (error) {
    return null;
  }
};

/**
 * Middleware factory to check permission for resources that belong to a project hub
 * @param {string} resourceType - Type of resource: 'recruitment', 'milestone', 'task', 'devlog', 'application'
 * @param {string} permission - Required permission from PROJECT_HUB_PERMISSIONS
 */
export const checkResourcePermission = (resourceType, permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const resourceId = req.params.id || req.params.milestoneId;

      // Get hubId from resource
      const hubId = await getHubIdFromResource(resourceType, resourceId);

      if (!hubId) {
        return res.status(404).json({
          success: false,
          message: `${resourceType} not found or does not belong to a project hub`,
        });
      }

      // Get user's role in the hub
      const role = await getUserRole(hubId, userId);

      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this project hub',
        });
      }

      // Check permission
      if (!hasPermission(role, permission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have permission: ${permission}`,
        });
      }

      // Attach role and hubId to request for later use
      req.userRole = role;
      req.hubId = hubId;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions',
      });
    }
  };
};

/**
 * Check if user can manage recruitment (create, update, delete)
 */
export const checkRecruitmentPermission = (action) => {
  const permissionMap = {
    create: PROJECT_HUB_PERMISSIONS.CREATE_RECRUITMENT,
    update: PROJECT_HUB_PERMISSIONS.UPDATE_RECRUITMENT,
    delete: PROJECT_HUB_PERMISSIONS.DELETE_RECRUITMENT,
    review: PROJECT_HUB_PERMISSIONS.REVIEW_APPLICATION,
  };

  return checkResourcePermission('recruitment', permissionMap[action]);
};

/**
 * Check if user can manage milestones
 */
export const checkMilestonePermission = (action) => {
  const permissionMap = {
    create: PROJECT_HUB_PERMISSIONS.CREATE_MILESTONE,
    update: PROJECT_HUB_PERMISSIONS.UPDATE_MILESTONE,
    delete: PROJECT_HUB_PERMISSIONS.DELETE_MILESTONE,
  };

  return checkResourcePermission('milestone', permissionMap[action]);
};

/**
 * Check if user can manage tasks
 */
export const checkTaskPermission = (action) => {
  const permissionMap = {
    create: PROJECT_HUB_PERMISSIONS.CREATE_TASK,
    update: PROJECT_HUB_PERMISSIONS.UPDATE_TASK,
    delete: PROJECT_HUB_PERMISSIONS.DELETE_TASK,
  };

  return checkResourcePermission('task', permissionMap[action]);
};

/**
 * Check if user can manage devlogs
 */
export const checkDevlogPermission = (action) => {
  const permissionMap = {
    create: PROJECT_HUB_PERMISSIONS.CREATE_DEVLOG,
    update: PROJECT_HUB_PERMISSIONS.UPDATE_DEVLOG,
    delete: PROJECT_HUB_PERMISSIONS.DELETE_DEVLOG,
  };

  return checkResourcePermission('devlog', permissionMap[action]);
};

/**
 * Check if user can review applications
 */
export const checkCanReviewApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;

    const hubId = await getHubIdFromResource('application', applicationId);

    if (!hubId) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const role = await getUserRole(hubId, userId);

    if (!role || !hasPermission(role, PROJECT_HUB_PERMISSIONS.REVIEW_APPLICATION)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only owner or admin can review applications.',
      });
    }

    req.userRole = role;
    req.hubId = hubId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking permissions',
    });
  }
};

export default {
  getUserRole,
  checkResourcePermission,
  checkRecruitmentPermission,
  checkMilestonePermission,
  checkTaskPermission,
  checkDevlogPermission,
  checkCanReviewApplication,
};
