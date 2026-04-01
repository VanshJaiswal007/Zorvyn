import FinancialRecord from '../models/FinancialRecord.js';

export const getDashboardSummary = async (userId = null, filters = {}) => {
  const matchStage = { isDeleted: false };

  if (userId) {
    matchStage.createdBy = userId;
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    matchStage.date = {};
    if (filters.startDate) {
      matchStage.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      matchStage.date.$lte = new Date(filters.endDate);
    }
  }

  const summary = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
        totalRecords: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpense: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpense'] },
        totalRecords: 1,
        avgAmount: { $round: ['$avgAmount', 2] },
      },
    },
  ]);

  return summary[0] || {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    totalRecords: 0,
    avgAmount: 0,
  };
};

export const getCategorySummary = async (userId = null, filters = {}) => {
  const matchStage = { isDeleted: false };

  if (userId) {
    matchStage.createdBy = userId;
  }

  if (filters.startDate || filters.endDate) {
    matchStage.date = {};
    if (filters.startDate) {
      matchStage.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      matchStage.date.$lte = new Date(filters.endDate);
    }
  }

  const summary = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        type: { $first: '$type' },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  return summary;
};

export const getMonthlyTrends = async (userId = null) => {
  const matchStage = { isDeleted: false };

  if (userId) {
    matchStage.createdBy = userId;
  }

  const trends = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
        records: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 },
    },
    {
      $limit: 12,
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalIncome: 1,
        totalExpense: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpense'] },
        records: 1,
      },
    },
  ]);

  return trends;
};

export const getWeeklyTrends = async (userId = null) => {
  const matchStage = { isDeleted: false };

  if (userId) {
    matchStage.createdBy = userId;
  }

  const trends = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          week: { $week: '$date' },
        },
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
        records: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': -1, '_id.week': -1 },
    },
    {
      $limit: 12,
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        week: '$_id.week',
        totalIncome: 1,
        totalExpense: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpense'] },
        records: 1,
      },
    },
  ]);

  return trends;
};

export const getRecentActivity = async (userId = null, limit = 10) => {
  const matchStage = { isDeleted: false };

  if (userId) {
    matchStage.createdBy = userId;
  }

  const records = await FinancialRecord.find(matchStage)
    .populate('createdBy', 'firstName lastName email')
    .sort({ date: -1 })
    .limit(limit);

  return records;
};

export const getTypeSummary = async (userId = null, filters = {}) => {
  const matchStage = { isDeleted: false };

  if (userId) {
    matchStage.createdBy = userId;
  }

  if (filters.startDate || filters.endDate) {
    matchStage.date = {};
    if (filters.startDate) {
      matchStage.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      matchStage.date.$lte = new Date(filters.endDate);
    }
  }

  const summary = await FinancialRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        total: { $round: ['$total', 2] },
        count: 1,
        avgAmount: { $round: ['$avgAmount', 2] },
      },
    },
  ]);

  return summary;
};
