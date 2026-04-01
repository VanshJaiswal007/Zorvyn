import * as userService from '../services/userService.js';
import { logAudit } from '../middlewares/errorHandler.js';
import { AppError } from '../utils/errors.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    await logAudit('CREATE', 'User', user._id, req.user._id, { email: user.email });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    await logAudit('UPDATE', 'User', user._id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const assignRole = async (req, res, next) => {
  try {
    const user = await userService.assignRoleToUser(req.params.id, req.body.roleId);

    await logAudit('UPDATE', 'User', user._id, req.user._id, { role: req.body.roleId });

    res.status(200).json({
      success: true,
      message: 'Role assigned successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const user = await userService.updateUserStatus(req.params.id, status);

    await logAudit('UPDATE', 'User', user._id, req.user._id, { status });

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);

    await logAudit('DELETE', 'User', user._id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
