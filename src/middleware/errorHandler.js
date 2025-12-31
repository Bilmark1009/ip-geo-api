import { logger } from '../../server.js';

/**
 * Global error handling middleware
 * Must be the last middleware in the app
 */
const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 403;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 403;
    message = 'Token has expired';
  }

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 400;
    message = `Unique constraint failed: ${err.meta?.target}`;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

export default errorHandler;
