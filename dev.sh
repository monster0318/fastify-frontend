#!/bin/bash
# Quick development deployment script
echo "🚀 Starting Capital Marketplace Frontend (Development)..."
docker-compose up --build -d
echo "✅ Development server running at http://localhost:3000"
