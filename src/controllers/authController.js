import User from '../models/User.js';
import Role from '../models/Role.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { logAudit } from '../middlewares/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // Get default Viewer role
    const viewerRole = await Role.findOne({ name: 'Viewer' });
    if (!viewerRole) {
      return next(new AppError('Default role not found. Please seed the database.', 500));
    }

    // Create user with Viewer role (default)
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: viewerRole._id,
      status: 'active',
    });

    await user.populate('role');

    const token = generateToken(user._id);
    await logAudit('REGISTER', 'User', user._id, user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role?.name,
          status: user.status,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password').populate('role');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return next(new AppError('Your account is inactive', 403));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = generateToken(user._id);
    await logAudit('LOGIN', 'Auth', user._id, user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role?.name,
          status: user.status,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('role');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role?.name,
          status: user.status,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logAudit('LOGOUT', 'Auth', req.user._id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
