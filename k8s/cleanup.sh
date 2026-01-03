#!/bin/bash

# PingUp Kubernetes Cleanup Script
# This script removes all Kubernetes resources

set -e

echo "======================================"
echo "PingUp Kubernetes Cleanup"
echo "======================================"

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}Warning: This will delete all PingUp resources from Kubernetes${NC}"
read -p "Are you sure? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "\n${RED}Deleting all resources in pingup namespace...${NC}"
    
    # Delete all resources in namespace
    kubectl delete all --all -n pingup
    
    # Delete ConfigMaps and Secrets
    kubectl delete configmap --all -n pingup
    kubectl delete secret --all -n pingup
    
    # Delete PersistentVolumeClaims
    kubectl delete pvc --all -n pingup
    
    # Delete Ingress
    kubectl delete ingress --all -n pingup
    
    # Delete namespace
    kubectl delete namespace pingup
    
    echo -e "\n${GREEN}Cleanup complete!${NC}"
    echo "All PingUp resources have been removed from Kubernetes."
else
    echo -e "\n${YELLOW}Cleanup cancelled.${NC}"
fi
