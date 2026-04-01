import User from '../models/User.js';
import Role from '../models/Role.js';
import { AppError } from '../utils/errors.js';

export const getAllUsers = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { email: { $regex: filters.search, $options: 'i' } },
      { firstName: { $regex: filters.search, $options: 'i' } },
      { lastName: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .populate('role')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).populate('role');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const createUser = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  // Check if role exists
  const role = await Role.findById(userData.role);
  if (!role) {
    throw new AppError('Role not found', 404);
  }

  const user = await User.create(userData);
  await user.populate('role');
  return user;
};

export const updateUser = async (id, updates) => {
  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate('role');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const assignRoleToUser = async (userId, roleId) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError('Role not found', 404);
  }

  const user = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true }).populate('role');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const updateUserStatus = async (userId, status) => {
  if (!['active', 'inactive'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).populate('role');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};
