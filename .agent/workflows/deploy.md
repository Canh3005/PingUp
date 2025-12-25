---
description: Deploy ứng dụng lên production
---

# Deploy Application to Production

## Bước 1: Kiểm tra branch
Đảm bảo bạn đang ở branch main/master:
```bash
git branch
```

## Bước 2: Pull latest changes
```bash
git pull origin main
```

## Bước 3: Install dependencies
// turbo
```bash
cd client && npm install && cd ../server && npm install
```

## Bước 4: Run tests
Chạy tests để đảm bảo không có lỗi:
```bash
cd server && npm test
cd ../client && npm test
```

## Bước 5: Build client
Build React app cho production:
```bash
cd client && npm run build
```

## Bước 6: Deploy
Deploy lên server (tùy theo setup của bạn):
```bash
# Ví dụ: deploy lên Heroku
git push heroku main

# Hoặc deploy lên VPS
npm run deploy:prod
```

## Bước 7: Verify deployment
- Truy cập production URL
- Kiểm tra các chức năng chính
- Xem logs để đảm bảo không có errors
