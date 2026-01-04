import { useMemo } from 'react';
import { useAuth } from '../context/authContext';
import {
  hasPermission,
  isOwner,
  isAdmin,
  isAdminOrOwner,
  isMemberOrAbove,
  canDeleteHub,
  canUpdateHubInfo,
  canUpdateHubSettings,
  canAddMember,
  canRemoveMember,
  canUpdateMemberRole,
  canManageMembers,
  canCreateRecruitment,
  canUpdateRecruitment,
  canDeleteRecruitment,
  canReviewApplication,
  canManageRecruitment,
  canCreateMilestone,
  canUpdateMilestone,
  canDeleteMilestone,
  canCreateTask,
  canUpdateTask,
  canDeleteTask,
  canCreateDevlog,
  canUpdateDevlog,
  canDeleteDevlog,
  canViewHub,
} from '../constants/projectHubRoles';

/**
 * Custom hook to get current user's role and permissions in a project hub
 * @param {Object} project - The project hub object
 * @returns {Object} Object containing role and permission checking functions
 */
export const useProjectHubPermissions = (project) => {
  const { user } = useAuth();
  console.log('useProjectHubPermissions - user:', user, 'project:', project);
  const userRole = useMemo(() => {
    if (!project || !user) return 'viewer';

    // Check if user is the owner
    const projectOwnerId = project.owner?._id || project.owner;
    const userId = user.profile._id;
    console.log('Project Owner ID:', projectOwnerId, 'User ID:', userId);
    if (userId === projectOwnerId) {
      return 'owner';
    }

    // Find user in members array
    const member = project.members?.find(
      m => {
        const memberId = m.user?._id || m.user?.user || m.user;
        return memberId === userId;
      }
    );

    return member?.permissionRole || 'viewer';
  }, [project, user]);

  // Return all permission checking functions bound to the user's role
  return useMemo(() => ({
    // Current role
    role: userRole,
    userId: user?.id || user?._id,
    
    // Role checks
    isOwner: isOwner(userRole),
    isAdmin: isAdmin(userRole),
    isAdminOrOwner: isAdminOrOwner(userRole),
    isMemberOrAbove: isMemberOrAbove(userRole),
    
    // Hub management permissions
    canDeleteHub: canDeleteHub(userRole),
    canUpdateHubInfo: canUpdateHubInfo(userRole),
    canUpdateHubSettings: canUpdateHubSettings(userRole),
    
    // Member management permissions
    canAddMember: canAddMember(userRole),
    canRemoveMember: canRemoveMember(userRole),
    canUpdateMemberRole: canUpdateMemberRole(userRole),
    canManageMembers: canManageMembers(userRole),
    
    // Recruitment permissions
    canCreateRecruitment: canCreateRecruitment(userRole),
    canUpdateRecruitment: canUpdateRecruitment(userRole),
    canDeleteRecruitment: canDeleteRecruitment(userRole),
    canReviewApplication: canReviewApplication(userRole),
    canManageRecruitment: canManageRecruitment(userRole),
    
    // Milestone permissions
    canCreateMilestone: canCreateMilestone(userRole),
    canUpdateMilestone: canUpdateMilestone(userRole),
    canDeleteMilestone: canDeleteMilestone(userRole),
    
    // Task permissions
    canCreateTask: canCreateTask(userRole),
    canUpdateTask: canUpdateTask(userRole),
    canDeleteTask: canDeleteTask(userRole),
    
    // Devlog permissions
    canCreateDevlog: canCreateDevlog(userRole),
    canUpdateDevlog: canUpdateDevlog(userRole),
    canDeleteDevlog: canDeleteDevlog(userRole),
    
    // View permission
    canViewHub: canViewHub(userRole),
    
    // Generic permission checker
    hasPermission: (permission) => hasPermission(userRole, permission),
  }), [userRole, user]);
};

export default useProjectHubPermissions;
