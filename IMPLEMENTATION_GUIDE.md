# Backend Implementation Guide

## 🎯 Overview

Your backend has been upgraded with enterprise-grade security, validation, logging, and error handling. This guide explains each improvement and how to use them.

## 📋 Implementation Checklist

### ✅ Completed Improvements

1. **Security**
   - [x] Helmet.js for HTTP headers
   - [x] Rate limiting (5 req/15min)
   - [x] JWT authentication
   - [x] Zod input validation
   - [x] bcrypt password hashing

2. **Logging & Monitoring**
   - [x] Winston logger (file + console)
   - [x] Enhanced health check
   - [x] Error logging with stack traces
   - [x] Request logging

3. **API Enhancements**
   - [x] User registration endpoint
   - [x] Login with JWT tokens
   - [x] Token validation endpoint
   - [x] Consistent error responses

4. **Database**
   - [x] Email index for performance
   - [x] Optimized queries

5. **Documentation**
   - [x] Comprehensive README
   - [x] API documentation
   - [x] Error code reference
   - [x] Troubleshooting guide

## 🔐 Security Features Explained

### 1. Helmet.js
**Purpose:** Protect against common web vulnerabilities

**What it does:**
- Sets HTTP headers to prevent XSS attacks
- Prevents clickjacking
- Enforces HTTPS recommendations
- Disables client-side caching of sensitive data

**Example headers added:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### 2. Rate Limiting
**Purpose:** Prevent brute force attacks and DOS

**Configuration:**
```javascript
// Auth endpoints: 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

// General API: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

**Testing rate limit:**
```bash
# Try to login 6 times quickly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"pass123"}'
done
# 6th request will return 429 Too Many Requests
```

### 3. JWT Authentication
**Purpose:** Stateless authentication with expiring tokens

**How it works:**
1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT token (valid for 7 days)
4. Client stores token and includes it in Authorization header
5. Server verifies token on each protected request

**Token structure:**
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: 1, email: "user@example.com", iat: 1234567890, exp: 1234654290 }
Signature: HMACSHA256(header.payload, JWT_SECRET)
```

**Using JWT in requests:**
```bash
# Get token from login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Response includes: "token": "eyJhbGc..."

# Use token for protected endpoints
curl -X GET http://localhost:5000/api/validate-token \
  -H "Authorization: Bearer eyJhbGc..."
```

### 4. Input Validation with Zod
**Purpose:** Ensure data integrity and prevent invalid data

**Validation schemas:**

**Login:**
```javascript
loginSchema.parse({
  email: "user@example.com",      // ✓ Must be valid email
  password: "password123"          // ✓ Min 6 characters
})
```

**Register:**
```javascript
registerSchema.parse({
  email: "user@example.com",       // ✓ Must be valid email
  password: "password123",         // ✓ Min 6 characters
  confirmPassword: "password123"   // ✓ Must match password
})
```

**Error response on validation failure:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 5. Password Security
**Purpose:** Protect user passwords from being exposed

**Implementation:**
- Passwords hashed with bcrypt
- 10 salt rounds (default, configurable)
- Never stored in plain text
- Never returned in API responses

**How bcrypt works:**
```
Original:  "password123"
↓ (bcrypt with 10 rounds)
Hashed:    "$2b$10$N9qo8uLOickgx2ZMRZoXYe..."

When comparing:
Input:     "password123"
Stored:    "$2b$10$N9qo8uLOickgx2ZMRZoXYe..."
↓ (bcrypt compare)
Result:    ✓ MATCH
```

## 📊 Logging System

### Log Files
```
backend/
└── logs/
    ├── error.log      # Error level logs only
    └── combined.log   # All logs (info, warn, error)
```

### Log Levels
```
error   - Critical errors
warn    - Warnings and potential issues
info    - General information (default)
debug   - Detailed debugging information
```

### Example Logs
```json
{
  "timestamp": "2025-12-31 12:00:00",
  "level": "info",
  "message": "User logged in: test@example.com"
}

{
  "timestamp": "2025-12-31 12:01:23",
  "level": "warn",
  "message": "Failed login attempt for: test@example.com"
}

{
  "timestamp": "2025-12-31 12:02:45",
  "level": "error",
  "message": "Database connection failed",
  "stack": "Error: SQLITE_CANTOPEN: unable to open database file..."
}
```

### Viewing Logs
```bash
# View error logs (real-time)
tail -f logs/error.log

# View all logs
tail -f logs/combined.log

# Search for specific user login
grep "logged in" logs/combined.log

# Count failed login attempts
grep "Failed login" logs/combined.log | wc -l
```

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE "User" (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX User_email ON User(email);
```

### Optimizations
- **Email index:** Speeds up login lookups
- **Unique email:** Prevents duplicate accounts
- **Auto timestamp:** Tracks account creation

## 🚀 API Usage Examples

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 2,
    "email": "newuser@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Validate Token
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/validate-token \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "createdAt": "2025-12-31T12:00:00.000Z"
  }
}
```

### 4. Get IP Geolocation
```bash
# Your IP
curl http://localhost:5000/api/ip-info

# Specific IP
curl http://localhost:5000/api/ip-info?ip=8.8.8.8
```

### 5. Health Check
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-31T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors if applicable
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Error Codes
| Code | Error | Solution |
|------|-------|----------|
| 400 | Bad Request | Check validation errors |
| 401 | Unauthorized | Verify credentials |
| 403 | Forbidden | Token invalid or expired |
| 429 | Too Many Requests | Wait 15 minutes |
| 500 | Server Error | Check logs/error.log |
| 503 | Service Unavailable | Check database connection |

### Example: Handling Validation Error
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"short"}'
```

**Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables
```env
# Server
NODE_ENV=development          # development or production
PORT=5000                    # Server port
LOG_LEVEL=info              # Logging level

# Database
DATABASE_URL=file:./prisma/dev.db

# Security
JWT_SECRET=your-secret-key-here  # Change this in production!
BCRYPT_ROUNDS=10                 # Password hashing rounds

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Production Setup
```env
NODE_ENV=production
JWT_SECRET=<generate-strong-random-string>
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

## 🧪 Testing

### Test Registration
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "TestPassword123",
    "confirmPassword": "TestPassword123"
  }'
```

### Test Rate Limiting
```bash
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:5000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  echo ""
done
```

### Test Invalid Input
```bash
# Missing field
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Invalid email
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"password123"}'
```

## 📈 Monitoring

### Check Database Status
```bash
# Health check
curl http://localhost:5000/health

# Using Prisma Studio (GUI)
npm run prisma:studio
```

### Monitor Logs
```bash
# Watch error logs
tail -f logs/error.log

# Search for login attempts
grep "logged in\|Failed login" logs/combined.log

# Count errors
grep "error" logs/error.log | wc -l
```

### Common Issues

**Issue:** "Too many login attempts"
- **Cause:** Rate limit exceeded
- **Solution:** Wait 15 minutes or restart server

**Issue:** "Database connection failed"
- **Cause:** Database file missing or corrupted
- **Solution:** `npm run migrate && npm run seed`

**Issue:** "Invalid or expired token"
- **Cause:** Token expired or JWT_SECRET changed
- **Solution:** Login again to get new token

## 🎓 Learning Resources

### Inside the Code
1. `server.js` - Security middleware setup
2. `src/middleware/authMiddleware.js` - JWT validation
3. `src/middleware/validationMiddleware.js` - Zod validation
4. `src/middleware/errorHandler.js` - Error handling
5. `src/controllers/authController.js` - Business logic
6. `src/routes/authRoutes.js` - Route definitions

### External Resources
- [JWT.io](https://jwt.io) - Understand JWT tokens
- [Zod Documentation](https://zod.dev) - Input validation
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Docs](https://helmetjs.github.io/)

## 📞 Troubleshooting Checklist

- [ ] Check `.env` file exists and has all variables
- [ ] Verify `JWT_SECRET` is set
- [ ] Check logs in `logs/` directory
- [ ] Verify database connection with health check
- [ ] Ensure all npm packages are installed
- [ ] Check server is running on correct port
- [ ] Verify CORS_ORIGIN matches your frontend URL

---

**Last Updated:** December 31, 2025  
**Version:** 1.0.0 with Security Enhancements
