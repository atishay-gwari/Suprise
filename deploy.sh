#!/bin/bash

# Leps' Valentine Game - DigitalOcean Deployment Script
# Run this on your Droplet after uploading the files

echo "🏰 Deploying Leps' Chronicles of WonderCore..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo apt install docker-compose -y
fi

# Build and run
echo "🚀 Building and starting the game..."
sudo docker-compose up -d --build

echo ""
echo "✅ Deployment complete!"
echo "🎮 Your game is now live at: http://$(curl -s ifconfig.me)"
echo ""
echo "💕 Share this link with Leps!"
