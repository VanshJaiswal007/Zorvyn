import AuditLog from '../models/AuditLog.js';

export const logAudit = async (action, resourceType, resourceId, userId, changes = null) => {
  try {
    await AuditLog.create({
      action,
      resourceType,
      resourceId,
      userId,
      changes,
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    err.statusCode = 400;
    err.message = message;
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} is already in use`;
    err.statusCode = 400;
    err.message = message;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    err.statusCode = 401;
    err.message = message;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    err.statusCode = 401;
    err.message = message;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
