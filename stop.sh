#!/bin/bash
# Stop all containers script
echo "🛑 Stopping Capital Marketplace Frontend..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
echo "✅ All containers stopped!"
