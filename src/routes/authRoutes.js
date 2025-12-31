import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, getIPInfo, validateToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest, loginSchema, registerSchema, ipSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Rate limiter for login and register endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/register - Register new user
router.post('/register', authLimiter, validateRequest(registerSchema), register);

// POST /api/login - User login with JWT generation
router.post('/login', authLimiter, validateRequest(loginSchema), login);

// GET /api/ip-info - Get IP geolocation information
router.get('/ip-info', getIPInfo);

// GET /api/validate-token - Validate JWT token
router.get('/validate-token', authenticateToken, validateToken);

export default router;
