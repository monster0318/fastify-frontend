#!/bin/bash
# Quick production deployment script
echo "🚀 Starting Capital Marketplace Frontend (Production)..."
docker-compose -f docker-compose.prod.yml up --build -d
echo "✅ Production server running at http://localhost"
