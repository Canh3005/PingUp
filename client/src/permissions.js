/**
 * Project Hub Permission System
 * 
 * This module exports the complete permission system for Project Hub including:
 * - Role constants and definitions
 * - Permission checking functions
 * - Custom React hook for permission management
 * - Example components demonstrating usage
 */

// Core constants and functions
export {
  // Role constants
  PROJECT_HUB_ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_DESCRIPTIONS,
  PROJECT_HUB_PERMISSIONS,
  ROLE_PERMISSIONS,
  
  // Core permission checker
  hasPermission,
  
  // Role hierarchy checks
  isOwner,
  isAdmin,
  isMember,
  isViewer,
  isAdminOrOwner,
  isMemberOrAbove,
  
  // Hub management
  canDeleteHub,
  canUpdateHubInfo,
  canUpdateHubSettings,
  
  // Member management
  canAddMember,
  canRemoveMember,
  canUpdateMemberRole,
  canManageMembers,
  
  // Recruitment
  canCreateRecruitment,
  canUpdateRecruitment,
  canDeleteRecruitment,
  canReviewApplication,
  canManageRecruitment,
  
  // Milestones
  canCreateMilestone,
  canUpdateMilestone,
  canDeleteMilestone,
  
  // Tasks
  canCreateTask,
  canUpdateTask,
  canDeleteTask,
  
  // Devlogs
  canCreateDevlog,
  canUpdateDevlog,
  canDeleteDevlog,
  
  // View
  canViewHub,
  
  // Utility functions
  getAssignableRoles,
  getRolePermissions,
  getRoleLabel,
  getRoleColor,
} from './constants/projectHubRoles';

// Custom hook
export { default as useProjectHubPermissions } from './hooks/useProjectHubPermissions';

// Example components (for reference)
export { default as ProjectHubHeaderExample } from './components/project-hub/examples/ProjectHubHeader.example';
export { default as RecruitmentActionsExample } from './components/project-hub/examples/RecruitmentActions.example';
export { default as ContentActionsExample } from './components/project-hub/examples/ContentActions.example';

/**
 * Quick Start Guide:
 * 
 * 1. Import the hook in your component:
 *    import { useProjectHubPermissions } from '@/permissions';
 * 
 * 2. Use it with your project:
 *    const permissions = useProjectHubPermissions(project);
 * 
 * 3. Check permissions:
 *    {permissions.canAddMember && <button>Add Member</button>}
 * 
 * See PERMISSION_SYSTEM_GUIDE.md for full documentation.
 */
