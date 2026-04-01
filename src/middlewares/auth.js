import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from headers
    if (req.headers.authorization) {
      const auth = req.headers.authorization;
      // Handle both "Bearer <token>" and just "<token>" formats
      if (auth.startsWith('Bearer ')) {
        token = auth.slice(7); // Remove "Bearer " prefix
      } else {
        token = auth; // Use the token as-is (from Swagger)
      }
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new AppError('Token is invalid or expired', 401));
    }

    // Get user from token
    const user = await User.findById(decoded.userId).populate('role');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return next(new AppError('Your account is inactive. Contact admin', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const userRole = req.user.role?.name;
      if (!allowedRoles.includes(userRole)) {
        return next(new AppError(`Access denied. Required roles: ${allowedRoles.join(', ')}`, 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (!req.user.role?.permissions[permission]) {
        return next(new AppError(`You don't have permission to ${permission}`, 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
