#!/bin/bash
# Deploy Backend Script

echo "🚀 Starting Backend Deployment..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the backend directory."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add files
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Backend deployment - $(date +%Y-%m-%d_%H-%M-%S)"

# Get remote status
REMOTE=$(git config --get remote.origin.url)

if [ -z "$REMOTE" ]; then
    echo "⚠️  No remote repository configured"
    echo "Please add remote with: git remote add origin https://github.com/YOUR_USERNAME/ip-geo-api.git"
    exit 0
fi

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Backend pushed successfully!"
echo "📌 Repository URL: $REMOTE"
echo ""
echo "Next steps:"
echo "1. Go to https://railway.app or https://render.com"
echo "2. Connect your GitHub repository"
echo "3. Configure environment variables"
echo "4. Deploy!"
