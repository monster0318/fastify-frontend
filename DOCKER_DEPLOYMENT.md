# Docker Deployment Guide for Capital Marketplace Frontend

This guide will help you deploy your Next.js Capital Marketplace Frontend application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (if cloning from repository)
- Basic knowledge of Docker concepts

## Quick Start

### 1. Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

2. Update the environment variables in `.env.local` with your actual values:
   - API URLs
   - Authentication secrets
   - External service keys
   - Database connections (if applicable)

### 2. Build and Run

#### Option A: Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### Option B: Using Docker directly

```bash
# Build the image
docker build -t capital-marketplace-frontend .

# Run the container
docker run -p 3000:3000 --env-file .env.local capital-marketplace-frontend
```

### 3. Production Deployment with Nginx

For production deployment with nginx reverse proxy:

```bash
# Start with nginx profile
docker-compose --profile production up -d --build
```

This will start:
- Your Next.js application on port 3000 (internal)
- Nginx reverse proxy on ports 80 and 443 (external)

## Configuration

### Environment Variables

Key environment variables you need to configure:

- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `NEXT_PUBLIC_AUTH_URL`: Authentication service URL
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY`: Knock notification service key

### Docker Compose Services

The `docker-compose.yml` includes:

1. **capital-marketplace-frontend**: Your Next.js application
   - Port: 3000
   - Health check endpoint: `/api/health`
   - Auto-restart policy

2. **nginx** (optional, production profile):
   - Reverse proxy with rate limiting
   - Security headers
   - Gzip compression
   - Static file caching

## Health Monitoring

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

## Production Considerations

### Security

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Secrets Management**: Use Docker secrets or external secret management services
3. **HTTPS**: Configure SSL certificates for production
4. **Rate Limiting**: Nginx configuration includes rate limiting for API and auth endpoints

### Performance

1. **Caching**: Static assets are cached for 1 year
2. **Compression**: Gzip compression is enabled
3. **Multi-stage Build**: Dockerfile uses multi-stage build for smaller image size
4. **Standalone Output**: Next.js standalone output reduces dependencies

### Monitoring

1. **Health Checks**: Built-in health check endpoint
2. **Logs**: Use `docker-compose logs` to monitor application logs
3. **Metrics**: Consider adding monitoring tools like Prometheus/Grafana

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Check what's using port 3000
   netstat -tulpn | grep :3000
   
   # Change port in docker-compose.yml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

2. **Build Failures**:
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Environment Variables Not Loading**:
   - Ensure `.env.local` exists and has correct format
   - Check variable names start with `NEXT_PUBLIC_` for client-side access

### Debugging

1. **View Container Logs**:
   ```bash
   docker-compose logs -f capital-marketplace-frontend
   ```

2. **Access Container Shell**:
   ```bash
   docker-compose exec capital-marketplace-frontend sh
   ```

3. **Check Health Status**:
   ```bash
   curl http://localhost:3000/api/health
   ```

## Scaling

### Horizontal Scaling

To run multiple instances:

```yaml
# In docker-compose.yml
services:
  capital-marketplace-frontend:
    deploy:
      replicas: 3
```

### Load Balancing

The nginx configuration can handle multiple backend instances automatically.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          docker-compose pull
          docker-compose up -d --build
```

## Backup and Recovery

1. **Environment Configuration**: Keep `.env.local` backed up securely
2. **Docker Images**: Tag and push images to a registry
3. **Data**: If using volumes, ensure they're backed up

## Support

For issues related to:
- Next.js: Check [Next.js documentation](https://nextjs.org/docs)
- Docker: Check [Docker documentation](https://docs.docker.com/)
- This deployment: Check the project repository issues
