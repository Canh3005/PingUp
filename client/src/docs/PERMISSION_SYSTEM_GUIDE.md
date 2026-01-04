# Project Hub Permissions System - Usage Guide

## Overview
Hệ thống phân quyền 2 tầng cho Project Hub:
- **Permission Roles**: owner, admin, member, viewer (dùng cho kiểm soát quyền truy cập)
- **Job Positions**: Frontend Dev, Backend Dev, Designer, etc. (dùng cho nghiệp vụ)

## Quick Start

### 1. Using the Custom Hook (Recommended)

```jsx
import useProjectHubPermissions from '@/hooks/useProjectHubPermissions';

function MyComponent({ project }) {
  const permissions = useProjectHubPermissions(project);
  
  return (
    <div>
      <h3>Current Role: {permissions.role}</h3>
      
      {/* Conditionally show Add Member button */}
      {permissions.canAddMember && (
        <button onClick={handleAddMember}>
          Add Member
        </button>
      )}
      
      {/* Conditionally show Delete Hub button */}
      {permissions.canDeleteHub && (
        <button onClick={handleDeleteHub}>
          Delete Hub
        </button>
      )}
      
      {/* Check if user can create recruitment */}
      {permissions.canCreateRecruitment && (
        <button onClick={handleCreateRecruitment}>
          Create Recruitment Post
        </button>
      )}
    </div>
  );
}
```

### 2. Using Helper Functions Directly

```jsx
import {
  canAddMember,
  canDeleteHub,
  canCreateRecruitment,
  isOwner,
  isAdminOrOwner,
} from '@/constants/projectHubRoles';

function MyComponent({ userRole }) {
  return (
    <div>
      {/* Check specific permission */}
      {canAddMember(userRole) && (
        <button>Add Member</button>
      )}
      
      {/* Check role hierarchy */}
      {isAdminOrOwner(userRole) && (
        <button>Manage Settings</button>
      )}
      
      {/* Check if owner */}
      {isOwner(userRole) && (
        <button>Delete Hub</button>
      )}
    </div>
  );
}
```

## Available Permissions

### Hook Returns
```javascript
{
  // Current State
  role: 'owner' | 'admin' | 'member' | 'viewer',
  userId: string,
  
  // Role Hierarchy Checks
  isOwner: boolean,
  isAdmin: boolean,
  isAdminOrOwner: boolean,
  isMemberOrAbove: boolean,
  
  // Hub Management
  canDeleteHub: boolean,
  canUpdateHubInfo: boolean,
  canUpdateHubSettings: boolean,
  
  // Member Management
  canAddMember: boolean,
  canRemoveMember: boolean,
  canUpdateMemberRole: boolean,
  canManageMembers: boolean,
  
  // Recruitment
  canCreateRecruitment: boolean,
  canUpdateRecruitment: boolean,
  canDeleteRecruitment: boolean,
  canReviewApplication: boolean,
  canManageRecruitment: boolean,
  
  // Milestones
  canCreateMilestone: boolean,
  canUpdateMilestone: boolean,
  canDeleteMilestone: boolean,
  
  // Tasks
  canCreateTask: boolean,
  canUpdateTask: boolean,
  canDeleteTask: boolean,
  
  // Devlogs
  canCreateDevlog: boolean,
  canUpdateDevlog: boolean,
  canDeleteDevlog: boolean,
  
  // View
  canViewHub: boolean,
  
  // Generic checker
  hasPermission: (permission: string) => boolean,
}
```

## Permission Matrix

| Feature | Owner | Admin | Member | Viewer |
|---------|-------|-------|--------|--------|
| Delete Hub | ✅ | ❌ | ❌ | ❌ |
| Update Hub Info | ✅ | ✅ | ❌ | ❌ |
| Add/Remove Member | ✅ | ✅ | ❌ | ❌ |
| Update Member Role | ✅ | ❌ | ❌ | ❌ |
| Manage Recruitment | ✅ | ✅ | ❌ | ❌ |
| Review Application | ✅ | ✅ | ❌ | ❌ |
| Create/Update Milestone | ✅ | ✅ | ✅ | ❌ |
| Delete Milestone | ✅ | ✅ | ❌ | ❌ |
| Create/Update Task | ✅ | ✅ | ✅ | ❌ |
| Delete Task | ✅ | ✅ | ❌ | ❌ |
| Create/Update Devlog | ✅ | ✅ | ✅ | ❌ |
| Delete Devlog | ✅ | ✅ | ❌ | ❌ |
| View Hub | ✅ | ✅ | ✅ | ✅ |

## Real-World Examples

### Example 1: Recruitment Tab
```jsx
import useProjectHubPermissions from '@/hooks/useProjectHubPermissions';

function RecruitmentTab({ project }) {
  const { canCreateRecruitment, canManageRecruitment } = useProjectHubPermissions(project);
  
  return (
    <div>
      {/* Only owner/admin can create */}
      {canCreateRecruitment && (
        <button onClick={handleCreate}>
          Create Recruitment Post
        </button>
      )}
      
      {/* Show manage options */}
      {canManageRecruitment && (
        <div className="admin-actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Milestone Actions
```jsx
import useProjectHubPermissions from '@/hooks/useProjectHubPermissions';

function MilestoneCard({ milestone, project }) {
  const permissions = useProjectHubPermissions(project);
  
  return (
    <div className="milestone-card">
      <h3>{milestone.title}</h3>
      
      {/* All members can edit milestone content */}
      {permissions.canUpdateMilestone && (
        <button onClick={handleEdit}>Edit</button>
      )}
      
      {/* Only owner/admin can delete */}
      {permissions.canDeleteMilestone && (
        <button onClick={handleDelete} className="text-red-600">
          Delete
        </button>
      )}
    </div>
  );
}
```

### Example 3: Settings Page
```jsx
import useProjectHubPermissions from '@/hooks/useProjectHubPermissions';

function SettingsPage({ project }) {
  const {
    isOwner,
    canUpdateHubSettings,
    canDeleteHub,
  } = useProjectHubPermissions(project);
  
  return (
    <div>
      {/* Basic settings - owner/admin */}
      {canUpdateHubSettings && (
        <section>
          <h2>Hub Settings</h2>
          <input name="name" />
          <textarea name="description" />
        </section>
      )}
      
      {/* Danger zone - only owner */}
      {isOwner && (
        <section className="danger-zone">
          <h2>Danger Zone</h2>
          {canDeleteHub && (
            <button className="btn-danger" onClick={handleDelete}>
              Delete Project Hub
            </button>
          )}
        </section>
      )}
    </div>
  );
}
```

### Example 4: Task Board
```jsx
import useProjectHubPermissions from '@/hooks/useProjectHubPermissions';

function TaskBoard({ project }) {
  const {
    canCreateTask,
    canUpdateTask,
    canDeleteTask,
    isMemberOrAbove,
  } = useProjectHubPermissions(project);
  
  return (
    <div>
      {/* Create task button */}
      {canCreateTask && (
        <button onClick={handleCreateTask}>
          + New Task
        </button>
      )}
      
      {/* Task list */}
      <div className="tasks">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            canEdit={canUpdateTask}
            canDelete={canDeleteTask}
            isMember={isMemberOrAbove}
          />
        ))}
      </div>
    </div>
  );
}
```

### Example 5: Application Review
```jsx
import useProjectHubPermissions from '@/hooks/useProjectHubPermissions';

function ApplicationCard({ application, project }) {
  const { canReviewApplication, isAdminOrOwner } = useProjectHubPermissions(project);
  
  return (
    <div className="application-card">
      <h4>{application.applicant.name}</h4>
      <p>{application.message}</p>
      
      {/* Only owner/admin can review */}
      {canReviewApplication && (
        <div className="review-actions">
          <button onClick={() => handleReview('approved')} className="btn-success">
            Accept
          </button>
          <button onClick={() => handleReview('rejected')} className="btn-danger">
            Reject
          </button>
        </div>
      )}
      
      {/* Admin status indicator */}
      {isAdminOrOwner && (
        <span className="admin-badge">Admin View</span>
      )}
    </div>
  );
}
```

## Tips & Best Practices

### 1. Always Check Permissions Before Actions
```jsx
// ❌ Bad - No permission check
function handleDelete() {
  deleteHub(hubId);
}

// ✅ Good - Check permission first
function handleDelete() {
  if (!permissions.canDeleteHub) {
    toast.error('You do not have permission to delete this hub');
    return;
  }
  deleteHub(hubId);
}
```

### 2. Hide UI Elements for Better UX
```jsx
// ❌ Bad - Show disabled buttons
<button disabled={!canDelete}>Delete</button>

// ✅ Good - Conditionally render
{canDelete && <button>Delete</button>}
```

### 3. Group Related Permissions
```jsx
// ✅ Good - Destructure what you need
const {
  canCreateTask,
  canUpdateTask,
  canDeleteTask,
} = useProjectHubPermissions(project);

// ❌ Avoid - Getting whole object when you need few fields
const permissions = useProjectHubPermissions(project);
// ... use permissions.canCreateTask everywhere
```

### 4. Handle Edge Cases
```jsx
function MyComponent({ project }) {
  const permissions = useProjectHubPermissions(project);
  
  // Handle loading state
  if (!project) {
    return <Loading />;
  }
  
  // Handle no access
  if (!permissions.canViewHub) {
    return <NoAccess />;
  }
  
  return (
    // Normal UI
  );
}
```

### 5. Combine with Feature Flags
```jsx
const {
  canCreateRecruitment,
  isAdminOrOwner,
} = useProjectHubPermissions(project);

const FEATURE_FLAGS = {
  aiRecruitment: true,
  videoInterview: false,
};

// Combine permission + feature flag
const showAIRecruitment = canCreateRecruitment && 
                          isAdminOrOwner && 
                          FEATURE_FLAGS.aiRecruitment;

{showAIRecruitment && (
  <button>Create AI-Powered Recruitment</button>
)}
```

## Testing Permissions

### Mock Hook for Tests
```jsx
// In your test file
jest.mock('@/hooks/useProjectHubPermissions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Test as owner
useProjectHubPermissions.mockReturnValue({
  role: 'owner',
  canDeleteHub: true,
  canAddMember: true,
  // ... all permissions true
});

// Test as viewer
useProjectHubPermissions.mockReturnValue({
  role: 'viewer',
  canDeleteHub: false,
  canAddMember: false,
  canViewHub: true,
});
```

## Common Pitfalls

### ❌ Don't mix permission logic with business logic
```jsx
// Bad
if (userRole === 'owner' || userRole === 'admin') {
  // ... business logic
}

// Good
if (canManageMembers(userRole)) {
  // ... business logic
}
```

### ❌ Don't check permissions client-side only
```jsx
// Client-side check
if (permissions.canDeleteHub) {
  await api.deleteHub(hubId); // ⚠️ Backend must also check!
}
```
Backend ALWAYS validates permissions - FE checks are only for UX!

### ❌ Don't hardcode role strings
```jsx
// Bad
if (userRole === 'owner') { }

// Good
import { PROJECT_HUB_ROLES, isOwner } from '@/constants/projectHubRoles';
if (isOwner(userRole)) { }
```

## Summary

**Use the hook when:**
- You need multiple permissions in a component
- You want automatic user role detection
- You prefer cleaner, more readable code

**Use helper functions when:**
- You only need 1-2 permission checks
- You already have the user role
- You're outside React components (utilities, etc.)

**Remember:**
1. ✅ Always hide/show UI based on permissions
2. ✅ Always verify on backend too
3. ✅ Use constants instead of hardcoded strings
4. ✅ Handle edge cases (no project, loading, etc.)
