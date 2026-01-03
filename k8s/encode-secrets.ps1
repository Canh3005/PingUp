# Secret Encoder Helper - PowerShell
# This script helps encode your secrets to base64 for Kubernetes

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Kubernetes Secret Encoder" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "`nThis script will help you encode your secrets to base64 for Kubernetes.`n"

# Function to encode to base64
function Encode-Base64 {
    param([string]$text)
    return [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($text))
}

# Get secrets from user
Write-Host "Enter your secrets (press Enter to skip):`n" -ForegroundColor Yellow

$jwtSecret = Read-Host "JWT_SECRET"
$cloudinaryName = Read-Host "CLOUDINARY_CLOUD_NAME"
$cloudinaryApiKey = Read-Host "CLOUDINARY_API_KEY"
$cloudinaryApiSecret = Read-Host "CLOUDINARY_API_SECRET"

# Encode secrets
Write-Host "`n======================================" -ForegroundColor Green
Write-Host "Base64 Encoded Values:" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

if ($jwtSecret) {
    $encoded = Encode-Base64 $jwtSecret
    Write-Host "`nJWT_SECRET: $encoded" -ForegroundColor Cyan
}

if ($cloudinaryName) {
    $encoded = Encode-Base64 $cloudinaryName
    Write-Host "CLOUDINARY_CLOUD_NAME: $encoded" -ForegroundColor Cyan
}

if ($cloudinaryApiKey) {
    $encoded = Encode-Base64 $cloudinaryApiKey
    Write-Host "CLOUDINARY_API_KEY: $encoded" -ForegroundColor Cyan
}

if ($cloudinaryApiSecret) {
    $encoded = Encode-Base64 $cloudinaryApiSecret
    Write-Host "CLOUDINARY_API_SECRET: $encoded" -ForegroundColor Cyan
}

Write-Host "`n======================================" -ForegroundColor Yellow
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow
Write-Host "1. Copy the encoded values above"
Write-Host "2. Open k8s/secrets.yaml"
Write-Host "3. Replace the placeholder values with your encoded values"
Write-Host "4. Save the file"
Write-Host "5. Run: .\k8s\deploy.ps1"
Write-Host ""
