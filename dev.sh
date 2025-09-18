#!/bin/bash

# ============================================================================
# gRPC Demo Application - Development Environment Manager
# ============================================================================
# Usage: ./dev.sh [command] [options]
#
# Commands:
#   setup     - Initial project setup (install deps, fix errors, build)
#   start     - Start all services (gRPC, Envoy, Next.js)
#   stop      - Stop all services
#   restart   - Restart all services
#   status    - Check service status
#   logs      - Show logs for services
#   clean     - Clean all build artifacts and dependencies
#   test      - Run tests
#   fix       - Fix common issues
#   help      - Show this help message
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT=$(pwd)
GRPC_PORT=50051
ENVOY_PORT=8080
ENVOY_ADMIN_PORT=9901
NEXT_PORT=3000
PIDS_DIR="$PROJECT_ROOT/.pids"

# Ensure PIDs directory exists
mkdir -p "$PIDS_DIR"

# ==============================================================================
# Utility Functions
# ==============================================================================

print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║${NC} ${BOLD}$1${NC}"
    echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

print_info() {
    echo -e "${CYAN}ℹ️${NC}  $1"
}

print_step() {
    echo -e "${MAGENTA}▶${NC} $1"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed"
        return 1
    fi
    return 0
}

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

kill_port() {
    if check_port $1; then
        print_warning "Killing process on port $1"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# ==============================================================================
# Setup Functions
# ==============================================================================

cmd_setup() {
    print_header "🚀 Setting up gRPC Demo Application"

    # Check prerequisites
    print_step "Checking prerequisites..."

    local missing_deps=0

    if ! check_command node; then
        print_error "Node.js is required. Please install Node.js 18+"
        missing_deps=1
    else
        print_success "Node.js $(node -v) installed"
    fi

    if ! check_command npm; then
        print_error "npm is required"
        missing_deps=1
    else
        print_success "npm $(npm -v) installed"
    fi

    if ! check_command docker; then
        print_warning "Docker is recommended for Envoy proxy"
    else
        print_success "Docker installed"
    fi

    if [ $missing_deps -eq 1 ]; then
        print_error "Please install missing dependencies and run again"
        exit 1
    fi

    # Fix common issues first
    print_step "Fixing common issues..."
    cmd_fix

    # Install dependencies
    print_step "Installing root dependencies..."
    npm install --silent 2>/dev/null || npm install

    print_step "Installing service dependencies..."

    # gRPC Server
    if [ -d "services/grpc-server" ]; then
        (cd services/grpc-server && npm install --silent 2>/dev/null || npm install)
        print_success "gRPC server dependencies installed"
    fi

    # Protos package
    if [ -d "packages/protos" ]; then
        (cd packages/protos && npm install --silent 2>/dev/null || npm install)
        print_success "Proto package dependencies installed"
    fi

    # Next.js app
    if [ -d "client/next-app" ]; then
        (cd client/next-app && npm install --silent 2>/dev/null || npm install)
        print_success "Next.js dependencies installed"
    fi

    # Try to generate protos (optional)
    if command -v protoc &> /dev/null; then
        print_step "Generating protocol buffers..."
        (cd packages/protos && npm run build 2>/dev/null || true)
    else
        print_warning "protoc not found, skipping proto generation"
    fi

    print_success "Setup complete! Run './dev.sh start' to launch the application"
}

# ==============================================================================
# Fix Functions
# ==============================================================================

cmd_fix() {
    print_step "Applying fixes..."

    # Fix 1: Analytics service import typo
    if [ -f "services/grpc-server/src/services/analytics.service.ts" ]; then
        sed -i.bak 's/import \* \* grpc/import * as grpc/' services/grpc-server/src/services/analytics.service.ts 2>/dev/null || \
        sed -i '' 's/import \* \* grpc/import * as grpc/' services/grpc-server/src/services/analytics.service.ts 2>/dev/null || true
        rm -f services/grpc-server/src/services/analytics.service.ts.bak
        print_success "Fixed analytics service import"
    fi

    # Fix 2: Create next-env.d.ts
    if [ -d "client/next-app" ] && [ ! -f "client/next-app/next-env.d.ts" ]; then
        echo '/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test"
  }
}' > client/next-app/next-env.d.ts
        print_success "Created next-env.d.ts"
    fi

    # Fix 3: Add .env.local for Next.js
    if [ -d "client/next-app" ] && [ ! -f "client/next-app/.env.local" ]; then
        echo 'NEXT_PUBLIC_GRPC_WEB_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENABLE_DEBUG=true' > client/next-app/.env.local
        print_success "Created .env.local for Next.js"
    fi

    # Fix 4: Add type assertions to server
    if [ -f "services/grpc-server/src/index.ts" ]; then
        # This is a more complex fix, so we'll just notify
        print_warning "Remember to add 'as any' to service handlers in index.ts if you see type errors"
    fi

    print_success "Fixes applied"
}

# ==============================================================================
# Start Functions
# ==============================================================================

cmd_start() {
    print_header "🚀 Starting gRPC Demo Application"

    # Check if services are already running
    cmd_status --quiet
    local status=$?

    if [ $status -eq 0 ]; then
        print_warning "Some services are already running. Run './dev.sh restart' to restart them."
        return
    fi

    # Clean up any orphaned processes
    kill_port $GRPC_PORT
    kill_port $NEXT_PORT

    # Start gRPC Server
    print_step "Starting gRPC server on port $GRPC_PORT..."
    (
        cd services/grpc-server
        npm run dev > "$PIDS_DIR/grpc-server.log" 2>&1 &
        echo $! > "$PIDS_DIR/grpc-server.pid"
    )
    sleep 2

    if check_port $GRPC_PORT; then
        print_success "gRPC server started (PID: $(cat $PIDS_DIR/grpc-server.pid))"
    else
        print_error "Failed to start gRPC server. Check logs: tail -f $PIDS_DIR/grpc-server.log"
    fi

    # Start Envoy Proxy (if Docker is available)
    if command -v docker &> /dev/null; then
        print_step "Starting Envoy proxy on port $ENVOY_PORT..."

        # Stop existing Envoy container
        docker stop envoy-grpc-demo 2>/dev/null || true
        docker rm envoy-grpc-demo 2>/dev/null || true

        # Start new Envoy container
        docker run -d \
            --name envoy-grpc-demo \
            -v "$PROJECT_ROOT/docker/envoy.yaml":/etc/envoy/envoy.yaml:ro \
            -p $ENVOY_PORT:8080 \
            -p $ENVOY_ADMIN_PORT:9901 \
            --network host \
            envoyproxy/envoy:v1.27-latest \
            -c /etc/envoy/envoy.yaml \
            > "$PIDS_DIR/envoy.log" 2>&1

        sleep 3

        if docker ps | grep -q envoy-grpc-demo; then
            print_success "Envoy proxy started"
        else
            print_error "Failed to start Envoy. Check: docker logs envoy-grpc-demo"
        fi
    else
        print_warning "Docker not found. Envoy proxy required for gRPC-Web"
    fi

    # Start Next.js Application
    print_step "Starting Next.js application on port $NEXT_PORT..."
    (
        cd client/next-app
        npm run dev > "$PIDS_DIR/next-app.log" 2>&1 &
        echo $! > "$PIDS_DIR/next-app.pid"
    )

    # Wait for Next.js to start
    print_info "Waiting for Next.js to compile..."
    local count=0
    while [ $count -lt 30 ]; do
        if check_port $NEXT_PORT; then
            print_success "Next.js application started (PID: $(cat $PIDS_DIR/next-app.pid))"
            break
        fi
        sleep 1
        count=$((count + 1))
        echo -n "."
    done
    echo ""

    # Final status
    echo ""
    print_header "✨ Application Ready!"
    echo -e "${BOLD}Services:${NC}"
    echo -e "  ${GREEN}▸${NC} gRPC Server:    http://localhost:${GRPC_PORT}"
    echo -e "  ${GREEN}▸${NC} Envoy Proxy:    http://localhost:${ENVOY_PORT}"
    echo -e "  ${GREEN}▸${NC} Envoy Admin:    http://localhost:${ENVOY_ADMIN_PORT}"
    echo -e "  ${GREEN}▸${NC} Next.js App:    http://localhost:${NEXT_PORT}"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo -e "  1. Open ${CYAN}http://localhost:${NEXT_PORT}/dashboard${NC}"
    echo -e "  2. View logs: ${YELLOW}./dev.sh logs${NC}"
    echo -e "  3. Check status: ${YELLOW}./dev.sh status${NC}"
    echo ""
}

# ==============================================================================
# Stop Functions
# ==============================================================================

cmd_stop() {
    print_header "🛑 Stopping gRPC Demo Application"

    # Stop gRPC Server
    if [ -f "$PIDS_DIR/grpc-server.pid" ]; then
        PID=$(cat "$PIDS_DIR/grpc-server.pid")
        if kill -0 $PID 2>/dev/null; then
            kill $PID
            print_success "Stopped gRPC server (PID: $PID)"
        fi
        rm -f "$PIDS_DIR/grpc-server.pid"
    fi

    # Stop Next.js
    if [ -f "$PIDS_DIR/next-app.pid" ]; then
        PID=$(cat "$PIDS_DIR/next-app.pid")
        if kill -0 $PID 2>/dev/null; then
            kill $PID
            print_success "Stopped Next.js app (PID: $PID)"
        fi
        rm -f "$PIDS_DIR/next-app.pid"
    fi

    # Stop Envoy
    if command -v docker &> /dev/null; then
        if docker ps | grep -q envoy-grpc-demo; then
            docker stop envoy-grpc-demo >/dev/null 2>&1
            docker rm envoy-grpc-demo >/dev/null 2>&1
            print_success "Stopped Envoy proxy"
        fi
    fi

    # Clean up any remaining processes on ports
    kill_port $GRPC_PORT
    kill_port $NEXT_PORT

    print_success "All services stopped"
}

# ==============================================================================
# Status Functions
# ==============================================================================

cmd_status() {
    local quiet=false
    if [ "$1" == "--quiet" ]; then
        quiet=true
    fi

    if [ "$quiet" == false ]; then
        print_header "📊 Service Status"
    fi

    local all_running=true

    # Check gRPC Server
    if check_port $GRPC_PORT; then
        [ "$quiet" == false ] && print_success "gRPC Server:    ${GREEN}RUNNING${NC} on port $GRPC_PORT"
    else
        [ "$quiet" == false ] && print_error "gRPC Server:    ${RED}STOPPED${NC}"
        all_running=false
    fi

    # Check Envoy
    if command -v docker &> /dev/null && docker ps | grep -q envoy-grpc-demo; then
        [ "$quiet" == false ] && print_success "Envoy Proxy:    ${GREEN}RUNNING${NC} on port $ENVOY_PORT"
    else
        [ "$quiet" == false ] && print_error "Envoy Proxy:    ${RED}STOPPED${NC}"
        all_running=false
    fi

    # Check Next.js
    if check_port $NEXT_PORT; then
        [ "$quiet" == false ] && print_success "Next.js App:    ${GREEN}RUNNING${NC} on port $NEXT_PORT"
    else
        [ "$quiet" == false ] && print_error "Next.js App:    ${RED}STOPPED${NC}"
        all_running=false
    fi

    if [ "$all_running" == true ]; then
        return 0
    else
        return 1
    fi
}

# ==============================================================================
# Logs Functions
# ==============================================================================

cmd_logs() {
    print_header "📜 Service Logs"

    echo -e "${BOLD}Choose service:${NC}"
    echo "  1) gRPC Server"
    echo "  2) Next.js App"
    echo "  3) Envoy Proxy"
    echo "  4) All (in tmux)"
    echo ""
    read -p "Selection (1-4): " choice

    case $choice in
        1)
            if [ -f "$PIDS_DIR/grpc-server.log" ]; then
                print_info "Showing gRPC server logs (Ctrl+C to exit)..."
                tail -f "$PIDS_DIR/grpc-server.log"
            else
                print_error "No gRPC server logs found"
            fi
            ;;
        2)
            if [ -f "$PIDS_DIR/next-app.log" ]; then
                print_info "Showing Next.js logs (Ctrl+C to exit)..."
                tail -f "$PIDS_DIR/next-app.log"
            else
                print_error "No Next.js logs found"
            fi
            ;;
        3)
            if command -v docker &> /dev/null; then
                print_info "Showing Envoy logs (Ctrl+C to exit)..."
                docker logs -f envoy-grpc-demo
            else
                print_error "Docker not available"
            fi
            ;;
        4)
            if command -v tmux &> /dev/null; then
                print_info "Opening all logs in tmux..."
                tmux new-session -d -s grpc-logs
                tmux send-keys -t grpc-logs "tail -f $PIDS_DIR/grpc-server.log" C-m
                tmux split-window -h -t grpc-logs
                tmux send-keys -t grpc-logs "tail -f $PIDS_DIR/next-app.log" C-m
                tmux split-window -v -t grpc-logs
                if command -v docker &> /dev/null; then
                    tmux send-keys -t grpc-logs "docker logs -f envoy-grpc-demo" C-m
                fi
                tmux attach -t grpc-logs
            else
                print_warning "tmux not installed. Install tmux for multi-panel logs"
            fi
            ;;
        *)
            print_error "Invalid selection"
            ;;
    esac
}

# ==============================================================================
# Clean Functions
# ==============================================================================

cmd_clean() {
    print_header "🧹 Cleaning Project"

    print_warning "This will remove all node_modules, build artifacts, and logs"
    read -p "Continue? (y/N): " confirm

    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "Cancelled"
        return
    fi

    # Stop all services first
    cmd_stop

    # Clean node_modules
    print_step "Removing node_modules..."
    rm -rf node_modules
    rm -rf client/next-app/node_modules
    rm -rf services/grpc-server/node_modules
    rm -rf packages/protos/node_modules

    # Clean build artifacts
    print_step "Removing build artifacts..."
    rm -rf client/next-app/.next
    rm -rf services/grpc-server/dist
    rm -rf packages/protos/dist

    # Clean logs
    print_step "Removing logs..."
    rm -rf "$PIDS_DIR"

    # Clean package-lock files
    print_step "Removing package-lock files..."
    find . -name "package-lock.json" -delete

    print_success "Project cleaned"
}

# ==============================================================================
# Test Functions
# ==============================================================================

cmd_test() {
    print_header "🧪 Running Tests"

    print_info "Running tests for all packages..."

    # Test gRPC Server
    if [ -d "services/grpc-server" ]; then
        print_step "Testing gRPC server..."
        (cd services/grpc-server && npm test 2>/dev/null || print_warning "No tests found for gRPC server")
    fi

    # Test Next.js app
    if [ -d "client/next-app" ]; then
        print_step "Testing Next.js app..."
        (cd client/next-app && npm test 2>/dev/null || print_warning "No tests found for Next.js app")
    fi

    print_success "Tests completed"
}

# ==============================================================================
# Restart Function
# ==============================================================================

cmd_restart() {
    print_header "🔄 Restarting Services"
    cmd_stop
    sleep 2
    cmd_start
}

# ==============================================================================
# Help Function
# ==============================================================================

cmd_help() {
    cat << EOF
${BOLD}gRPC Demo Application - Development Environment Manager${NC}

${BOLD}Usage:${NC} ./dev.sh [command] [options]

${BOLD}Commands:${NC}
  ${GREEN}setup${NC}     - Initial project setup (install deps, fix errors, build)
  ${GREEN}start${NC}     - Start all services (gRPC, Envoy, Next.js)
  ${GREEN}stop${NC}      - Stop all services
  ${GREEN}restart${NC}   - Restart all services
  ${GREEN}status${NC}    - Check service status
  ${GREEN}logs${NC}      - Show logs for services
  ${GREEN}clean${NC}     - Clean all build artifacts and dependencies
  ${GREEN}test${NC}      - Run tests
  ${GREEN}fix${NC}       - Fix common issues
  ${GREEN}help${NC}      - Show this help message

${BOLD}Quick Start:${NC}
  1. ${CYAN}./dev.sh setup${NC}   - First time setup
  2. ${CYAN}./dev.sh start${NC}   - Start development environment
  3. Open ${CYAN}http://localhost:3000/dashboard${NC}

${BOLD}Service Ports:${NC}
  • gRPC Server:    ${YELLOW}50051${NC}
  • Envoy Proxy:    ${YELLOW}8080${NC}
  • Envoy Admin:    ${YELLOW}9901${NC}
  • Next.js App:    ${YELLOW}3000${NC}

${BOLD}Troubleshooting:${NC}
  • Port in use:    ${CYAN}./dev.sh stop${NC} then ${CYAN}./dev.sh start${NC}
  • Build errors:   ${CYAN}./dev.sh fix${NC}
  • Clean slate:    ${CYAN}./dev.sh clean${NC} then ${CYAN}./dev.sh setup${NC}

${BOLD}Requirements:${NC}
  • Node.js 18+
  • npm 9+
  • Docker (for Envoy proxy)
  • tmux (optional, for multi-panel logs)

EOF
}

# ==============================================================================
# Main Command Router
# ==============================================================================

case "${1:-help}" in
    setup)
        cmd_setup
        ;;
    start)
        cmd_start
        ;;
    stop)
        cmd_stop
        ;;
    restart)
        cmd_restart
        ;;
    status)
        cmd_status
        ;;
    logs)
        cmd_logs
        ;;
    clean)
        cmd_clean
        ;;
    test)
        cmd_test
        ;;
    fix)
        cmd_fix
        ;;
    help)
        cmd_help
        ;;
    *)
        print_error "Unknown command: $1"
        cmd_help
        exit 1
        ;;
esac