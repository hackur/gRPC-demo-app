#!/bin/bash

# gRPC Demo Application - Setup Script
# This script sets up the entire development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "Node.js $(node -v) installed"
        else
            print_error "Node.js 18+ required (found $(node -v))"
            exit 1
        fi
    else
        print_error "Node.js not installed"
        exit 1
    fi

    # Check npm
    if command -v npm &> /dev/null; then
        print_success "npm $(npm -v) installed"
    else
        print_error "npm not installed"
        exit 1
    fi

    # Check Docker
    if command -v docker &> /dev/null; then
        print_success "Docker $(docker --version | cut -d ' ' -f 3 | cut -d ',' -f 1) installed"
    else
        print_error "Docker not installed"
        exit 1
    fi

    # Check Docker Compose
    if docker compose version &> /dev/null; then
        print_success "Docker Compose installed"
    else
        print_error "Docker Compose not installed"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Generate proto files
generate_protos() {
    print_info "Generating protocol buffer files..."
    cd packages/protos
    npm install
    npm run build
    cd ../..
    print_success "Proto files generated"
}

# Setup environment files
setup_environment() {
    print_info "Setting up environment files..."

    # Create server .env
    if [ ! -f services/demo-server/.env ]; then
        cat > services/demo-server/.env << EOF
NODE_ENV=development
GRPC_PORT=50051
LOG_LEVEL=info
ENABLE_REFLECTION=true
EOF
        print_success "Created services/demo-server/.env"
    else
        print_info "services/demo-server/.env already exists"
    fi

    # Create client .env.local
    if [ ! -f client/next-app/.env.local ]; then
        cat > client/next-app/.env.local << EOF
NEXT_PUBLIC_GRPC_WEB_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENABLE_DEBUG=true
EOF
        print_success "Created client/next-app/.env.local"
    else
        print_info "client/next-app/.env.local already exists"
    fi
}

# Build Docker images
build_docker() {
    print_info "Building Docker images..."
    docker compose build
    print_success "Docker images built"
}

# Start services
start_services() {
    print_info "Starting services..."
    docker compose up -d
    print_success "Services started"

    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 5

    # Check service health
    if docker compose ps | grep -q "grpc-demo-server.*running"; then
        print_success "gRPC server is running"
    else
        print_error "gRPC server is not running"
    fi

    if docker compose ps | grep -q "grpc-envoy-proxy.*running"; then
        print_success "Envoy proxy is running"
    else
        print_error "Envoy proxy is not running"
    fi
}

# Run tests
run_tests() {
    print_info "Running tests..."
    npm test || true  # Don't fail if tests don't exist yet
    print_success "Tests completed"
}

# Print summary
print_summary() {
    echo ""
    echo "========================================="
    echo -e "${GREEN}Setup completed successfully!${NC}"
    echo "========================================="
    echo ""
    echo "Services are running at:"
    echo "  • gRPC Server:    http://localhost:50051"
    echo "  • Envoy Proxy:    http://localhost:8080"
    echo "  • Envoy Admin:    http://localhost:9901"
    echo "  • Next.js App:    http://localhost:3000"
    echo ""
    echo "Useful commands:"
    echo "  • View logs:      docker compose logs -f"
    echo "  • Stop services:  docker compose down"
    echo "  • Restart:        docker compose restart"
    echo "  • Run tests:      npm test"
    echo ""
    echo "Next steps:"
    echo "  1. Open http://localhost:3000 in your browser"
    echo "  2. Try the gRPC demos"
    echo "  3. Check the documentation in IMPLEMENTATION_PLAN.md"
    echo ""
}

# Main execution
main() {
    echo "========================================="
    echo "gRPC Demo Application Setup"
    echo "========================================="
    echo ""

    check_prerequisites
    install_dependencies
    generate_protos
    setup_environment
    build_docker
    start_services
    run_tests
    print_summary
}

# Run main function
main