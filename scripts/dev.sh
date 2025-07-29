#!/bin/bash
# Development Environment Management Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Main function
case "$1" in
    "dev")
        log_info "Starting development environment..."
        docker compose up -d
        log_info "Development environment started!"
        log_info "API: http://localhost:8080"
        ;;
    "dev-build")
        log_info "Building and starting development environment..."
        docker compose up -d --build
        ;;
    "prod")
        log_info "Starting production environment..."
        docker compose -f docker-compose.prod.yml up -d
        ;;
    "stop")
        log_warn "Stopping containers..."
        docker compose down
        docker compose -f docker-compose.prod.yml down
        ;;
    "logs")
        docker compose logs -f nest-backend --tail=50
        ;;
    "status")
        log_info "Container Status:"
        docker compose ps
        ;;
    "health")
        log_info "Checking application health..."
        curl -s http://localhost:8080/health | jq . || curl -s http://localhost:8080/health
        ;;
    "db-connect")
        log_info "Connecting to database..."
        docker compose exec postgres psql -U nestuser -d nestdb
        ;;
    "prisma-migrate")
        log_info "Running database migrations..."
        docker compose exec nest-backend npx prisma migrate dev
        ;;
    "prisma-studio")
        log_info "Opening Prisma Studio..."
        docker compose exec nest-backend npx prisma studio
        ;;
    "test")
        log_info "Running tests..."
        docker compose exec nest-backend npm run test
        ;;
    "clean")
        log_warn "Cleaning up containers and volumes..."
        docker compose down -v
        docker compose -f docker-compose.prod.yml down -v
        docker system prune -f
        ;;
    *)
        echo "Usage: $0 {dev|dev-build|prod|stop|logs|status|health|db-connect|prisma-migrate|prisma-studio|test|clean}"
        echo ""
        echo "Available commands:"
        echo "  dev           - Start development environment"
        echo "  dev-build     - Build and start development environment"
        echo "  prod          - Start production environment"
        echo "  stop          - Stop all containers"
        echo "  logs          - Follow application logs"
        echo "  status        - Show container status"
        echo "  health        - Check application health"
        echo "  db-connect    - Connect to database"
        echo "  prisma-migrate - Run database migrations"
        echo "  prisma-studio - Open Prisma Studio"
        echo "  test          - Run tests"
        echo "  clean         - Clean up containers and volumes"
        exit 1
        ;;
esac
