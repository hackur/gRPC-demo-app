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

Start by coming up with a basic outline of the plan with detailed summaries and psedo code or commands for things like generated the web client, researching the grpc website and available github repositories. Searching for up to date September 2025 information and reading over the appropriate documentation, etc.

Build out agents and if necessary a mmulti-level git working tree format to manage multiple projects.

Build out and plan a set of tasks to plan out a detailed plan and checklist and all related documentation and related notes from all the research you've done.

Use standards compliant approaches and setup the entire environment(s) required for the respective projects.

https://grpc.io/docs/languages/node/quickstart/

https://grpc.io/docs/platforms/web/


https://grpc.io/docs/guides/
These pages under guides could be good resources for the app too.

Authentication
Benchmarking
Cancellation
Compression
Custom Backend Metrics
Custom Load Balancing Policies
Custom Name Resolution
Deadlines
Debugging
Error handling
Flow Control
Graceful Shutdown
Health Checking
Interceptors
Keepalive
Metadata
OpenTelemetry Metrics
Performance Best Practices
Reflection
Request Hedging
Retry
Service Config
Status Codes
Wait-for-Ready

Read all of grpc documentation necessary.

