#!/bin/bash

# PingUp Kubernetes Deployment Script
# This script builds Docker images and deploys to Kubernetes

set -e  # Exit on error

echo "======================================"
echo "PingUp Kubernetes Deployment"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build Docker Images
echo -e "\n${YELLOW}Step 1: Building Docker Images...${NC}"

echo "Building client image..."
docker build -t pingup-client:latest ./client
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Client image built successfully${NC}"
else
    echo -e "${RED}✗ Failed to build client image${NC}"
    exit 1
fi

echo "Building server image..."
docker build -t pingup-server:latest ./server
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Server image built successfully${NC}"
else
    echo -e "${RED}✗ Failed to build server image${NC}"
    exit 1
fi

# Step 2: Apply Kubernetes Manifests
echo -e "\n${YELLOW}Step 2: Applying Kubernetes Manifests...${NC}"

echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo "Creating ConfigMap..."
kubectl apply -f k8s/configmap.yaml

echo "Creating Secrets..."
kubectl apply -f k8s/secrets.yaml

echo "Deploying MongoDB..."
kubectl apply -f k8s/mongodb-deployment.yaml

echo "Deploying Redis..."
kubectl apply -f k8s/redis-deployment.yaml

echo "Deploying Server..."
kubectl apply -f k8s/server-deployment.yaml

echo "Deploying Client..."
kubectl apply -f k8s/client-deployment.yaml

echo "Creating Ingress..."
kubectl apply -f k8s/ingress.yaml

# Step 3: Wait for Pods to be Ready
echo -e "\n${YELLOW}Step 3: Waiting for Pods to be Ready...${NC}"
echo "This may take a few minutes..."

kubectl wait --for=condition=ready pod -l app=mongodb -n pingup --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n pingup --timeout=300s
kubectl wait --for=condition=ready pod -l app=server -n pingup --timeout=300s
kubectl wait --for=condition=ready pod -l app=client -n pingup --timeout=300s

# Step 4: Display Status
echo -e "\n${GREEN}======================================"
echo "Deployment Complete!"
echo "======================================${NC}"

echo -e "\n${YELLOW}Pod Status:${NC}"
kubectl get pods -n pingup

echo -e "\n${YELLOW}Service Status:${NC}"
kubectl get svc -n pingup

echo -e "\n${YELLOW}Ingress Status:${NC}"
kubectl get ingress -n pingup

echo -e "\n${GREEN}======================================"
echo "Access Instructions:"
echo "======================================${NC}"
echo "1. Port Forward (Recommended):"
echo "   kubectl port-forward -n pingup svc/client 3000:80"
echo "   kubectl port-forward -n pingup svc/server 5000:5000"
echo "   Then open: http://localhost:3000"
echo ""
echo "2. Or install NGINX Ingress Controller and access via http://localhost"
echo ""
echo "To view logs:"
echo "   kubectl logs -n pingup -l app=server -f"
echo "   kubectl logs -n pingup -l app=client -f"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
