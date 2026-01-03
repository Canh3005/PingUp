# PingUp Kubernetes Cleanup - PowerShell Script

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "PingUp Kubernetes Cleanup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "`nWarning: This will delete all PingUp resources from Kubernetes" -ForegroundColor Yellow
$confirmation = Read-Host "Are you sure? (y/N)"

if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    Write-Host "`nDeleting all resources in pingup namespace..." -ForegroundColor Red
    
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
    
    Write-Host "`nCleanup complete!" -ForegroundColor Green
    Write-Host "All PingUp resources have been removed from Kubernetes."
} else {
    Write-Host "`nCleanup cancelled." -ForegroundColor Yellow
}
