# IP Geolocation Backend API

Backend API service for the IP Geolocation application. This service provides user authentication, JWT-based security, and API endpoints for IP geolocation data.

## 🚀 Features

- **User Authentication**: Secure registration and login with bcrypt password hashing
- **JWT Security**: JSON Web Token-based authentication with secure secret management
- **Rate Limiting**: Configurable rate limiting for API protection
- **Database Integration**: PostgreSQL with Prisma ORM
- **Security Middleware**: Helmet for security headers and CORS configuration
- **Logging**: Winston-based structured logging with file and console output
- **Health Checks**: Database connectivity verification endpoint
- **Environment Configuration**: Separate development and production configurations

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcrypt, express-rate-limit
- **Logging**: Winston
- **Validation**: Zod
- **HTTP Client**: Axios
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment example file:

```bash
cp .env.production.example .env
```

Configure your environment variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
JWT_SECRET=your_secure_random_jwt_secret_here_minimum_32_characters
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run migrate
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Prisma client configuration
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── errorHandler.js      # Global error handling
│   └── routes/
│       └── authRoutes.js        # Authentication routes
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.js                  # Database seeding
├── logs/                        # Application logs
├── server.js                    # Main application entry point
├── createUser.js                # User creation utility
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:deploy` - Deploy migrations to production
- `npm run seed` - Seed database with initial data
- `npm run prisma:studio` - Open Prisma Studio database browser
- `npm run prisma:generate` - Generate Prisma client

## 🗄️ Database Schema

### User Model
```sql
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  createdAt DateTime @default(now())
  
  @@index([email])
}
```

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login and JWT generation
- `POST /api/auth/logout` - User logout (token invalidation)

### Health Check

- `GET /health` - Service health status with database connectivity

## 🛡️ Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 
  - Auth endpoints: 5 requests per 15 minutes
  - General API: 100 requests per 15 minutes
- **Security Headers**: Helmet middleware for HTTP security
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Zod schema validation

## 📊 Logging

The application uses Winston for structured logging:

- **Development**: Console output with colors
- **Production**: File-based logging
  - `logs/error.log` - Error-level logs
  - `logs/combined.log` - All application logs

## 🔧 Environment Variables

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing (minimum 32 characters)

### Optional Variables
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 5000)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:5173)
- `LOG_LEVEL` - Logging level (default: info)

## 🚀 Deployment

### Production Environment Setup

1. **Environment Configuration**:
   ```bash
   cp .env.production.example .env.production
   # Fill in production values
   ```

2. **Database Migration**:
   ```bash
   npm run migrate:deploy
   ```

3. **Start Production Server**:
   ```bash
   npm start
   ```

### Railway Deployment
The backend is configured for Railway deployment with:
- Automatic proxy trust configuration
- Production environment variables
- Health check endpoint for monitoring

### Render Deployment
Compatible with Render's Node.js environment with proper PORT handling.

## 🧪 Development

### Database Management
```bash
# View database in browser
npm run prisma:studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name
```

### User Management
Create users programmatically:
```bash
node createUser.js
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔍 Monitoring

### Health Check
Monitor service health:
```bash
curl http://localhost:5000/health
```

### Logs
View application logs:
```bash
# Development
npm run dev

# Production
tail -f logs/combined.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the logs for error details
- Verify environment variables are correctly set
- Ensure database connectivity
- Review API endpoint documentation
