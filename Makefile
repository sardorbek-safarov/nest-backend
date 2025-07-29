# NestJS Backend Makefile
# This Makefile provides convenient commands for development and deployment

# Variables
DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_PROD = docker compose -f docker-compose.prod.yml
APP_CONTAINER = nest-backend
DB_CONTAINER = postgres
PROJECT_NAME = nest-backend

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help install dev prod build stop clean logs db-logs status health test lint format

# Default target
help: ## Show this help message
	@echo "$(GREEN)NestJS Backend - Available Commands$(NC)"
	@echo "=================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation and Setup
install: ## Install dependencies locally
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

setup: ## Initial setup (install dependencies and generate Prisma client)
	@echo "$(GREEN)Setting up project...$(NC)"
	npm install
	npx prisma generate
	@echo "$(GREEN)Setup complete!$(NC)"

# Development Commands
dev: ## Start development environment with Docker
	@echo "$(GREEN)Starting development environment...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "API: http://localhost:8080"
	@echo "Database: localhost:5432"

dev-build: ## Build and start development environment
	@echo "$(GREEN)Building and starting development environment...$(NC)"
	$(DOCKER_COMPOSE) up -d --build

dev-logs: ## Follow development logs
	@echo "$(GREEN)Following development logs...$(NC)"
	$(DOCKER_COMPOSE) logs -f

dev-shell: ## Access development container shell
	@echo "$(GREEN)Accessing development container shell...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) sh

# Production Commands
prod: ## Start production environment
	@echo "$(GREEN)Starting production environment...$(NC)"
	$(DOCKER_COMPOSE_PROD) up -d
	@echo "$(GREEN)Production environment started!$(NC)"

prod-build: ## Build and start production environment
	@echo "$(GREEN)Building and starting production environment...$(NC)"
	$(DOCKER_COMPOSE_PROD) up -d --build

prod-logs: ## Follow production logs
	@echo "$(GREEN)Following production logs...$(NC)"
	$(DOCKER_COMPOSE_PROD) logs -f

# Container Management
build: ## Build Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) build

stop: ## Stop all containers
	@echo "$(YELLOW)Stopping containers...$(NC)"
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE_PROD) down

restart: ## Restart all containers
	@echo "$(YELLOW)Restarting containers...$(NC)"
	$(DOCKER_COMPOSE) restart

clean: ## Stop containers and remove volumes
	@echo "$(RED)Stopping containers and removing volumes...$(NC)"
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE_PROD) down -v
	docker system prune -f

# Logs and Monitoring
logs: ## Show application logs
	$(DOCKER_COMPOSE) logs $(APP_CONTAINER)

logs-tail: ## Follow application logs
	$(DOCKER_COMPOSE) logs -f $(APP_CONTAINER) --tail=50

db-logs: ## Show database logs
	$(DOCKER_COMPOSE) logs $(DB_CONTAINER)

status: ## Show container status
	@echo "$(GREEN)Container Status:$(NC)"
	$(DOCKER_COMPOSE) ps

# Health and Testing
health: ## Check application health
	@echo "$(GREEN)Checking application health...$(NC)"
	@curl -s http://localhost:8080/health | jq . || curl -s http://localhost:8080/health

ping: ## Ping the application
	@echo "$(GREEN)Pinging application...$(NC)"
	@curl -s http://localhost:8080/ || echo "$(RED)Application not responding$(NC)"

# Database Commands
db-connect: ## Connect to PostgreSQL database
	@echo "$(GREEN)Connecting to database...$(NC)"
	$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U nestuser -d nestdb

db-backup: ## Backup database
	@echo "$(GREEN)Creating database backup...$(NC)"
	$(DOCKER_COMPOSE) exec $(DB_CONTAINER) pg_dump -U nestuser nestdb > backup-$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup created!$(NC)"

db-restore: ## Restore database from backup (usage: make db-restore FILE=backup.sql)
	@echo "$(GREEN)Restoring database from $(FILE)...$(NC)"
	@if [ -z "$(FILE)" ]; then echo "$(RED)Usage: make db-restore FILE=backup.sql$(NC)"; exit 1; fi
	$(DOCKER_COMPOSE) exec -T $(DB_CONTAINER) psql -U nestuser -d nestdb < $(FILE)

# Prisma Commands
prisma-generate: ## Generate Prisma client
	@echo "$(GREEN)Generating Prisma client...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npx prisma generate

prisma-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npx prisma migrate dev

prisma-reset: ## Reset database and run migrations
	@echo "$(YELLOW)Resetting database...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npx prisma migrate reset --force

prisma-deploy: ## Deploy migrations to production
	@echo "$(GREEN)Deploying migrations...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npx prisma migrate deploy

prisma-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npx prisma studio

prisma-seed: ## Seed the database
	@echo "$(GREEN)Seeding database...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npx prisma db seed

# Development Tools
test: ## Run tests in container
	@echo "$(GREEN)Running tests...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npm run test

test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npm run test:watch

test-e2e: ## Run end-to-end tests
	@echo "$(GREEN)Running e2e tests...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npm run test:e2e

test-cov: ## Run tests with coverage
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npm run test:cov

lint: ## Run linter
	@echo "$(GREEN)Running linter...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npm run lint

format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) npm run format

# Local Development (without Docker)
local-install: ## Install dependencies locally
	npm install

local-dev: ## Start development server locally
	npm run start:dev

local-build: ## Build application locally
	npm run build

local-test: ## Run tests locally
	npm run test

# Utility Commands
exec: ## Execute command in container (usage: make exec CMD="npm install package")
	@if [ -z "$(CMD)" ]; then echo "$(RED)Usage: make exec CMD=\"your command\"$(NC)"; exit 1; fi
	$(DOCKER_COMPOSE) exec $(APP_CONTAINER) $(CMD)

volumes: ## Show Docker volumes
	@echo "$(GREEN)Docker volumes:$(NC)"
	docker volume ls | grep $(PROJECT_NAME)

images: ## Show Docker images
	@echo "$(GREEN)Docker images:$(NC)"
	docker images | grep $(PROJECT_NAME)

# Quick shortcuts
up: dev ## Alias for dev
down: stop ## Alias for stop
sh: dev-shell ## Alias for dev-shell
