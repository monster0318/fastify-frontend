@echo off
REM Quick production deployment script for Windows
echo 🚀 Starting Capital Marketplace Frontend (Production)...
docker-compose --profile production up --build -d
echo ✅ Production server running at http://localhost
