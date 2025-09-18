# gRPC Demo Application - Setup Guide

## Prerequisites Checklist

### Required Software
- [ ] Node.js 18+ (verify: `node --version`)
- [ ] npm 9+ (verify: `npm --version`)
- [ ] Docker Desktop (verify: `docker --version`)
- [ ] Docker Compose v2+ (verify: `docker compose version`)
- [ ] Git (verify: `git --version`)

### Optional but Recommended
- [ ] Protocol Buffers Compiler (protoc) for local development
- [ ] VS Code with extensions:
  - [ ] Proto3 Support
  - [ ] Docker
  - [ ] ESLint
  - [ ] Prettier

## Quick Start Setup

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd grpc-demo-app

# Install all dependencies
npm install

# This will install dependencies for all workspaces
```

### 2. Generate Protocol Buffer Code
```bash
# Generate all proto definitions
npm run build:protos

# Or navigate to protos package
cd packages/protos
npm run build
```

### 3. Start Development Environment
```bash
# Start all services with Docker Compose
npm run dev

# Or start services individually:
npm run dev:server  # Start gRPC server only
npm run dev:client  # Start Next.js client only
```

### 4. Verify Installation
```bash
# Check if services are running
docker compose ps

# Test gRPC server health
curl http://localhost:50051/health

# Access Next.js application
open http://localhost:3000

# Access Envoy admin interface
open http://localhost:9901
```

## Manual Setup (Without Docker)

### 1. Install Protocol Buffers Compiler
```bash
# macOS
brew install protobuf protoc-gen-grpc-web

# Linux (Ubuntu/Debian)
apt-get update && apt-get install -y protobuf-compiler
# Download protoc-gen-grpc-web separately

# Windows
# Download from: https://github.com/protocolbuffers/protobuf/releases
```

### 2. Setup gRPC Server
```bash
cd services/demo-server
npm install
npm run dev
```

### 3. Setup Envoy Proxy
```bash
# Using Docker
docker run -d \
  -v "$(pwd)/docker/envoy.yaml":/etc/envoy/envoy.yaml:ro \
  -p 8080:8080 \
  -p 9901:9901 \
  envoyproxy/envoy:v1.27-latest

# Or build from source (advanced)
```

### 4. Setup Next.js Client
```bash
cd client/next-app
npm install
npm run dev
```

## Environment Variables

### gRPC Server (.env)
```env
NODE_ENV=development
GRPC_PORT=50051
LOG_LEVEL=info
ENABLE_REFLECTION=true
MAX_CONNECTION_IDLE_MS=300000
MAX_CONNECTION_AGE_MS=600000
KEEPALIVE_TIME_MS=120000
KEEPALIVE_TIMEOUT_MS=20000
```

### Next.js Client (.env.local)
```env
NEXT_PUBLIC_GRPC_WEB_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENABLE_DEBUG=true
```

## Project Structure Overview

```
grpc-demo-app/
├── packages/
│   └── protos/          # Protocol buffer definitions
├── services/
│   └── demo-server/     # gRPC server implementation
├── client/
│   └── next-app/        # Next.js web application
├── docker/
│   └── envoy.yaml       # Envoy proxy configuration
├── scripts/             # Utility scripts
├── docs/                # Additional documentation
└── docker-compose.yml   # Docker orchestration
```

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start all services
npm run dev

# Build everything
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck

# Clean build artifacts
npm run clean
```

### Proto Generation
```bash
# Generate JavaScript and TypeScript
npm run build:protos

# Generate for gRPC-Web
cd packages/protos
npm run generate:web

# Watch for proto changes
cd packages/protos
npm run watch
```

### Testing
```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Docker Operations
```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild containers
docker compose build

# Remove volumes
docker compose down -v
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :50051  # macOS/Linux
netstat -ano | findstr :50051  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /F /PID <PID>  # Windows
```

#### 2. Proto Generation Fails
```bash
# Ensure protoc is installed
protoc --version

# Clean and regenerate
cd packages/protos
npm run clean
npm run build
```

#### 3. Docker Connection Issues
```bash
# Reset Docker network
docker network prune

# Restart Docker Desktop
# GUI: Quit and restart Docker Desktop

# Check Docker logs
docker compose logs envoy
docker compose logs grpc-server
```

#### 4. CORS Issues in Browser
- Check Envoy configuration allows your origin
- Verify correct headers in envoy.yaml
- Use Chrome with --disable-web-security flag (development only)

#### 5. TypeScript Errors
```bash
# Rebuild TypeScript definitions
npm run build:protos

# Clear TypeScript cache
rm -rf node_modules/.cache
npm run typecheck
```

## Health Checks

### gRPC Server Health
```bash
# Using grpcurl (install: brew install grpcurl)
grpcurl -plaintext localhost:50051 list
grpcurl -plaintext localhost:50051 grpc.health.v1.Health/Check

# Using Node.js health check script
node scripts/health-check.js
```

### Envoy Proxy Health
```bash
# Admin interface
curl http://localhost:9901/clusters
curl http://localhost:9901/stats/prometheus

# Check upstream health
curl http://localhost:9901/clusters | grep health_flags
```

### Next.js Application Health
```bash
# API health endpoint
curl http://localhost:3000/api/health

# Build status
curl http://localhost:3000/api/status
```

## Performance Tuning

### gRPC Server
```javascript
// Optimize connection settings
const server = new grpc.Server({
  'grpc.max_receive_message_length': 4 * 1024 * 1024,
  'grpc.max_send_message_length': 4 * 1024 * 1024,
  'grpc.keepalive_time_ms': 120000,
  'grpc.keepalive_timeout_ms': 20000,
  'grpc.keepalive_permit_without_calls': 1,
  'grpc.http2.min_time_between_pings_ms': 120000,
});
```

### Envoy Proxy
```yaml
# Increase timeout for long-running streams
route:
  timeout: 0s
  idle_timeout: 900s
  max_stream_duration:
    grpc_timeout_header_max: 0s
```

### Next.js Client
```javascript
// Connection pooling
const client = new ServiceClient(url, null, {
  withCredentials: false,
  primary_user_agent: 'grpc-web-javascript/0.1',
  poolSize: 10
});
```

## Security Considerations

### Development
- Uses insecure credentials (no TLS)
- CORS is permissive (allows all origins)
- No authentication required

### Production Checklist
- [ ] Enable TLS/SSL certificates
- [ ] Implement authentication (JWT/OAuth)
- [ ] Configure CORS restrictions
- [ ] Add rate limiting
- [ ] Enable request logging
- [ ] Implement input validation
- [ ] Set up monitoring/alerting
- [ ] Configure firewall rules
- [ ] Use secrets management
- [ ] Enable audit logging

## Next Steps

1. Review the [Implementation Plan](IMPLEMENTATION_PLAN.md)
2. Explore [Architecture Patterns](ARCHITECTURE_PATTERNS.md)
3. Start implementing Milestone 1 tasks
4. Run example requests to verify setup
5. Begin developing your features

## Support and Resources

- [gRPC Documentation](https://grpc.io/docs/)
- [Protocol Buffers Guide](https://developers.google.com/protocol-buffers)
- [Envoy Documentation](https://www.envoyproxy.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project Issues](https://github.com/your-repo/issues)