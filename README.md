# Backend API

IP Geolocation Backend - Node.js + Express + SQLite + JWT + Validation

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <backend-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   **Important:** Update the following in `.env`:
   - `JWT_SECRET` - Change to a secure random string
   - `PORT` - Change if 5000 is in use
   - `DATABASE_URL` - Adjust database path if needed
   - `CORS_ORIGIN` - Update to match your frontend URL

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Seed the database with test user**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will be running at `http://localhost:5000`

## 📋 Test User Credentials

Use these credentials to test the login functionality:

- **Email:** test@example.com
- **Password:** password123

## 🔐 Security Features Implemented

- ✅ **Helmet.js** - HTTP security headers
- ✅ **Rate Limiting** - Brute force protection (5 attempts per 15 mins on auth endpoints)
- ✅ **Input Validation** - Zod schema validation for all inputs
- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Password Hashing** - bcrypt with configurable rounds
- ✅ **CORS Configuration** - Controlled cross-origin access
- ✅ **Error Handling** - Comprehensive global error middleware
- ✅ **Logging** - Winston logger with file and console output

## 📡 API Endpoints

### Authentication

#### Register
- **URL:** `POST /api/register`
- **Rate Limited:** ✅ (5 attempts per 15 mins)
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Login
- **URL:** `POST /api/login`
- **Rate Limited:** ✅ (5 attempts per 15 mins)
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
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

#### Validate Token
- **URL:** `GET /api/validate-token`
- **Headers:** 
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Response:**
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

### IP Geolocation

#### Get IP Information
- **URL:** `GET /api/ip-info?ip=8.8.8.8`
- **Query Params:**
  - `ip` (optional) - IP address to lookup (defaults to client IP)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "ip": "8.8.8.8",
      "hostname": "dns.google",
      "city": "Mountain View",
      "region": "California",
      "country": "US",
      "loc": "37.4192,-122.0574",
      "org": "AS15169 Google LLC",
      "timezone": "America/Los_Angeles"
    }
  }
  ```

### System

#### Health Check
- **URL:** `GET /health`
- **Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-12-31T12:00:00.000Z",
    "uptime": 3600,
    "database": "connected"
  }
  ```

## 📚 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Environment mode | `development` |
| `PORT` | No | Server port | `5000` |
| `DATABASE_URL` | Yes | SQLite database path | `file:./prisma/dev.db` |
| `JWT_SECRET` | Yes | JWT signing secret | `your-secret-key-here` |
| `BCRYPT_ROUNDS` | No | Password hash rounds | `10` |
| `CORS_ORIGIN` | No | Allowed CORS origin | `http://localhost:5173` |
| `LOG_LEVEL` | No | Logging level | `info` |

See `.env.example` for complete template.

## 🗄️ Database

- **Type:** SQLite
- **Location:** `./prisma/dev.db`
- **Schema:** [prisma/schema.prisma](prisma/schema.prisma)

### User Table Structure
```
- id         (Integer, Primary Key, Auto-increment)
- email      (String, Unique, Indexed)
- password   (String, Hashed with bcrypt)
- createdAt  (DateTime, Auto-set)
```

## 📝 Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm start                # Start production server
npm run migrate          # Run database migrations
npm run migrate:deploy   # Deploy migrations (production)
npm run seed             # Seed database with test user
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## 🛠️ Tech Stack

| Component | Package | Version |
|-----------|---------|---------|
| Runtime | Node.js | 18.x+ |
| Framework | Express.js | 4.18.2 |
| Database | SQLite | - |
| ORM | Prisma | 5.7.0 |
| Password Hashing | bcrypt | 5.1.1 |
| Authentication | jsonwebtoken | latest |
| Validation | Zod | latest |
| Security | helmet | latest |
| Rate Limiting | express-rate-limit | latest |
| Logging | winston | latest |
| HTTP Client | axios | 1.13.2 |
| Dev Server | nodemon | 3.0.2 |
| CORS | cors | 2.8.5 |
| Env Config | dotenv | 16.3.1 |

## ⚠️ Input Validation

All inputs are validated using Zod schemas:

### Login/Register Validation
- **Email:** Must be valid email format
- **Password:** Minimum 6 characters
- **Confirm Password:** Must match password on registration

### IP Validation
- **IP Address:** Must match IPv4 format (optional)

### Error Response Format
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

## 📊 Logging

Logs are stored in the `./logs` directory:
- **error.log** - Error level logs only
- **combined.log** - All logs

Console logging is enabled in development mode.

### Log Format
```json
{
  "timestamp": "2025-12-31 12:00:00",
  "level": "info",
  "message": "User logged in: test@example.com",
  "method": "POST",
  "url": "/api/login"
}
```

## 🔒 Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Monitor rate limit hits** - indicates potential attacks
4. **Review logs regularly** - watch for suspicious patterns
5. **Keep dependencies updated** - run `npm audit fix`
6. **Never commit .env** - use .env.example for templates
7. **Use strong BCRYPT_ROUNDS** - default is 10

## 🧪 Testing

Example API calls using cURL:

### Register
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Validate Token
```bash
curl -X GET http://localhost:5000/api/validate-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get IP Info
```bash
curl -X GET http://localhost:5000/api/ip-info?ip=8.8.8.8
```

### Health Check
```bash
curl http://localhost:5000/health
```

## 🚨 Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Validation failed or missing fields |
| 401 | Unauthorized | Invalid credentials or no token |
| 403 | Forbidden | Invalid or expired JWT token |
| 404 | Not Found | Endpoint doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Database connection failed |
| 504 | Gateway Timeout | External API timeout (IP lookup) |

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or:
PORT=3000 npm run dev
```

### Database Lock Error
```bash
# Delete database and re-run migrations:
rm prisma/dev.db
npm run migrate
npm run seed
```

### Rate Limited During Testing
- Wait 15 minutes or restart the server
- Rate limits reset per server restart in development

### JWT Errors
- Ensure JWT_SECRET is set in .env
- Check token expiration (valid for 7 days)
- Token must be in "Bearer <token>" format

## 📞 Support

For issues or questions:
1. Check logs in `./logs` directory
2. Review error messages in terminal
3. Check `.env` configuration
4. Run `npm audit` to check for vulnerabilities

## 📄 License

ISC

---

**Last Updated:** December 31, 2025
