---
description: Tạo React component mới theo chuẩn dự án
---

# Create New React Component

## Bước 1: Tạo file component
Tạo file component mới trong `client/src/components/[ComponentName].jsx`

Template cơ bản:
```jsx
import React from 'react';

const ComponentName = () => {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

## Bước 2: Tạo styles (nếu cần)
Tạo file CSS hoặc sử dụng inline styles/Tailwind CSS

## Bước 3: Import và sử dụng
Import component vào nơi cần sử dụng:
```jsx
import ComponentName from './components/ComponentName';
```

## Bước 4: Test component
- Test rendering
- Test các props
- Test các interactions

## Bước 5: Document component
Thêm JSDoc comments để document props và usage:
```jsx
/**
 * ComponentName - Mô tả component
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 */
```
