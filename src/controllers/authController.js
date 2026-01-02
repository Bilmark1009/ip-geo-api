import prisma from '../config/database.js';
import bcrypt from 'bcrypt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { logger } from '../../server.js';

/**
 * Register new user
 */
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    logger.info(`New user registered: ${email}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email
      },
      token
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login user and return JWT
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.warn(`Failed login attempt for: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      },
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * Validate JWT token
 */
export const validateToken = async (req, res, next) => {
  try {
    // User is already authenticated by middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      user
    });
  } catch (error) {
    logger.error('Token validation error:', error);
    next(error);
  }
};

/**
 * Get IP geolocation info
 */
export const getIPInfo = async (req, res, next) => {
  try {
    let clientIp;
    
    if (req.query.ip) {
      // Use provided IP from query parameter
      clientIp = req.query.ip;
    } else {
      // Get real client IP using Express's req.ip (now works with trust proxy)
      clientIp = req.ip || 
                 req.headers['x-forwarded-for']?.split(',')[0].trim() || 
                 req.socket.remoteAddress;
      
      // Remove IPv6 prefix if present
      if (clientIp && clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.substring(7);
      }
    }

    // Fetch from ipinfo.io
    const url = `https://ipinfo.io/${clientIp}/json`;

    const response = await axios.get(url, {
      timeout: 5000
    });

    logger.info(`IP info fetched: ${clientIp}`);

    res.json({
      success: true,
      data: response.data,
      detectedIp: clientIp
    });
  } catch (error) {
    logger.error('IP Info Error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'IP address not found'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Request timeout - IP service unavailable'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch IP information'
    });
  }
};
