import FinancialRecord from '../models/FinancialRecord.js';
import { AppError } from '../utils/errors.js';

export const createRecord = async (recordData) => {
  const record = await FinancialRecord.create(recordData);
  return record.populate('createdBy', 'firstName lastName email');
};

export const getRecords = async (filters = {}, userId = null) => {
  const query = { isDeleted: false };

  // Only show own records unless user is admin
  if (userId) {
    query.createdBy = userId;
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  // Type filter
  if (filters.type) {
    query.type = filters.type;
  }

  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }

  // Amount range filter
  if (filters.minAmount || filters.maxAmount) {
    query.amount = {};
    if (filters.minAmount) {
      query.amount.$gte = filters.minAmount;
    }
    if (filters.maxAmount) {
      query.amount.$lte = filters.maxAmount;
    }
  }

  // Text search in description/notes
  if (filters.search) {
    query.$or = [
      { description: { $regex: filters.search, $options: 'i' } },
      { notes: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  // Sorting
  const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
  const sortBy = filters.sortBy || 'date';
  const sort = { [sortBy]: sortOrder };

  const records = await FinancialRecord.find(query)
    .populate('createdBy', 'firstName lastName email')
    .skip(skip)
    .limit(limit)
    .sort(sort);

  const total = await FinancialRecord.countDocuments(query);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getRecordById = async (id) => {
  const record = await FinancialRecord.findById(id).populate('createdBy', 'firstName lastName email');
  if (!record || record.isDeleted) {
    throw new AppError('Record not found', 404);
  }
  return record;
};

export const updateRecord = async (id, updates) => {
  const record = await FinancialRecord.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'firstName lastName email');

  if (!record || record.isDeleted) {
    throw new AppError('Record not found', 404);
  }

  return record;
};

export const deleteRecord = async (id) => {
  // Soft delete
  const record = await FinancialRecord.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  return record;
};

export const permanentlyDeleteRecord = async (id) => {
  const record = await FinancialRecord.findByIdAndDelete(id);
  if (!record) {
    throw new AppError('Record not found', 404);
  }
  return record;
};
