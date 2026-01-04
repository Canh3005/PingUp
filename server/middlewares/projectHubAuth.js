import ProjectHub from '../models/ProjectHub.js';
import { 
  PROJECT_HUB_ROLES, 
  PROJECT_HUB_PERMISSIONS,
  hasPermission,
  isOwner,
  isAdminOrOwner,
  isMember 
} from '../constants/projectHubRoles.js';

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
 * Middleware to check if user is a member of the project hub
 */
export const checkIsMember = async (req, res, next) => {
  try {
    const { hubId } = req.params;
    const userId = req.user.profile._id.toString();

    const role = await getUserRole(hubId, userId);

    if (!role) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this project hub',
      });
    }

    // Attach role to request for later use
    req.userRole = role;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking member status',
    });
  }
};

/**
 * Middleware to check if user is admin or owner
 */
export const checkIsAdminOrOwner = async (req, res, next) => {
  try {
    const { hubId } = req.params;
    const userId = req.user.profile._id.toString();

    const role = await getUserRole(hubId, userId);

    if (!role || !isAdminOrOwner(role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only owner or admin can perform this action.',
      });
    }

    req.userRole = role;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking permissions',
    });
  }
};

/**
 * Middleware to check if user is owner
 */
export const checkIsOwner = async (req, res, next) => {
  try {
    const { hubId } = req.params;
    const userId = req.user.profile._id.toString();

    const role = await getUserRole(hubId, userId);

    if (!role || !isOwner(role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only owner can perform this action.',
      });
    }

    req.userRole = role;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking permissions',
    });
  }
};

/**
 * Middleware factory to check specific permission
 */
export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { hubId } = req.params;
      const userId = req.user.profile._id.toString();

      const role = await getUserRole(hubId, userId);

      if (!role || !hasPermission(role, permission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have permission: ${permission}`,
        });
      }

      req.userRole = role;
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
 * Helper to check multiple permissions (user needs at least one)
 */
export const checkAnyPermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      const { hubId } = req.params;
      const userId = req.user.profile._id.toString();

      const role = await getUserRole(hubId, userId);

      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not a member of this project hub.',
        });
      }

      const hasAnyPermission = permissions.some(permission => 
        hasPermission(role, permission)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You don\'t have the required permissions.',
        });
      }

      req.userRole = role;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions',
      });
    }
  };
};

export default {
  getUserRole,
  checkIsMember,
  checkIsAdminOrOwner,
  checkIsOwner,
  checkPermission,
  checkAnyPermission,
};
