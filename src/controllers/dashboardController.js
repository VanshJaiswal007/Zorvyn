import * as dashboardService from '../services/dashboardService.js';

export const getSummary = async (req, res, next) => {
  try {
    // Determine if user should see all data (Admin/Analyst) or only their own
    const userRole = req.user.role?.name;
    const userId = ['Admin', 'Analyst'].includes(userRole) ? null : req.user._id;

    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const summary = await dashboardService.getDashboardSummary(userId, filters);

    res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved',
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategorySummary = async (req, res, next) => {
  try {
    const userRole = req.user.role?.name;
    const userId = ['Admin', 'Analyst'].includes(userRole) ? null : req.user._id;

    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const summary = await dashboardService.getCategorySummary(userId, filters);

    res.status(200).json({
      success: true,
      message: 'Category summary retrieved',
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const userRole = req.user.role?.name;
    const userId = ['Admin', 'Analyst'].includes(userRole) ? null : req.user._id;

    const trends = await dashboardService.getMonthlyTrends(userId);

    res.status(200).json({
      success: true,
      message: 'Monthly trends retrieved',
      data: { trends },
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyTrends = async (req, res, next) => {
  try {
    const userRole = req.user.role?.name;
    const userId = ['Admin', 'Analyst'].includes(userRole) ? null : req.user._id;

    const trends = await dashboardService.getWeeklyTrends(userId);

    res.status(200).json({
      success: true,
      message: 'Weekly trends retrieved',
      data: { trends },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const userRole = req.user.role?.name;
    const userId = ['Admin', 'Analyst'].includes(userRole) ? null : req.user._id;

    const limit = req.query.limit || 10;

    const activity = await dashboardService.getRecentActivity(userId, limit);

    res.status(200).json({
      success: true,
      message: 'Recent activity retrieved',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};

export const getTypeSummary = async (req, res, next) => {
  try {
    const userRole = req.user.role?.name;
    const userId = ['Admin', 'Analyst'].includes(userRole) ? null : req.user._id;

    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const summary = await dashboardService.getTypeSummary(userId, filters);

    res.status(200).json({
      success: true,
      message: 'Type summary retrieved',
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};
