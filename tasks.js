#!/usr/bin/env node
/**
 * Task Runner for NestJS Backend
 * Alternative to Makefile using Node.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: process.cwd(),
      ...options,
    });
    return result;
  } catch (error) {
    if (!options.ignoreErrors) {
      logError(`Command failed: ${command}`);
      process.exit(1);
    }
    return null;
  }
}

// Task definitions
const tasks = {
  help: {
    description: 'Show available commands',
    run: () => {
      log(
        `${colors.bold}${colors.green}NestJS Backend - Task Runner${colors.reset}`
      );
      log('=====================================\n');

      Object.entries(tasks).forEach(([name, task]) => {
        log(
          `${colors.yellow}${name.padEnd(20)}${colors.reset} ${
            task.description
          }`
        );
      });

      log('\nUsage: node tasks.js <command>');
      log('       npm run task <command>');
    },
  },

  // Development
  dev: {
    description: 'Start development environment',
    run: () => {
      logInfo('Starting development environment...');
      runCommand('docker compose up -d');
      logSuccess('Development environment started!');
      log('API: http://localhost:8080');
      log('Database: localhost:5432');
    },
  },

  'dev-build': {
    description: 'Build and start development environment',
    run: () => {
      logInfo('Building and starting development environment...');
      runCommand('docker compose up -d --build');
      logSuccess('Development environment built and started!');
    },
  },

  // Production
  prod: {
    description: 'Start production environment',
    run: () => {
      logInfo('Starting production environment...');
      runCommand('docker compose -f docker-compose.prod.yml up -d');
      logSuccess('Production environment started!');
    },
  },

  'prod-build': {
    description: 'Build and start production environment',
    run: () => {
      logInfo('Building and starting production environment...');
      runCommand('docker compose -f docker-compose.prod.yml up -d --build');
      logSuccess('Production environment built and started!');
    },
  },

  // Container management
  stop: {
    description: 'Stop all containers',
    run: () => {
      logWarning('Stopping containers...');
      runCommand('docker compose down', { ignoreErrors: true });
      runCommand('docker compose -f docker-compose.prod.yml down', {
        ignoreErrors: true,
      });
      logSuccess('Containers stopped!');
    },
  },

  restart: {
    description: 'Restart containers',
    run: () => {
      logInfo('Restarting containers...');
      runCommand('docker compose restart');
      logSuccess('Containers restarted!');
    },
  },

  clean: {
    description: 'Stop containers and remove volumes',
    run: () => {
      logWarning('Cleaning up containers and volumes...');
      runCommand('docker compose down -v', { ignoreErrors: true });
      runCommand('docker compose -f docker-compose.prod.yml down -v', {
        ignoreErrors: true,
      });
      runCommand('docker system prune -f');
      logSuccess('Cleanup completed!');
    },
  },

  // Monitoring
  logs: {
    description: 'Show application logs',
    run: () => {
      logInfo('Showing application logs...');
      runCommand('docker compose logs -f nest-backend --tail=50');
    },
  },

  status: {
    description: 'Show container status',
    run: () => {
      logInfo('Container Status:');
      runCommand('docker compose ps');
    },
  },

  health: {
    description: 'Check application health',
    run: () => {
      logInfo('Checking application health...');
      try {
        const result = runCommand('curl -s http://localhost:8080/health', {
          silent: true,
        });
        if (result) {
          const healthData = JSON.parse(result.toString());
          logSuccess('Application is healthy!');
          console.log(JSON.stringify(healthData, null, 2));
        }
      } catch (error) {
        logError('Health check failed - application may not be running');
      }
    },
  },

  // Database
  'db-connect': {
    description: 'Connect to PostgreSQL database',
    run: () => {
      logInfo('Connecting to database...');
      runCommand('docker compose exec postgres psql -U nestuser -d nestdb');
    },
  },

  'db-backup': {
    description: 'Backup database',
    run: () => {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5);
      const filename = `backup-${timestamp}.sql`;

      logInfo('Creating database backup...');
      runCommand(
        `docker compose exec postgres pg_dump -U nestuser nestdb > ${filename}`
      );
      logSuccess(`Backup created: ${filename}`);
    },
  },

  // Prisma
  'prisma-generate': {
    description: 'Generate Prisma client',
    run: () => {
      logInfo('Generating Prisma client...');
      runCommand('docker compose exec nest-backend npx prisma generate');
      logSuccess('Prisma client generated!');
    },
  },

  'prisma-migrate': {
    description: 'Run database migrations',
    run: () => {
      logInfo('Running database migrations...');
      runCommand('docker compose exec nest-backend npx prisma migrate dev');
      logSuccess('Migrations completed!');
    },
  },

  'prisma-studio': {
    description: 'Open Prisma Studio',
    run: () => {
      logInfo('Opening Prisma Studio...');
      runCommand('docker compose exec nest-backend npx prisma studio');
    },
  },

  // Testing
  test: {
    description: 'Run tests',
    run: () => {
      logInfo('Running tests...');
      runCommand('docker compose exec nest-backend npm run test');
    },
  },

  'test-e2e': {
    description: 'Run e2e tests',
    run: () => {
      logInfo('Running e2e tests...');
      runCommand('docker compose exec nest-backend npm run test:e2e');
    },
  },

  lint: {
    description: 'Run linter',
    run: () => {
      logInfo('Running linter...');
      runCommand('docker compose exec nest-backend npm run lint');
      logSuccess('Linting completed!');
    },
  },

  format: {
    description: 'Format code',
    run: () => {
      logInfo('Formatting code...');
      runCommand('docker compose exec nest-backend npm run format');
      logSuccess('Code formatted!');
    },
  },

  // Utilities
  shell: {
    description: 'Access container shell',
    run: () => {
      logInfo('Accessing container shell...');
      runCommand('docker compose exec nest-backend sh');
    },
  },

  install: {
    description: 'Install dependencies locally',
    run: () => {
      logInfo('Installing dependencies...');
      runCommand('npm install');
      logSuccess('Dependencies installed!');
    },
  },
};

// Main execution
function main() {
  const command = process.argv[2];

  if (!command || command === 'help') {
    tasks.help.run();
    return;
  }

  const task = tasks[command];
  if (!task) {
    logError(`Unknown command: ${command}`);
    log('\nAvailable commands:');
    tasks.help.run();
    process.exit(1);
  }

  try {
    task.run();
  } catch (error) {
    logError(`Task '${command}' failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  tasks,
  runCommand,
  log,
  logSuccess,
  logWarning,
  logError,
  logInfo,
};
