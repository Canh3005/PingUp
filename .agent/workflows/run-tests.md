---
description: Chạy tất cả tests cho dự án
---

# Run All Tests

## Bước 1: Run server tests
// turbo
```bash
cd server && npm test
```

## Bước 2: Run client tests
// turbo
```bash
cd client && npm test
```

## Bước 3: Check test coverage (optional)
```bash
cd server && npm run test:coverage
cd ../client && npm run test:coverage
```

## Bước 4: Review results
- Kiểm tra tất cả tests đã pass
- Xem coverage report
- Fix các tests fail (nếu có)
