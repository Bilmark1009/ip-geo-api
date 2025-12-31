import { z } from 'zod';
import { logger } from '../../server.js';

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const ipSchema = z.object({
  ip: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address format').optional()
});

/**
 * Middleware factory to validate request body against schema
 */
export const validateRequest = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));

      logger.warn(`Validation error: ${JSON.stringify(errors)}`);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Attach validated data to request
    req.validatedData = result.data;
    next();
  } catch (error) {
    logger.error('Validation middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Validation error'
    });
  }
};
