// Hub Activity Types Constants
// These constants define all possible activity types in a project hub

// Task activities
const ACTIVITY_TYPES = {
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_MOVED: 'task_moved',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_REOPENED: 'task_reopened',
  TASK_COMMENT_ADDED: 'task_comment_added',
  TASK_ATTACHMENT_ADDED: 'task_attachment_added',
  
  // Milestone activities
  MILESTONE_CREATED: 'milestone_created',
  MILESTONE_UPDATED: 'milestone_updated',
  MILESTONE_DELETED: 'milestone_deleted',
  MILESTONE_STATUS_CHANGED: 'milestone_status_changed',
  MILESTONE_COMPLETED: 'milestone_completed',
  
  // Devlog activities
  DEVLOG_CREATED: 'devlog_created',
  DEVLOG_UPDATED: 'devlog_updated',
  DEVLOG_DELETED: 'devlog_deleted',
  DEVLOG_PINNED: 'devlog_pinned',
  DEVLOG_UNPINNED: 'devlog_unpinned',
  DEVLOG_REACTION_ADDED: 'devlog_reaction_added',
  
  // Member activities
  MEMBER_JOINED: 'member_joined',
  MEMBER_LEFT: 'member_left',
  MEMBER_ROLE_CHANGED: 'member_role_changed',
  MEMBER_INVITED: 'member_invited',
  
  // File activities
  FILE_UPLOADED: 'file_uploaded',
  FILE_DELETED: 'file_deleted',
  FILE_UPDATED: 'file_updated',
  
  // Project hub activities
  HUB_CREATED: 'hub_created',
  HUB_UPDATED: 'hub_updated',
  HUB_SETTINGS_CHANGED: 'hub_settings_changed',
  
  // Other activities
  COMMENT_ADDED: 'comment_added',
  COMMENT_DELETED: 'comment_deleted',
  OTHER: 'other',
};

// Activity type categories for grouping
const ACTIVITY_CATEGORIES = {
  TASK: [
    ACTIVITY_TYPES.TASK_CREATED,
    ACTIVITY_TYPES.TASK_UPDATED,
    ACTIVITY_TYPES.TASK_DELETED,
    ACTIVITY_TYPES.TASK_MOVED,
    ACTIVITY_TYPES.TASK_ASSIGNED,
    ACTIVITY_TYPES.TASK_COMPLETED,
    ACTIVITY_TYPES.TASK_REOPENED,
    ACTIVITY_TYPES.TASK_COMMENT_ADDED,
    ACTIVITY_TYPES.TASK_ATTACHMENT_ADDED,
  ],
  MILESTONE: [
    ACTIVITY_TYPES.MILESTONE_CREATED,
    ACTIVITY_TYPES.MILESTONE_UPDATED,
    ACTIVITY_TYPES.MILESTONE_DELETED,
    ACTIVITY_TYPES.MILESTONE_STATUS_CHANGED,
    ACTIVITY_TYPES.MILESTONE_COMPLETED,
  ],
  DEVLOG: [
    ACTIVITY_TYPES.DEVLOG_CREATED,
    ACTIVITY_TYPES.DEVLOG_UPDATED,
    ACTIVITY_TYPES.DEVLOG_DELETED,
    ACTIVITY_TYPES.DEVLOG_PINNED,
    ACTIVITY_TYPES.DEVLOG_UNPINNED,
    ACTIVITY_TYPES.DEVLOG_REACTION_ADDED,
  ],
  MEMBER: [
    ACTIVITY_TYPES.MEMBER_JOINED,
    ACTIVITY_TYPES.MEMBER_LEFT,
    ACTIVITY_TYPES.MEMBER_ROLE_CHANGED,
    ACTIVITY_TYPES.MEMBER_INVITED,
  ],
  FILE: [
    ACTIVITY_TYPES.FILE_UPLOADED,
    ACTIVITY_TYPES.FILE_DELETED,
    ACTIVITY_TYPES.FILE_UPDATED,
  ],
};

// Helper function to get category of an activity type
const getActivityCategory = (activityType) => {
  for (const [category, types] of Object.entries(ACTIVITY_CATEGORIES)) {
    if (types.includes(activityType)) {
      return category;
    }
  }
  return 'OTHER';
};

// Helper function to validate activity type
const isValidActivityType = (activityType) => {
  return Object.values(ACTIVITY_TYPES).includes(activityType);
};

// Helper function to get all activity type values as array (for mongoose enum)
const getAllActivityTypes = () => {
  return Object.values(ACTIVITY_TYPES);
};

export { ACTIVITY_TYPES, ACTIVITY_CATEGORIES, getActivityCategory, isValidActivityType, getAllActivityTypes };
export default ACTIVITY_TYPES;
