# Task Management Guide

This project provides multiple ways to manage development and deployment tasks. Choose the one that fits your workflow best!

## 🔧 Available Task Runners

### 1. **Makefile** (Recommended for Unix/Linux/Mac)

Traditional make-based task runner with comprehensive commands.

```bash
# Show all available commands
make help

# Common development tasks
make dev          # Start development environment
make stop         # Stop all containers
make logs         # Follow application logs
make health       # Check application health
make test         # Run tests
make clean        # Clean up containers and volumes

# Database tasks
make db-connect   # Connect to PostgreSQL
make prisma-studio # Open Prisma Studio
make prisma-migrate # Run migrations

# Production tasks
make prod         # Start production environment
make prod-build   # Build and start production
```

### 2. **Node.js Task Runner** (Cross-platform)

Modern JavaScript-based task runner that works on all platforms.

```bash
# Show all available commands
node tasks.js help
# or
npm run task help

# Common development tasks
npm run task dev          # Start development environment
npm run task stop         # Stop all containers
npm run task logs         # Follow application logs
npm run task health       # Check application health
npm run task test         # Run tests

# Database tasks
npm run task db-connect   # Connect to PostgreSQL
npm run task prisma-studio # Open Prisma Studio
npm run task prisma-migrate # Run migrations
```

### 3. **NPM Scripts** (Simple and familiar)

Direct npm script execution for common tasks.

```bash
# Docker management
npm run docker:dev        # Start development environment
npm run docker:stop       # Stop containers
npm run docker:logs       # Show logs
npm run docker:status     # Show container status

# Development
npm run start:dev         # Start app locally (without Docker)
npm run test              # Run tests
npm run lint              # Run linter
npm run format            # Format code

# Database
npm run db:connect        # Connect to database
npm run prisma:studio     # Open Prisma Studio
npm run prisma:migrate    # Run migrations
```

### 4. **Shell Script** (Bash-based)

Simple shell script for basic operations.

```bash
# Make script executable (first time only)
chmod +x scripts/dev.sh

# Usage
./scripts/dev.sh dev          # Start development
./scripts/dev.sh stop         # Stop containers
./scripts/dev.sh logs         # Show logs
./scripts/dev.sh health       # Check health
./scripts/dev.sh db-connect   # Connect to database
```

## 🚀 Quick Start Commands

Regardless of which task runner you choose, here are the most common workflows:

### Development Workflow

```bash
# Option 1: Using Make
make dev && make logs

# Option 2: Using Node.js task runner
npm run task dev && npm run task logs

# Option 3: Using npm scripts
npm run docker:dev && npm run docker:logs
```

### Database Setup

```bash
# Option 1: Using Make
make dev
make prisma-migrate
make prisma-studio

# Option 2: Using Node.js task runner
npm run task dev
npm run task prisma-migrate
npm run task prisma-studio
```

### Production Deployment

```bash
# Option 1: Using Make
make prod-build

# Option 2: Using Node.js task runner
npm run task prod-build
```

### Testing and Quality

```bash
# Option 1: Using Make
make test
make lint
make format

# Option 2: Using Node.js task runner
npm run task test
npm run task lint
npm run task format
```

## 🔍 Command Reference

### Development Commands

| Task        | Description                               |
| ----------- | ----------------------------------------- |
| `dev`       | Start development environment with Docker |
| `dev-build` | Build and start development environment   |
| `stop`      | Stop all containers                       |
| `restart`   | Restart containers                        |
| `logs`      | Follow application logs                   |
| `status`    | Show container status                     |
| `health`    | Check application health                  |

### Database Commands

| Task              | Description                    |
| ----------------- | ------------------------------ |
| `db-connect`      | Connect to PostgreSQL database |
| `db-backup`       | Create database backup         |
| `prisma-generate` | Generate Prisma client         |
| `prisma-migrate`  | Run database migrations        |
| `prisma-studio`   | Open Prisma Studio GUI         |
| `prisma-reset`    | Reset database and migrations  |

### Testing Commands

| Task       | Description               |
| ---------- | ------------------------- |
| `test`     | Run unit tests            |
| `test-e2e` | Run end-to-end tests      |
| `test-cov` | Run tests with coverage   |
| `lint`     | Run ESLint                |
| `format`   | Format code with Prettier |

### Production Commands

| Task         | Description                     |
| ------------ | ------------------------------- |
| `prod`       | Start production environment    |
| `prod-build` | Build and start production      |
| `clean`      | Clean up containers and volumes |

## 💡 Tips

1. **For beginners**: Start with npm scripts - they're familiar and easy to use
2. **For power users**: Use Make for advanced features and better performance
3. **For cross-platform**: Use the Node.js task runner for maximum compatibility
4. **For CI/CD**: Use Make or npm scripts in your deployment pipelines

## 🔧 Customization

You can easily extend any of these task runners:

- **Makefile**: Add new targets in the Makefile
- **Node.js**: Add new tasks in `tasks.js`
- **NPM**: Add new scripts in `package.json`
- **Shell**: Extend `scripts/dev.sh`

Choose the approach that best fits your team's workflow and technical preferences!
