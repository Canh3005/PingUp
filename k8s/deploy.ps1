# PingUp Kubernetes Deployment - PowerShell Script
# For Windows users

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "PingUp Kubernetes Deployment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Step 1: Build Docker Images
Write-Host "`nStep 1: Building Docker Images..." -ForegroundColor Yellow

Write-Host "Building client image..."
docker build -t pingup-client:latest ./client
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Client image built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to build client image" -ForegroundColor Red
    exit 1
}

Write-Host "Building server image..."
docker build -t pingup-server:latest ./server
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Server image built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to build server image" -ForegroundColor Red
    exit 1
}

# Step 2: Apply Kubernetes Manifests
Write-Host "`nStep 2: Applying Kubernetes Manifests..." -ForegroundColor Yellow

Write-Host "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

Write-Host "Creating ConfigMap..."
kubectl apply -f k8s/configmap.yaml

Write-Host "Creating Secrets..."
kubectl apply -f k8s/secrets.yaml

Write-Host "Deploying MongoDB..."
kubectl apply -f k8s/mongodb-deployment.yaml

Write-Host "Deploying Redis..."
kubectl apply -f k8s/redis-deployment.yaml

Write-Host "Deploying Server..."
kubectl apply -f k8s/server-deployment.yaml

Write-Host "Deploying Client..."
kubectl apply -f k8s/client-deployment.yaml

Write-Host "Creating Ingress..."
kubectl apply -f k8s/ingress.yaml

# Step 3: Wait for Pods
Write-Host "`nStep 3: Waiting for Pods to be Ready..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..."

kubectl wait --for=condition=ready pod -l app=mongodb -n pingup --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n pingup --timeout=300s
kubectl wait --for=condition=ready pod -l app=server -n pingup --timeout=300s
kubectl wait --for=condition=ready pod -l app=client -n pingup --timeout=300s

# Step 4: Display Status
Write-Host "`n======================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

Write-Host "`nPod Status:" -ForegroundColor Yellow
kubectl get pods -n pingup

Write-Host "`nService Status:" -ForegroundColor Yellow
kubectl get svc -n pingup

Write-Host "`nIngress Status:" -ForegroundColor Yellow
kubectl get ingress -n pingup

Write-Host "`n======================================" -ForegroundColor Green
Write-Host "Access Instructions:" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "1. Port Forward (Recommended):"
Write-Host "   kubectl port-forward -n pingup svc/client 3000:80"
Write-Host "   kubectl port-forward -n pingup svc/server 5000:5000"
Write-Host "   Then open: http://localhost:3000"
Write-Host ""
Write-Host "2. Or install NGINX Ingress Controller and access via http://localhost"
Write-Host ""
Write-Host "To view logs:"
Write-Host "   kubectl logs -n pingup -l app=server -f"
Write-Host "   kubectl logs -n pingup -l app=client -f"
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
