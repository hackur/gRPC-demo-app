# gRPC Demo Application - Documentation Index

## 📚 Documentation Hub

Welcome to the comprehensive documentation for the gRPC Demo Application. This index provides quick access to all documentation resources.

## 🚀 Quick Links

- [Main README](../README.md) - Project overview and quick start guide
- [Development Script](../dev.sh) - Automated development environment management

## 📖 Core Documentation

### Architecture & Design
- [Architecture Patterns](../ARCHITECTURE_PATTERNS.md) - gRPC patterns and implementation details
- [SPA Architecture](SPA_ARCHITECTURE.md) - Single-page application structure
- [Design System](DESIGN_SYSTEM.md) - UI/UX design guidelines and components
- [Theming System](THEMING_SYSTEM.md) - Theme implementation and customization

### Implementation Guides
- [Master Implementation Plan](../MASTER_IMPLEMENTATION_PLAN.md) - Complete roadmap and milestones
- [Implementation Plan](../IMPLEMENTATION_PLAN.md) - Detailed implementation steps
- [Development Checklist](../DEVELOPMENT_CHECKLIST.md) - Task tracking and progress
- [Setup Guide](../SETUP_GUIDE.md) - Environment setup and configuration

### TypeScript & gRPC
- [TypeScript Types Implementation](../services/grpc-server/TYPESCRIPT_TYPES_IMPLEMENTATION.md) - Type-safe gRPC implementation

### Demo Applications
- [All Demos Summary](demos/ALL_DEMOS_SUMMARY.md) - Overview of all demo applications
- [IoT Device Manager](demos/IOT_DEVICE_MANAGER.md) - IoT telemetry and control demo

## 🏗️ Project Structure

```
grpc-demo-app/
├── README.md                    # Main project documentation
├── dev.sh                       # Development environment manager
├── docs/                        # Documentation directory
│   ├── INDEX.md                # This file
│   ├── SPA_ARCHITECTURE.md     # Frontend architecture
│   ├── DESIGN_SYSTEM.md        # UI design system
│   ├── THEMING_SYSTEM.md       # Theme configuration
│   └── demos/                  # Demo app documentation
├── services/                    # Backend services
│   └── grpc-server/            # gRPC server implementation
├── client/                      # Frontend applications
│   └── next-app/               # Next.js web application
├── packages/                    # Shared packages
│   └── protos/                 # Protocol buffer definitions
├── docker/                      # Docker configurations
│   └── envoy.yaml             # Envoy proxy config
└── screenshots/                 # Application screenshots
```

## 🛠️ Development Workflow

### 1. Initial Setup
```bash
# Clone repository and install dependencies
./dev.sh setup
```

### 2. Start Development Environment
```bash
# Start all services (gRPC, Envoy, Next.js)
./dev.sh start
```

### 3. Access Application
- **Dashboard**: http://localhost:3000/dashboard
- **gRPC Server**: http://localhost:50051
- **Envoy Proxy**: http://localhost:8080
- **Envoy Admin**: http://localhost:9901

### 4. Development Commands
```bash
./dev.sh status  # Check service status
./dev.sh logs    # View service logs
./dev.sh restart # Restart all services
./dev.sh stop    # Stop all services
```

## 📊 Features & Demos

### Available Demonstrations
1. **IoT Device Manager** - Real-time telemetry streaming
2. **Trading Dashboard** - Live market data updates
3. **Chat Application** - Bidirectional messaging
4. **File Manager** - Upload/download with progress
5. **Analytics Dashboard** - Business metrics with caching

### gRPC Patterns Implemented
- ✅ Unary RPC
- ✅ Server Streaming
- ✅ Client Streaming
- ✅ Bidirectional Streaming

### UI Features
- 🎨 12 Theme Variations (6 colors × 2 modes)
- 📱 Fully Responsive Design
- 🌊 Real-time Data Visualization
- 🎭 Glass-morphic UI Components

## 🧪 Testing

### Run Tests
```bash
# Run all tests
./dev.sh test

# Run Playwright tests
cd client/next-app
npm run test:e2e
```

### Test Coverage
- Unit tests for services
- E2E tests with Playwright
- TypeScript type checking
- Linting and formatting

## 📦 Deployment

### Production Build
```bash
# Build all services
npm run build

# Build specific service
cd services/grpc-server && npm run build
cd client/next-app && npm run build
```

### Docker Deployment
```bash
# Build Docker images
docker-compose build

# Run with Docker Compose
docker-compose up
```

## 🔗 External Resources

### Documentation
- [gRPC Official Docs](https://grpc.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Envoy Proxy Docs](https://www.envoyproxy.io/docs/envoy/latest/)

### Tools & Libraries
- [gRPC-Web](https://github.com/grpc/grpc-web)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Please refer to the main [README.md](../README.md) for contribution guidelines and code of conduct.

## 📄 License

This project is part of the gRPC Demo Application showcase.

---

*Last Updated: November 2024*
*Documentation Version: 1.0.0*