# API Endpoints

The application is running on port 8080 with the API prefix `api/v1`.

**Base URL:** `http://localhost:8080/api/v1`

## Health Check

- **GET** `/health` - Check application health status

## Authentication

- **POST** `/auth/register` - Register a new user (cookies)
- **POST** `/auth/register-json` - Register a new user (JSON response)
- **POST** `/auth/login` - Login user (cookies)
- **POST** `/auth/login-json` - Login user (JSON response)
- **POST** `/auth/refresh` - Refresh access token (cookies)
- **POST** `/auth/refresh-json` - Refresh access token (JSON response)
- **POST** `/auth/logout` - Logout user
- **GET** `/auth/profile` - Get user profile (protected)

## Users

- **GET** `/users` - Get all users (protected)
- **GET** `/users/:id` - Get user by ID (protected)
- **PUT** `/users/:id` - Update user (protected)
- **DELETE** `/users/:id` - Delete user (protected)

## Example Usage

### Health Check

```bash
curl -X GET http://localhost:8080/api/v1/health
```

### Register (Cookie-based)

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login (Cookie-based)

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:8080/api/v1/auth/profile \
  -b cookies.txt
```

## Notes

- All authentication endpoints have both cookie-based and JSON-based versions
- Cookie-based endpoints set HTTP-only cookies automatically
- JSON-based endpoints return tokens in the response body
- Protected routes require authentication via cookies or Authorization header
