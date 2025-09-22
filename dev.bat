@echo off
REM Quick development deployment script for Windows
echo 🚀 Starting Capital Marketplace Frontend (Development)...
docker-compose -f docker-compose.dev.yml up --build -d
echo ✅ Development server running at http://localhost:3000
