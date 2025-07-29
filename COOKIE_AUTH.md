# Cookie-Based Authentication Guide

This NestJS application now supports **HTTP-only cookie-based authentication** for enhanced security. Tokens are automatically managed through secure cookies instead of being returned in response bodies.

## 🍪 Cookie Authentication Features

### Security Benefits

- **HTTP-only cookies**: Prevents XSS attacks as cookies can't be accessed via JavaScript
- **Secure flag**: Cookies only sent over HTTPS in production
- **SameSite=Strict**: Prevents CSRF attacks
- **Automatic token management**: No need to manually handle tokens in frontend code

### Cookie Configuration

- **Access Token**: Expires in 15 minutes
- **Refresh Token**: Expires in 7 days
- **Auto-refresh**: Use the refresh endpoint to get new tokens
- **CORS enabled**: Supports credentials for cross-origin requests

## 🔐 Authentication Endpoints

### 1. Register User (Cookie-based)

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "securePassword123", "age": 30}' \
  -c cookies.txt
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  },
  "message": "Registration successful"
}
```

**Cookies Set:**

- `access_token` (15 min expiry)
- `refresh_token` (7 days expiry)

### 2. Login User (Cookie-based)

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "securePassword123"}' \
  -c cookies.txt
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  },
  "message": "Login successful"
}
```

### 3. Access Protected Routes

```bash
curl -X GET http://localhost:8080/auth/profile \
  -b cookies.txt
```

**Response:**

```json
{
  "userId": 1,
  "email": "john@example.com"
}
```

### 4. Refresh Tokens

```bash
curl -X POST http://localhost:8080/auth/refresh \
  -b cookies.txt -c cookies.txt
```

**Response:**

```json
{
  "message": "Tokens refreshed successfully"
}
```

### 5. Logout

```bash
curl -X POST http://localhost:8080/auth/logout \
  -b cookies.txt -c cookies.txt
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

## 🔄 Backward Compatibility

The application maintains backward compatibility with JSON-based authentication:

### JSON-based Endpoints (Legacy)

- `POST /auth/register-json` - Returns tokens in response body
- `POST /auth/login-json` - Returns tokens in response body
- `POST /auth/refresh-json` - Accepts refresh token in body

### Example JSON Login

```bash
curl -X POST http://localhost:8080/auth/login-json \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "securePassword123"}'
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

## 🌐 Frontend Integration

### JavaScript/TypeScript

```javascript
// Login with cookies
const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: Include cookies
    body: JSON.stringify({ email, password }),
  });

  return response.json(); // Cookies are automatically stored
};

// Access protected routes
const getProfile = async () => {
  const response = await fetch('http://localhost:8080/auth/profile', {
    credentials: 'include', // Important: Send cookies
  });

  return response.json();
};

// Refresh tokens
const refreshTokens = async () => {
  const response = await fetch('http://localhost:8080/auth/refresh', {
    method: 'POST',
    credentials: 'include', // Important: Send and receive cookies
  });

  return response.json();
};

// Logout
const logout = async () => {
  const response = await fetch('http://localhost:8080/auth/logout', {
    method: 'POST',
    credentials: 'include', // Important: Send cookies for clearing
  });

  return response.json();
};
```

### React Example

```jsx
import { useState, useEffect } from 'react';

const AuthComponent = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => handleLogin('test@example.com', 'password123')}>
          Login
        </button>
      )}
    </div>
  );
};
```

## ⚙️ Configuration

### Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# CORS Configuration (add your frontend URLs)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Security
NODE_ENV=production  # Enables secure cookies over HTTPS
```

### CORS Configuration

The application is configured to accept credentials from specific origins. Update the CORS configuration in `src/main.ts`:

```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Your frontend URLs
  credentials: true, // Important for cookies
});
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Set `NODE_ENV=production` for secure cookies over HTTPS
- [ ] Use strong JWT secrets
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Set up proper logging and monitoring

### Cookie Security Features

- **HttpOnly**: Prevents JavaScript access
- **Secure**: Only sent over HTTPS in production
- **SameSite=Strict**: Prevents CSRF attacks
- **Proper expiration**: Access tokens expire in 15 minutes
- **Automatic cleanup**: Logout clears all cookies

## 🧪 Testing

### Manual Testing

```bash
# Test registration
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}' \
  -c cookies.txt -v

# Test protected route access
curl -X GET http://localhost:8080/auth/profile \
  -b cookies.txt -v

# Test token refresh
curl -X POST http://localhost:8080/auth/refresh \
  -b cookies.txt -c cookies.txt -v

# Test logout
curl -X POST http://localhost:8080/auth/logout \
  -b cookies.txt -c cookies.txt -v
```

### Automated Testing

Consider implementing automated tests for:

- Cookie setting and reading
- Token expiration handling
- CORS functionality
- Security headers validation

## 📝 Notes

1. **Cookie vs JSON**: Use cookie-based endpoints for web applications, JSON endpoints for mobile apps or APIs
2. **Cross-origin**: Ensure `credentials: 'include'` is set in frontend requests
3. **Token rotation**: Refresh tokens are automatically rotated on each refresh
4. **Security**: Cookies are automatically handled by browsers and are more secure than localStorage
5. **Development**: Use `-c cookies.txt -b cookies.txt` with curl for cookie persistence

This implementation provides a secure, production-ready authentication system with automatic token management through HTTP-only cookies! 🚀
