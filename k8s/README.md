# Kubernetes Quick Start - PingUp

## 📋 Prerequisites

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- ✅ **Docker Desktop** (bao gồm Kubernetes)
- ✅ **kubectl** (đi kèm với Docker Desktop)
- ✅ **Git Bash** hoặc **PowerShell**

## 🚀 Quick Start (3 bước)

### Bước 1: Chuẩn bị Secrets

Mở file `k8s/secrets.yaml` và thay thế các giá trị base64:

```powershell
# PowerShell - Encode secrets
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your-jwt-secret"))
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your-cloudinary-name"))
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your-cloudinary-api-key"))
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your-cloudinary-api-secret"))
```

### Bước 2: Deploy

**Windows PowerShell:**
```powershell
cd d:\Ping
.\k8s\deploy.ps1
```

**Git Bash:**
```bash
cd /d/Ping
bash k8s/deploy.sh
```

### Bước 3: Access Application

```bash
# Port forward để access ứng dụng
kubectl port-forward -n pingup svc/client 3000:80
kubectl port-forward -n pingup svc/server 5000:5000

# Mở browser: http://localhost:3000
```

## 📚 Tài liệu chi tiết

Xem hướng dẫn đầy đủ tại: [KUBERNETES_GUIDE.md](./KUBERNETES_GUIDE.md)

## 🛠️ Useful Commands

```bash
# Xem pods
kubectl get pods -n pingup

# Xem logs
kubectl logs -n pingup -l app=server -f

# Xem services
kubectl get svc -n pingup

# Cleanup (xóa tất cả)
.\k8s\cleanup.ps1  # Windows
bash k8s/cleanup.sh  # Git Bash
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Kubernetes Cluster          │
│                                     │
│  ┌──────────┐      ┌──────────┐   │
│  │  Client  │      │  Server  │   │
│  │ (React)  │      │ (Node.js)│   │
│  │ x2 pods  │      │ x2 pods  │   │
│  └──────────┘      └──────────┘   │
│                                     │
│  ┌──────────┐      ┌──────────┐   │
│  │ MongoDB  │      │  Redis   │   │
│  │   x1     │      │   x1     │   │
│  └──────────┘      └──────────┘   │
└─────────────────────────────────────┘
```

## ❓ Troubleshooting

**Pods không start:**
```bash
kubectl describe pod -n pingup <pod-name>
```

**Xem logs lỗi:**
```bash
kubectl logs -n pingup <pod-name>
```

**Restart deployment:**
```bash
kubectl rollout restart deployment -n pingup server
```

---

**Happy Learning Kubernetes! 🎉**
