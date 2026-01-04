# Project Hub Permission System

## Tổng Quan

Hệ thống phân quyền 2 tầng cho Project Hub:

### 1. Permission Roles (Kiểm soát quyền)
- **Owner**: Toàn quyền, có thể xóa hub, thay đổi owner
- **Admin**: Quản lý thành viên, recruitment, và content
- **Member**: Tạo và chỉnh sửa milestones, tasks, devlogs
- **Viewer**: Chỉ xem

### 2. Job Positions (Nghiệp vụ)
- Frontend Developer
- Backend Developer
- Designer
- Product Manager
- ...tùy chỉnh

## Cách Dùng

### Cách 1: Custom Hook (Khuyên dùng)

```jsx
import useProjectHubPermissions from '@/hooks/useProjectHubPermissions';

function MyComponent({ project }) {
  const { canAddMember, canDeleteHub, role } = useProjectHubPermissions(project);
  
  return (
    <div>
      <p>Your role: {role}</p>
      {canAddMember && <button>Add Member</button>}
      {canDeleteHub && <button>Delete Hub</button>}
    </div>
  );
}
```

### Cách 2: Helper Functions

```jsx
import { canAddMember, isOwner } from '@/constants/projectHubRoles';

function MyComponent({ userRole }) {
  return (
    <div>
      {canAddMember(userRole) && <button>Add Member</button>}
      {isOwner(userRole) && <button>Delete Hub</button>}
    </div>
  );
}
```

## Ma Trận Quyền

| Chức năng | Owner | Admin | Member | Viewer |
|-----------|-------|-------|--------|--------|
| Xóa Hub | ✅ | ❌ | ❌ | ❌ |
| Quản lý thành viên | ✅ | ✅ | ❌ | ❌ |
| Thay đổi role | ✅ | ❌ | ❌ | ❌ |
| Quản lý recruitment | ✅ | ✅ | ❌ | ❌ |
| Tạo/Sửa milestone | ✅ | ✅ | ✅ | ❌ |
| Xóa milestone | ✅ | ✅ | ❌ | ❌ |
| Tạo/Sửa task | ✅ | ✅ | ✅ | ❌ |
| Xóa task | ✅ | ✅ | ❌ | ❌ |
| Tạo/Sửa devlog | ✅ | ✅ | ✅ | ❌ |
| Xóa devlog | ✅ | ✅ | ❌ | ❌ |
| Xem hub | ✅ | ✅ | ✅ | ✅ |

## Các Permissions Có Sẵn

```javascript
const permissions = useProjectHubPermissions(project);

// Thông tin role
permissions.role              // 'owner' | 'admin' | 'member' | 'viewer'
permissions.userId            // ID của user hiện tại

// Kiểm tra role
permissions.isOwner           // true/false
permissions.isAdmin           // true/false  
permissions.isAdminOrOwner    // true/false
permissions.isMemberOrAbove   // true/false

// Hub management
permissions.canDeleteHub
permissions.canUpdateHubInfo
permissions.canUpdateHubSettings

// Member management
permissions.canAddMember
permissions.canRemoveMember
permissions.canUpdateMemberRole
permissions.canManageMembers

// Recruitment
permissions.canCreateRecruitment
permissions.canUpdateRecruitment
permissions.canDeleteRecruitment
permissions.canReviewApplication
permissions.canManageRecruitment

// Content (Milestones, Tasks, Devlogs)
permissions.canCreateMilestone
permissions.canUpdateMilestone
permissions.canDeleteMilestone
permissions.canCreateTask
permissions.canUpdateTask
permissions.canDeleteTask
permissions.canCreateDevlog
permissions.canUpdateDevlog
permissions.canDeleteDevlog

// View
permissions.canViewHub

// Generic checker
permissions.hasPermission('any_permission')
```

## Files

```
client/src/
├── constants/
│   └── projectHubRoles.js          # Role definitions & helper functions
├── hooks/
│   └── useProjectHubPermissions.js # Custom hook
├── docs/
│   └── PERMISSION_SYSTEM_GUIDE.md  # Full documentation
├── components/project-hub/
│   └── examples/                    # Example components
│       ├── ProjectHubHeader.example.jsx
│       ├── RecruitmentActions.example.jsx
│       └── ContentActions.example.jsx
└── permissions.js                   # Main export file
```

## Best Practices

### ✅ DO

```jsx
// Ẩn UI elements dựa trên permission
{canAddMember && <button>Add Member</button>}

// Dùng constants thay vì hardcode
import { PROJECT_HUB_ROLES } from '@/constants/projectHubRoles';
if (role === PROJECT_HUB_ROLES.OWNER) { }

// Kiểm tra permission trước khi thực hiện action
if (!canDeleteHub) {
  toast.error('No permission');
  return;
}
```

### ❌ DON'T

```jsx
// ❌ Không hardcode role strings
if (role === 'owner') { }

// ❌ Không show disabled buttons
<button disabled={!canDelete}>Delete</button>

// ❌ Không chỉ check ở FE (backend phải validate!)
// FE check là cho UX, BE check là cho security
```

## Examples

Xem các file trong `client/src/components/project-hub/examples/` để học cách implement.

## Documentation

Đọc `client/src/docs/PERMISSION_SYSTEM_GUIDE.md` để xem:
- Hướng dẫn chi tiết
- Use cases thực tế
- Testing guide
- Common pitfalls

## Summary

1. **Dùng `useProjectHubPermissions` hook** cho components
2. **Dùng helper functions** cho utilities
3. **Luôn ẩn/hiện UI** dựa trên permissions
4. **Backend luôn validate** - FE check chỉ để improve UX
5. **Dùng constants** thay vì hardcode strings
