# 🎯 Hướng Dẫn Customization - Antigravity AI

Tài liệu này giải thích cách sử dụng các tính năng customization của Antigravity AI để tùy chỉnh cách AI làm việc với dự án của bạn.

---

## 📋 Mục Lục

1. [Rules (Quy Tắc)](#rules-quy-tắc)
2. [Workflows (Quy Trình)](#workflows-quy-trình)
3. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)

---

## 🔧 Rules (Quy Tắc)

### Rules là gì?

**Rules** cho phép bạn định nghĩa các quy tắc tùy chỉnh mà AI sẽ tuân theo khi làm việc với dự án của bạn. Điều này giúp AI hiểu rõ hơn về:
- Coding standards của team
- Cấu trúc dự án
- Best practices riêng
- Các quy ước đặt tên
- Và nhiều hơn nữa...

### Cách Tạo Rules

Tạo file `.agent/rules.md` trong thư mục gốc của dự án:

```markdown
# My Project Rules

## Code Style
- Always use functional components in React
- Use arrow functions for all function declarations
- Prefer const over let, never use var

## File Organization
- Components should be in src/components
- Each component should have its own folder
- Test files should be named *.test.js

## API Conventions
- All API endpoints should start with /api
- Use RESTful naming conventions
- Always include error handling

## Database
- Use camelCase for field names
- Always include createdAt and updatedAt timestamps
- Soft delete instead of hard delete
```

### Khi Nào Rules Được Áp Dụng?

AI sẽ **tự động đọc và tuân theo** các rules khi:
- Tạo file mới
- Chỉnh sửa code
- Đề xuất giải pháp
- Review code
- Refactoring

---

## ⚙️ Workflows (Quy Trình)

### Workflows là gì?

**Workflows** là các quy trình làm việc được định nghĩa sẵn cho các tác vụ lặp đi lặp lại. Thay vì phải giải thích từng bước mỗi lần, bạn có thể tạo workflow một lần và sử dụng lại.

### Cấu Trúc Workflow

Workflows được lưu trong `.agent/workflows/` với format:

```markdown
---
description: Mô tả ngắn gọn về workflow
---

[Các bước chi tiết để thực hiện workflow]
```

### Cách Tạo Workflow

**Ví dụ 1: Deploy Application**

File: `.agent/workflows/deploy.md`

```markdown
---
description: Deploy ứng dụng lên production
---

# Deploy Application to Production

## Bước 1: Kiểm tra tests
Chạy tất cả tests để đảm bảo không có lỗi:
```bash
npm test
```

## Bước 2: Build production
Build ứng dụng cho production:
```bash
npm run build
```

## Bước 3: Deploy lên server
Deploy code lên server production:
```bash
npm run deploy:prod
```

## Bước 4: Verify deployment
Kiểm tra xem deployment có thành công không:
- Truy cập https://yourapp.com
- Kiểm tra health check endpoint
- Xem logs để đảm bảo không có errors
```

**Ví dụ 2: Create New Component**

File: `.agent/workflows/new-component.md`

```markdown
---
description: Tạo React component mới theo chuẩn của dự án
---

# Create New React Component

## Bước 1: Tạo thư mục component
Tạo thư mục mới trong `src/components/[component-name]`

## Bước 2: Tạo file component
Tạo file `[ComponentName].jsx` với template:
- Import React và các dependencies cần thiết
- Sử dụng functional component
- Export default component

## Bước 3: Tạo file styles
Tạo file `[ComponentName].module.css` cho styles

## Bước 4: Tạo file test
Tạo file `[ComponentName].test.jsx` với:
- Import component
- Viết ít nhất 1 test case cơ bản
- Test rendering

## Bước 5: Tạo index.js
Tạo file `index.js` để export component

## Bước 6: Update documentation
Thêm component vào file COMPONENTS.md
```

### Cách Sử Dụng Workflow

Có 3 cách để sử dụng workflow:

#### 1. Slash Command (Khuyên dùng)
```
/deploy
/new-component
/run-tests
```

#### 2. Yêu cầu trực tiếp
```
"Hãy chạy workflow deploy"
"Tạo component mới theo workflow"
```

#### 3. AI tự động gợi ý
AI sẽ tự động đề xuất workflow phù hợp khi bạn yêu cầu các tác vụ tương tự.

### Turbo Mode

Bạn có thể thêm annotations để AI tự động chạy commands mà không cần xác nhận:

**Turbo cho 1 bước:**
```markdown
## Bước 2: Install dependencies
// turbo
npm install
```

**Turbo cho tất cả các bước:**
```markdown
---
description: Auto-run all commands
---
// turbo-all

## Bước 1: Build
npm run build

## Bước 2: Test
npm test
```

---

## 💡 Ví Dụ Thực Tế

### Ví Dụ 1: Rules cho React + Node.js Project

File: `.agent/rules.md`

```markdown
# PingUp Project Rules

## React Frontend Rules

### Component Structure
- Use functional components with hooks
- One component per file
- Component files use PascalCase: `UserProfile.jsx`
- Use CSS modules for styling

### State Management
- Use React hooks (useState, useEffect, etc.)
- For global state, use Context API
- Avoid prop drilling - use context when needed

### API Calls
- All API calls should be in separate service files
- Use async/await syntax
- Always handle errors with try/catch
- Show loading states during API calls

## Backend Rules

### API Structure
- RESTful endpoints: GET, POST, PUT, DELETE
- All endpoints start with `/api/v1/`
- Use middleware for authentication
- Always validate input data

### Database
- Use Mongoose for MongoDB
- Define schemas in separate files
- Use virtual fields for computed properties
- Always use timestamps

### Error Handling
- Use centralized error handling middleware
- Return consistent error format:
  ```json
  {
    "success": false,
    "error": "Error message",
    "code": "ERROR_CODE"
  }
  ```

## Testing
- Write tests for all API endpoints
- Test components with React Testing Library
- Aim for >80% code coverage
```

### Ví Dụ 2: Workflow cho Bug Fix

File: `.agent/workflows/fix-bug.md`

```markdown
---
description: Quy trình sửa bug chuẩn
---

# Bug Fix Workflow

## Bước 1: Reproduce bug
- Tìm hiểu cách reproduce bug
- Ghi lại các bước để tái hiện
- Xác định môi trường xảy ra bug (dev/staging/prod)

## Bước 2: Tìm root cause
- Debug code để tìm nguyên nhân gốc rễ
- Kiểm tra logs
- Xem lại code liên quan

## Bước 3: Viết test case
Trước khi fix, viết test case để verify bug:
```javascript
test('should handle edge case correctly', () => {
  // Test case that reproduces the bug
});
```

## Bước 4: Fix bug
- Implement fix
- Đảm bảo test case pass
- Kiểm tra không làm break existing functionality

## Bước 5: Test thoroughly
// turbo
npm test

## Bước 6: Commit changes
Commit với message format:
```
fix: [brief description]

- Detailed explanation
- Root cause
- Solution

Fixes #[issue-number]
```

## Bước 7: Create PR
- Tạo Pull Request
- Link đến issue
- Mô tả fix và testing đã làm
```

### Ví Dụ 3: Workflow cho Feature Development

File: `.agent/workflows/new-feature.md`

```markdown
---
description: Phát triển feature mới
---

# New Feature Development Workflow

## Bước 1: Planning
- Tạo file design doc trong `.agent/docs/features/`
- Outline requirements
- Design API endpoints (nếu cần)
- Design database schema (nếu cần)

## Bước 2: Create branch
```bash
git checkout -b feature/[feature-name]
```

## Bước 3: Backend Development (nếu cần)
- Tạo models
- Tạo controllers
- Tạo routes
- Viết tests cho API

## Bước 4: Frontend Development
- Tạo components
- Implement UI
- Connect với API
- Add error handling

## Bước 5: Testing
// turbo-all
```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test
```

## Bước 6: Manual Testing
- Test trên local environment
- Test các edge cases
- Test responsive design
- Test trên các browsers khác nhau

## Bước 7: Documentation
- Update README.md nếu cần
- Update API documentation
- Add comments cho complex logic

## Bước 8: Code Review
- Tạo Pull Request
- Request review từ team members
- Address feedback
```

---

## 🚀 Tips & Best Practices

### Rules Tips
1. **Cụ thể và rõ ràng**: Viết rules càng chi tiết càng tốt
2. **Cập nhật thường xuyên**: Update rules khi team thay đổi conventions
3. **Chia theo sections**: Organize rules theo modules/features
4. **Include examples**: Đưa ví dụ code để minh họa

### Workflows Tips
1. **Một workflow một mục đích**: Mỗi workflow nên focus vào 1 task cụ thể
2. **Descriptive names**: Đặt tên file workflow rõ ràng (deploy.md, test.md)
3. **Step by step**: Chia nhỏ thành các bước dễ follow
4. **Use turbo wisely**: Chỉ dùng turbo cho commands an toàn
5. **Include verification**: Thêm bước verify kết quả

### Khi Nào Nên Dùng?

**Dùng Rules khi:**
- Bạn muốn AI follow coding standards của team
- Có conventions riêng về naming, structure
- Muốn enforce best practices

**Dùng Workflows khi:**
- Có quy trình lặp đi lặp lại
- Muốn standardize cách làm việc
- Cần document các processes
- Muốn save time cho repetitive tasks

---

## 📚 Tài Nguyên Thêm

### Cấu Trúc Thư Mục Đề Xuất

```
your-project/
├── .agent/
│   ├── rules.md              # Project rules
│   ├── workflows/
│   │   ├── deploy.md
│   │   ├── new-component.md
│   │   ├── fix-bug.md
│   │   └── run-tests.md
│   └── docs/                 # Optional: Additional docs
│       └── features/
└── ...
```

### Template Rules File

```markdown
# [Project Name] Rules

## General Principles
- [Your principles]

## Code Style
- [Your style guides]

## Architecture
- [Your architecture decisions]

## Testing
- [Your testing requirements]

## Documentation
- [Your documentation standards]
```

### Template Workflow File

```markdown
---
description: [Short description of what this workflow does]
---

# [Workflow Name]

## Bước 1: [Step name]
[Detailed instructions]

## Bước 2: [Step name]
[Detailed instructions]

## Bước 3: [Step name]
// turbo (optional - for safe auto-run commands)
[Commands to run]
```

---

## ❓ FAQ

**Q: AI có luôn follow rules không?**
A: Có, AI sẽ đọc và tuân theo rules trong `.agent/rules.md` khi làm việc với dự án.

**Q: Tôi có thể có nhiều workflow files không?**
A: Có, bạn có thể tạo bao nhiêu workflow files tùy thích trong `.agent/workflows/`.

**Q: Turbo mode có an toàn không?**
A: Chỉ dùng turbo cho commands an toàn (read-only, tests). Tránh dùng cho commands có thể delete/modify data.

**Q: Tôi có thể update rules/workflows không?**
A: Có, bạn có thể edit bất cứ lúc nào. AI sẽ đọc version mới nhất.

**Q: Rules có override được system instructions không?**
A: Rules bổ sung thêm cho system instructions, không override. Nếu conflict, AI sẽ ưu tiên system instructions.

---

## 🎉 Kết Luận

Customization features (Rules & Workflows) giúp bạn:
- ✅ Tăng productivity
- ✅ Standardize processes
- ✅ Maintain consistency
- ✅ Save time on repetitive tasks
- ✅ Better collaboration với AI

Hãy bắt đầu với một vài rules và workflows đơn giản, sau đó mở rộng dần theo nhu cầu của dự án!
