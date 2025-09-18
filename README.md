# gRPC Demo Application

A comprehensive demonstration of gRPC patterns with a modern Next.js web interface featuring 8 real-world use cases.

## 🚀 Quick Start

```bash
# One command to rule them all
./dev.sh setup && ./dev.sh start

# Open in browser
open http://localhost:3000/dashboard
```

## ✨ Features

- **8 Demo Applications** showcasing all gRPC patterns
- **Real-time Streaming** with automatic reconnection
- **Modern UI** with glass-morphic widgets
- **6 Color Themes** with dark/light modes
- **TypeScript** throughout
- **Docker** ready

## 📦 What's Included

### Demo Applications
1. **IoT Device Manager** - Server streaming telemetry
2. **Trading Dashboard** - Real-time market data
3. **Chat Application** - Bidirectional messaging
4. **File Manager** - Upload/download with progress
5. **Analytics Dashboard** - Unary calls with caching
6. **Video Processor** - Client streaming
7. **Game Lobby** - Low-latency bidirectional
8. **Code Editor** - Collaborative editing

### Technical Stack
- **Backend**: Node.js, gRPC, TypeScript
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **UI**: Framer Motion, Recharts, Glass-morphic design
- **Infrastructure**: Docker, Envoy Proxy
- **State**: Zustand, React Context

## 🛠️ Development

The `dev.sh` script manages everything:

```bash
./dev.sh help      # Show all commands
./dev.sh setup     # Initial setup
./dev.sh start     # Start all services
./dev.sh stop      # Stop services
./dev.sh status    # Check status
./dev.sh logs      # View logs
./dev.sh restart   # Restart services
```

## 📐 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   Envoy Proxy   │────▶│   gRPC Server   │
│   (Port 3000)   │     │   (Port 8080)   │     │   (Port 50051)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 📚 Documentation

- [Master Implementation Plan](MASTER_IMPLEMENTATION_PLAN.md)
- [Next 10 Steps](NEXT_10_STEPS.md)
- [Architecture Patterns](ARCHITECTURE_PATTERNS.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Theme System](docs/THEMING_SYSTEM.md)
- [Demo Details](docs/demos/)

## 🧪 Testing

```bash
./dev.sh test      # Run all tests
```

## 🐛 Troubleshooting

```bash
./dev.sh fix       # Apply common fixes
./dev.sh clean     # Clean and rebuild
./dev.sh logs      # Check service logs
```

## 📊 Performance Targets

- Initial Load: < 2s
- Stream Latency: < 50ms
- Memory Usage: < 100MB
- Lighthouse Score: > 95

## 🤝 Contributing

See [DEVELOPMENT_CHECKLIST.md](DEVELOPMENT_CHECKLIST.md) for development guidelines.

## 📄 License

MIT

