# NestJS Backend with Docker & Prisma

A modern NestJS backend application with JWT authentication, PostgreSQL database, and Docker containerization.

## Features

- � **NestJS Framework** - Latest version with TypeScript
- 🔐 **JWT Authentication** - Access & refresh tokens with Passport
- 🐘 **PostgreSQL Database** - Version 15 with Prisma ORM
- 🐳 **Docker Support** - Development and production configurations
- 📊 **Volume Persistence** - Enhanced data persistence and logging
- 🔒 **Password Security** - bcrypt hashing
- 🛡️ **Guards & Strategies** - JWT guards for route protection

## Quick Start

### Development Mode

1. **Start the development environment:**

```bash
docker-compose up -d
```

2. **Run database migrations:**

```bash
docker exec -it nest-backend npx prisma migrate dev
```

3. **Access the application:**
   - API: http://localhost:8080
   - Database: localhost:5432

### Production Mode

1. **Start the production environment:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Volume Bindings

### Development Volumes

- `./src:/usr/src/app/src` - Source code hot reload
- `./prisma:/usr/src/app/prisma` - Database schema and migrations
- `app_logs:/usr/src/app/logs` - Application logs
- `app_uploads:/usr/src/app/uploads` - File uploads
- `postgres_data:/var/lib/postgresql/data` - PostgreSQL data
- `postgres_logs:/var/log/postgresql` - PostgreSQL logs

### Production Volumes

- `app_logs:/usr/src/app/logs` - Application logs
- `app_uploads:/usr/src/app/uploads` - File uploads
- `./config:/usr/src/app/config:ro` - Configuration files (read-only)
- `postgres_data_prod:/var/lib/postgresql/data` - PostgreSQL data
- `postgres_logs_prod:/var/log/postgresql` - PostgreSQL logs

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Users (Protected)

- `GET /users/profile` - Get user profile
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Environment Variables

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV=development
PORT=8080

# Database
DATABASE_URL=postgresql://nestuser:nestpass@localhost:5432/nestdb

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

## Database Management

### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name your-migration-name

# Reset database
npx prisma migrate reset

# View data in Prisma Studio
npx prisma studio
```

### Docker Database Commands

```bash
# Connect to PostgreSQL
docker exec -it postgres-db psql -U nestuser -d nestdb

# View logs
docker logs postgres-db

# Backup database
docker exec postgres-db pg_dump -U nestuser nestdb > backup.sql
```

## Project Structure

```
src/
├── auth/           # Authentication module
│   ├── guards/     # JWT guards
│   ├── strategies/ # Passport strategies
│   └── dto/        # Data transfer objects
├── user/           # User management module
├── prisma/         # Database service
└── main.ts         # Application entry point

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations

docker/
├── Dockerfile      # Production Dockerfile
├── Dockerfile.dev  # Development Dockerfile
└── docker-compose.* # Docker compose files
```

## Development

### Local Development

1. **Install dependencies:**

```bash
npm install
```

2. **Start PostgreSQL:**

```bash
docker run --name postgres-local -e POSTGRES_PASSWORD=nestpass -e POSTGRES_USER=nestuser -e POSTGRES_DB=nestdb -p 5432:5432 -d postgres:15-alpine
```

3. **Run migrations:**

```bash
npx prisma migrate dev
```

4. **Start development server:**

```bash
npm run start:dev
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Deployment

1. **Build the application:**

```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Monitor logs:**

```bash
docker logs -f nest-backend-prod
```

## Security Notes

- Change default JWT secrets in production
- Use environment-specific database credentials
- Enable HTTPS in production
- Implement rate limiting
- Add input validation and sanitization

## License

This project is licensed under the MIT License.🚀 NestJS framework with TypeScript

- 🐳 Docker and Docker Compose setup
- 🗄️ PostgreSQL database with **Prisma ORM**
- 🔐 JWT Authentication with Access & Refresh tokens
- 🔥 Hot reload in development
- 🛡️ Production-ready configuration
- 🏗️ Clean project structure
- ❤️ Health check endpoint with database status
- 👥 User CRUD operations with auth protection
- 🎨 **Prisma Studio** for database managementnd with Docker

A production-ready NestJS backend application with Docker support.

## Features

- 🚀 NestJS framework with TypeScript
- 🐳 Docker and Docker Compose setup
- �️ PostgreSQL database with TypeORM
- �🔥 Hot reload in development
- 🛡️ Production-ready configuration
- 🏗️ Clean project structure
- ❤️ Health check endpoint with database status
- 👥 Example User CRUD operations

## Quick Start

### Prerequisites

- Node.js 18+ (if running locally)
- Docker and Docker Compose

### Development with Docker

1. Clone and navigate to the project:

   ```bash
   cd nest-backend
   ```

2. Start the development environment:

   ```bash
   docker-compose up --build
   ```

3. The application will be available at `http://localhost:8080`

### Development without Docker

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start:dev
   ```

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Database Management (Prisma)

- `npm run prisma:studio` - Open Prisma Studio (Database Browser)
- `npm run prisma:migrate` - Create and apply migration
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:reset` - Reset database (development only)

## Docker Commands

### Development

```bash
# Start development environment
docker-compose up --build

# Stop development environment
docker-compose down

# View logs
docker-compose logs -f nest-backend
```

### Production

```bash
# Build and start production environment
docker-compose -f docker-compose.prod.yml up --build -d

# Stop production environment
docker-compose -f docker-compose.prod.yml down
```

## API Endpoints

### Application

- `GET /` - Hello World message
- `GET /health` - Health check endpoint (includes database status)

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user (requires auth)
- `GET /auth/profile` - Get user profile (requires auth)

### Users (Protected Routes - Requires JWT Token)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Authentication Examples

#### Register

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe", "password": "password123", "age": 30}'
```

#### Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Access Protected Route

```bash
curl -X GET http://localhost:8080/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Refresh Token

```bash
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

## Project Structure

```
nest-backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local-auth.guard.ts
│   │   └── local.strategy.ts
│   ├── user/              # User module
│   │   ├── user.controller.ts
│   │   ├── user.entity.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   ├── app.controller.ts  # Main controller
│   ├── app.module.ts      # Root module
│   ├── app.service.ts     # Main service
│   └── main.ts           # Application entry point
├── docker-compose.yml     # Development Docker Compose
├── docker-compose.prod.yml # Production Docker Compose
├── Dockerfile            # Production Dockerfile
├── Dockerfile.dev        # Development Dockerfile
├── nest-cli.json         # Nest CLI configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Package configuration
```

## Environment Variables

- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment mode (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: nestuser)
- `DB_PASSWORD` - Database password (default: nestpass)
- `DB_DATABASE` - Database name (default: nestdb)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is [MIT licensed](LICENSE).
