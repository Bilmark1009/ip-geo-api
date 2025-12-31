# Backend Quick Reference Card

## 🚀 Quick Start
```bash
npm install              # Install dependencies
cp .env.example .env     # Create .env (update JWT_SECRET)
npm run migrate          # Run migrations
npm run seed             # Seed test user
npm run dev              # Start server (http://localhost:5000)
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Rate Limit |
|--------|----------|------|-----------|
| POST | `/api/register` | No | 5/15min |
| POST | `/api/login` | No | 5/15min |
| GET | `/api/validate-token` | Yes | 100/15min |

### Data
| Method | Endpoint | Auth | Rate Limit |
|--------|----------|------|-----------|
| GET | `/api/ip-info?ip=x.x.x.x` | No | 100/15min |
| GET | `/health` | No | 100/15min |

## 🔐 Authentication Flow

```
1. Register/Login
   POST /api/login
   { email, password }
   ↓
   Server validates & generates JWT
   ↓
   Returns: { user, token }

2. Use Token
   GET /api/validate-token
   Header: Authorization: Bearer <token>
   ↓
   Server verifies token
   ↓
   Returns: { user, message }

3. Token Expires
   After 7 days or invalid
   ↓
   Login again to get new token
```

## 📝 Request Examples

### Register
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","confirmPassword":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Validate Token
```bash
curl -X GET http://localhost:5000/api/validate-token \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### IP Lookup
```bash
curl http://localhost:5000/api/ip-info?ip=8.8.8.8
```

### Health Check
```bash
curl http://localhost:5000/health
```

## ⚠️ Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | Success | Request OK |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Invalid token |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Internal error |
| 503 | Unavailable | Database down |

## 🔧 Useful Commands

```bash
# Development
npm run dev                 # Start with hot reload
npm run start               # Start production

# Database
npm run migrate             # Run migrations
npm run migrate:deploy      # Deploy migrations
npm run seed                # Seed test data
npm run prisma:studio       # Open database GUI
npm run prisma:generate     # Regenerate Prisma client

# Logs
tail -f logs/error.log      # Watch errors
tail -f logs/combined.log   # Watch all logs
```

## 📋 Validation Rules

### Email
- Must be valid email format
- Example: `user@example.com`

### Password
- Minimum 6 characters
- Example: `password123`

### IP Address (optional)
- IPv4 format only
- Example: `8.8.8.8`

## 🔐 Security Headers

Server automatically adds:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

## 📊 Environment Variables

| Variable | Default | Example |
|----------|---------|---------|
| NODE_ENV | development | production |
| PORT | 5000 | 3000 |
| DATABASE_URL | file:./prisma/dev.db | - |
| JWT_SECRET | your-secret-key | abc123xyz |
| BCRYPT_ROUNDS | 10 | 12 |
| CORS_ORIGIN | http://localhost:5173 | https://example.com |
| LOG_LEVEL | info | debug |

## ⚡ Performance

- **Email lookup:** Indexed for fast queries
- **Rate limiting:** Prevents overload
- **Connection pooling:** Optimized database access
- **Caching:** Token validation with minimal overhead

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Port already in use" | Change PORT in .env or kill process |
| "Database lock" | `rm prisma/dev.db && npm run migrate` |
| "Too many requests" | Wait 15 minutes or restart |
| "Invalid token" | Login again to get new token |
| "CORS error" | Update CORS_ORIGIN in .env |

## 📁 File Structure

```
backend/
├── server.js                    # Main entry
├── package.json                 # Dependencies
├── .env.example                 # Config template
├── logs/                        # Log files
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Test data
└── src/
    ├── routes/
    │   └── authRoutes.js       # Route handlers
    ├── controllers/
    │   └── authController.js   # Business logic
    └── middleware/
        ├── authMiddleware.js      # JWT validation
        ├── validationMiddleware.js # Input validation
        └── errorHandler.js        # Error handling
```

## 🎓 Key Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| Node.js | Runtime | 18.x+ |
| Express | Web framework | 4.18.2 |
| SQLite | Database | - |
| Prisma | ORM | 5.7.0 |
| JWT | Authentication | - |
| Zod | Validation | Latest |
| Helmet | Security | Latest |
| Winston | Logging | Latest |

## 🔗 Links & Resources

- [API Documentation](./README.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Improvements Summary](./IMPROVEMENTS_SUMMARY.md)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express Docs](https://expressjs.com/)

## 💡 Pro Tips

1. **Always set JWT_SECRET in production** - Use strong random string
2. **Monitor logs regularly** - Check for errors/failed attempts
3. **Keep dependencies updated** - Run `npm audit fix`
4. **Test rate limiting** - Make multiple requests to verify
5. **Check health endpoint** - Verify database connection
6. **Use Bearer token format** - `Authorization: Bearer <token>`
7. **Save tokens client-side** - Use localStorage or cookie
8. **Handle token expiration** - Prompt user to login again

---

**Version:** 1.0.0 | **Updated:** December 31, 2025
