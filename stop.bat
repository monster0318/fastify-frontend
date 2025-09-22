@echo off
REM Stop all containers script for Windows
echo 🛑 Stopping Capital Marketplace Frontend...
docker-compose -f docker-compose.dev.yml down 2>nul
docker-compose -f docker-compose.prod.yml down 2>nul
echo ✅ All containers stopped!
