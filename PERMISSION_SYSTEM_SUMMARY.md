# Project Hub Permission System - Implementation Summary

## 📋 Overview
Đã triển khai hệ thống phân quyền 2 tầng cho Project Hub với 4 vai trò quản trị và phân quyền chi tiết cho tất cả các resources liên quan.

## 🎯 Vai Trò Quản Trị (Permission Roles)

### 1. **OWNER** (Chủ sở hữu)
- Toàn quyền kiểm soát project hub
- Tự động được thêm vào members khi tạo hub
- Không thể bị xóa khỏi members
- Chỉ có 1 owner duy nhất

### 2. **ADMIN** (Quản trị viên)
- Quản lý thành viên (thêm/xóa)
- Quản lý tuyển dụng
- Cập nhật thông tin hub
- Review applications

### 3. **MEMBER** (Thành viên)
- Tạo/sửa milestones, tasks, devlogs
- Đóng góp vào project
- Không thể quản lý members

### 4. **VIEWER** (Người xem)
- Chỉ xem thông tin
- Không chỉnh sửa gì

## 🔑 Ma Trận Quyền Hạn

| Chức năng | Owner | Admin | Member | Viewer |
|-----------|:-----:|:-----:|:------:|:------:|
| Xóa Project Hub | ✅ | ❌ | ❌ | ❌ |
| Cập nhật Hub Info | ✅ | ✅ | ❌ | ❌ |
| Quản lý Members | ✅ | ✅ | ❌ | ❌ |
| Tuyển dụng (CRUD) | ✅ | ✅ | ❌ | ❌ |
| Review Application | ✅ | ✅ | ❌ | ❌ |
| Milestone (CRUD) | ✅ | ✅ | ✅ | ❌ |
| Task (CRUD) | ✅ | ✅ | ✅ | ❌ |
| Devlog (CRUD) | ✅ | ✅ | ✅ | ❌ |
| Xem nội dung | ✅ | ✅ | ✅ | ✅ |

## 📁 Files Đã Tạo/Cập Nhật

### **Created Files**
1. **`server/constants/projectHubRoles.js`**
   - Định nghĩa roles và permissions
   - Helper functions: `hasPermission`, `isOwner`, `isAdminOrOwner`
   - Ma trận quyền hạn chi tiết (18+ permissions)

2. **`server/middlewares/projectHubAuth.js`**
   - Middleware kiểm tra quyền trực tiếp với hubId
   - `checkIsMember`, `checkIsAdminOrOwner`, `checkIsOwner`
   - `checkPermission(permission)` - Factory function

3. **`server/middlewares/resourcePermission.js`**
   - Middleware thông minh: tự động lấy hubId từ resource ID
   - `checkRecruitmentPermission`, `checkMilestonePermission`
   - `checkTaskPermission`, `checkDevlogPermission`
   - `checkCanReviewApplication`

### **Updated Files**

#### **Models**
- **`server/models/ProjectHub.js`**
  ```javascript
  members: [{
    user: ObjectId,
    permissionRole: 'owner' | 'admin' | 'member' | 'viewer',
    jobPosition: String // "Frontend Dev", "Designer", etc.
  }]
  ```

#### **Services**
- **`server/services/projectHubService.js`**
  - ✅ `createProjectHub`: Auto add owner to members
  - ✅ `addMember`: Prevent duplicate owner, check permissions
  - ✅ `removeMember`: Cannot remove owner
  - ✅ `updateMemberRole`: Only owner can change roles
  - ✅ `updateProjectHub`: Only admin/owner can update

#### **Routes** (All updated with permission checks)
- **`server/routes/projectHubRoutes.js`**
  - Update/Delete hub: Permission checks
  - Add/Remove members: Admin/Owner only
  - Update roles: Owner only

- **`server/routes/recruitmentRoutes.js`**
  - Create/Update/Delete: `checkRecruitmentPermission`
  
- **`server/routes/milestoneRoutes.js`**
  - Update/Delete: `checkMilestonePermission`
  
- **`server/routes/taskRoutes.js`**
  - All CRUD operations: `checkTaskPermission`
  
- **`server/routes/devlogRoutes.js`**
  - Update/Delete: `checkDevlogPermission`
  
- **`server/routes/applicationRoutes.js`**
  - Review: `checkCanReviewApplication`

#### **Controllers**
- **`server/controllers/projectHubController.js`**
  - Updated to handle `permissionRole` + `jobPosition`
  - Separate fields instead of single `role`

## 🚀 How It Works

### **1. Creating Project Hub**
```javascript
POST /api/project-hubs
{
  "name": "My Project",
  "ownerJobPosition": "Project Manager", // Optional
  ...
}

// Automatic behavior:
// - Creates project hub
// - Adds owner to members array with permissionRole: 'owner'
```

### **2. Adding Members**
```javascript
POST /api/project-hubs/:hubId/members
Headers: { Authorization: "Bearer <token>" }
Body: {
  "memberId": "userId123",
  "permissionRole": "admin", // owner/admin/member/viewer
  "jobPosition": "Frontend Developer"
}

// Middleware checks:
// - User must be owner or admin
// - Cannot add another owner
// - Cannot add duplicate member
```

### **3. Updating Resources**
```javascript
PUT /api/tasks/:taskId
Headers: { Authorization: "Bearer <token>" }
Body: { ... }

// Automatic flow:
// 1. resourcePermission middleware gets task
// 2. Extracts projectHubId from task
// 3. Checks user's permissionRole in that hub
// 4. Validates UPDATE_TASK permission
// 5. Allows or denies request
```

### **4. Permission Checking Flow**
```
Request → auth middleware → resourcePermission middleware → controller
              ↓                       ↓
          req.user.id         Get hubId from resource
                                      ↓
                              Get user's permissionRole
                                      ↓
                              Check hasPermission(role, action)
                                      ↓
                              ✅ Allow / ❌ Deny
```

## 🔒 Security Features

1. **Owner Protection**
   - Cannot be removed from members
   - Cannot change own role
   - Only one owner per hub

2. **Role Validation**
   - Enum validation in model
   - Cannot assign owner role to others
   - Proper permission checks before all actions

3. **Automatic Permission Inheritance**
   - Owner has all permissions
   - Admin has most permissions
   - Member has content creation permissions
   - Viewer has read-only access

4. **Resource-Level Checks**
   - Middleware automatically resolves hubId
   - No need to manually pass hubId
   - Works with any resource ID

## 📝 API Usage Examples

### **Add Member with Role**
```bash
curl -X POST http://localhost:5000/api/project-hubs/hubId123/members \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "user456",
    "permissionRole": "member",
    "jobPosition": "UI/UX Designer"
  }'
```

### **Update Member Role**
```bash
curl -X PUT http://localhost:5000/api/project-hubs/hubId123/members/user456 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionRole": "admin",
    "jobPosition": "Senior Designer"
  }'
```

### **Update Recruitment** (Auto permission check)
```bash
curl -X PUT http://localhost:5000/api/recruitments/recId789 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'

# Middleware automatically:
# - Gets recruitment's projectHub
# - Checks user's role in that hub
# - Validates UPDATE_RECRUITMENT permission
```

## 🎓 Best Practices

1. **Always use middleware on protected routes**
   - Don't rely only on service-level checks
   - Middleware provides consistent authorization

2. **Use appropriate permission level**
   - Owner-only: Critical operations (delete hub, manage roles)
   - Admin/Owner: Management operations (members, recruitment)
   - Member: Content creation (tasks, devlogs)
   - Viewer: Read-only access

3. **Resource-based middleware for child resources**
   - Use `checkTaskPermission`, `checkMilestonePermission`, etc.
   - They automatically resolve hubId from resource

4. **Direct hub middleware for hub operations**
   - Use `checkIsOwner`, `checkIsAdminOrOwner` from projectHubAuth
   - When hubId is directly in params

## ⚠️ Important Notes

1. **Owner is always in members array**
   - When creating hub, owner auto-added to members
   - Owner cannot be removed
   - Only one owner per hub

2. **JobPosition vs PermissionRole**
   - `jobPosition`: Business role (Frontend Dev, Designer)
   - `permissionRole`: Access control (owner, admin, member, viewer)
   - They are independent and serve different purposes

3. **Middleware order matters**
   ```javascript
   router.put('/:id', 
     auth,                          // 1. Authenticate
     checkTaskPermission('update'), // 2. Check permission
     controller.updateTask          // 3. Execute
   );
   ```

4. **Service layer still needs validation**
   - Middleware is first line of defense
   - Services should still validate ownership
   - Defense in depth approach

## 🧪 Testing Checklist

- [ ] Owner can delete hub
- [ ] Admin cannot delete hub
- [ ] Member cannot add/remove members
- [ ] Viewer cannot create tasks
- [ ] Cannot add second owner
- [ ] Cannot remove owner from members
- [ ] Task update checks hub permissions
- [ ] Recruitment review needs admin/owner
- [ ] Application stats needs permissions
- [ ] Milestone delete needs admin/owner

## 🔄 Migration Notes

If you have existing data:

```javascript
// Run this migration to add owner to members array
db.projecthubs.find({ members: { $size: 0 } }).forEach(hub => {
  db.userprofiles.findOne({ user: hub.owner }, (err, profile) => {
    if (profile) {
      db.projecthubs.updateOne(
        { _id: hub._id },
        { 
          $push: { 
            members: {
              user: profile._id,
              permissionRole: 'owner',
              jobPosition: 'Project Owner'
            }
          }
        }
      );
    }
  });
});
```

---

**Implementation Date:** January 4, 2026  
**Status:** ✅ Complete & Ready for Testing
