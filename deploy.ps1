# Deploy Backend to GitHub
Write-Host "Starting Backend Deployment..." -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
git commit -m "Backend deployment - $timestamp"

$remote = git config --get remote.origin.url 2>$null

if ([string]::IsNullOrEmpty($remote)) {
    Write-Host "No remote repository configured" -ForegroundColor Yellow
    Write-Host "Run: git remote add origin https://github.com/YOUR_USERNAME/ip-geo-api.git" -ForegroundColor Yellow
    exit 0
}

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

Write-Host "Success! Repository: $remote" -ForegroundColor Green
