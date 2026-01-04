// Project Hub Roles and Permissions Constants

export const PROJECT_HUB_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  [PROJECT_HUB_ROLES.OWNER]: 'Owner',
  [PROJECT_HUB_ROLES.ADMIN]: 'Admin',
  [PROJECT_HUB_ROLES.MEMBER]: 'Member',
  [PROJECT_HUB_ROLES.VIEWER]: 'Viewer',
};

export const ROLE_COLORS = {
  [PROJECT_HUB_ROLES.OWNER]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
  },
  [PROJECT_HUB_ROLES.ADMIN]: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  [PROJECT_HUB_ROLES.MEMBER]: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  [PROJECT_HUB_ROLES.VIEWER]: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
};

export const ROLE_DESCRIPTIONS = {
  [PROJECT_HUB_ROLES.OWNER]: 'Full control over the project hub',
  [PROJECT_HUB_ROLES.ADMIN]: 'Manage members, recruitment, and content',
  [PROJECT_HUB_ROLES.MEMBER]: 'Create and edit milestones, tasks, and devlogs',
  [PROJECT_HUB_ROLES.VIEWER]: 'View-only access to project content',
};

// Project Hub Permissions (matching backend)
export const PROJECT_HUB_PERMISSIONS = {
  // Hub Management
  DELETE_HUB: 'delete_hub',
  UPDATE_HUB_INFO: 'update_hub_info',
  UPDATE_HUB_SETTINGS: 'update_hub_settings',
  
  // Member Management
  ADD_MEMBER: 'add_member',
  REMOVE_MEMBER: 'remove_member',
  UPDATE_MEMBER_ROLE: 'update_member_role',
  
  // Recruitment
  CREATE_RECRUITMENT: 'create_recruitment',
  UPDATE_RECRUITMENT: 'update_recruitment',
  DELETE_RECRUITMENT: 'delete_recruitment',
  REVIEW_APPLICATION: 'review_application',
  
  // Content Management
  CREATE_MILESTONE: 'create_milestone',
  UPDATE_MILESTONE: 'update_milestone',
  DELETE_MILESTONE: 'delete_milestone',
  CREATE_TASK: 'create_task',
  UPDATE_TASK: 'update_task',
  DELETE_TASK: 'delete_task',
  CREATE_DEVLOG: 'create_devlog',
  UPDATE_DEVLOG: 'update_devlog',
  DELETE_DEVLOG: 'delete_devlog',
  
  // View
  VIEW_HUB: 'view_hub',
};

// Permission Matrix: Role -> Permissions (matching backend)
export const ROLE_PERMISSIONS = {
  [PROJECT_HUB_ROLES.OWNER]: [
    PROJECT_HUB_PERMISSIONS.DELETE_HUB,
    PROJECT_HUB_PERMISSIONS.UPDATE_HUB_INFO,
    PROJECT_HUB_PERMISSIONS.UPDATE_HUB_SETTINGS,
    PROJECT_HUB_PERMISSIONS.ADD_MEMBER,
    PROJECT_HUB_PERMISSIONS.REMOVE_MEMBER,
    PROJECT_HUB_PERMISSIONS.UPDATE_MEMBER_ROLE,
    PROJECT_HUB_PERMISSIONS.CREATE_RECRUITMENT,
    PROJECT_HUB_PERMISSIONS.UPDATE_RECRUITMENT,
    PROJECT_HUB_PERMISSIONS.DELETE_RECRUITMENT,
    PROJECT_HUB_PERMISSIONS.REVIEW_APPLICATION,
    PROJECT_HUB_PERMISSIONS.CREATE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.UPDATE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.DELETE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.CREATE_TASK,
    PROJECT_HUB_PERMISSIONS.UPDATE_TASK,
    PROJECT_HUB_PERMISSIONS.DELETE_TASK,
    PROJECT_HUB_PERMISSIONS.CREATE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.UPDATE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.DELETE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.VIEW_HUB,
  ],
  
  [PROJECT_HUB_ROLES.ADMIN]: [
    PROJECT_HUB_PERMISSIONS.UPDATE_HUB_INFO,
    PROJECT_HUB_PERMISSIONS.UPDATE_HUB_SETTINGS,
    PROJECT_HUB_PERMISSIONS.ADD_MEMBER,
    PROJECT_HUB_PERMISSIONS.REMOVE_MEMBER,
    PROJECT_HUB_PERMISSIONS.CREATE_RECRUITMENT,
    PROJECT_HUB_PERMISSIONS.UPDATE_RECRUITMENT,
    PROJECT_HUB_PERMISSIONS.DELETE_RECRUITMENT,
    PROJECT_HUB_PERMISSIONS.REVIEW_APPLICATION,
    PROJECT_HUB_PERMISSIONS.CREATE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.UPDATE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.DELETE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.CREATE_TASK,
    PROJECT_HUB_PERMISSIONS.UPDATE_TASK,
    PROJECT_HUB_PERMISSIONS.DELETE_TASK,
    PROJECT_HUB_PERMISSIONS.CREATE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.UPDATE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.DELETE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.VIEW_HUB,
  ],
  
  [PROJECT_HUB_ROLES.MEMBER]: [
    PROJECT_HUB_PERMISSIONS.CREATE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.UPDATE_MILESTONE,
    PROJECT_HUB_PERMISSIONS.CREATE_TASK,
    PROJECT_HUB_PERMISSIONS.UPDATE_TASK,
    PROJECT_HUB_PERMISSIONS.CREATE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.UPDATE_DEVLOG,
    PROJECT_HUB_PERMISSIONS.VIEW_HUB,
  ],
  
  [PROJECT_HUB_ROLES.VIEWER]: [
    PROJECT_HUB_PERMISSIONS.VIEW_HUB,
  ],
};

// Core permission checking function
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

// Role hierarchy checks
export const isOwner = (role) => role === PROJECT_HUB_ROLES.OWNER;
export const isAdmin = (role) => role === PROJECT_HUB_ROLES.ADMIN;
export const isMember = (role) => role === PROJECT_HUB_ROLES.MEMBER;
export const isViewer = (role) => role === PROJECT_HUB_ROLES.VIEWER;

export const isAdminOrOwner = (role) => {
  return role === PROJECT_HUB_ROLES.OWNER || role === PROJECT_HUB_ROLES.ADMIN;
};

export const isMemberOrAbove = (role) => {
  return role === PROJECT_HUB_ROLES.OWNER || 
         role === PROJECT_HUB_ROLES.ADMIN || 
         role === PROJECT_HUB_ROLES.MEMBER;
};

// Specific permission checks (user-friendly functions)

// Hub Management
export const canDeleteHub = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.DELETE_HUB);
export const canUpdateHubInfo = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.UPDATE_HUB_INFO);
export const canUpdateHubSettings = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.UPDATE_HUB_SETTINGS);

// Member Management
export const canAddMember = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.ADD_MEMBER);
export const canRemoveMember = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.REMOVE_MEMBER);
export const canUpdateMemberRole = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.UPDATE_MEMBER_ROLE);
export const canManageMembers = (role) => canAddMember(role) || canRemoveMember(role);

// Recruitment
export const canCreateRecruitment = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.CREATE_RECRUITMENT);
export const canUpdateRecruitment = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.UPDATE_RECRUITMENT);
export const canDeleteRecruitment = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.DELETE_RECRUITMENT);
export const canReviewApplication = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.REVIEW_APPLICATION);
export const canManageRecruitment = (role) => canCreateRecruitment(role);

// Milestones
export const canCreateMilestone = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.CREATE_MILESTONE);
export const canUpdateMilestone = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.UPDATE_MILESTONE);
export const canDeleteMilestone = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.DELETE_MILESTONE);

// Tasks
export const canCreateTask = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.CREATE_TASK);
export const canUpdateTask = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.UPDATE_TASK);
export const canDeleteTask = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.DELETE_TASK);

// Devlogs
export const canCreateDevlog = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.CREATE_DEVLOG);
export const canUpdateDevlog = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.UPDATE_DEVLOG);
export const canDeleteDevlog = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.DELETE_DEVLOG);

// View
export const canViewHub = (role) => hasPermission(role, PROJECT_HUB_PERMISSIONS.VIEW_HUB);

// Utility functions
export const getAssignableRoles = () => {
  return [
    PROJECT_HUB_ROLES.ADMIN,
    PROJECT_HUB_ROLES.MEMBER,
    PROJECT_HUB_ROLES.VIEWER,
  ];
};

export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || 'Unknown';
};

export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || ROLE_COLORS[PROJECT_HUB_ROLES.VIEWER];
};
