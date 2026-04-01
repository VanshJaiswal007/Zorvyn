import * as recordService from '../services/recordService.js';
import { logAudit } from '../middlewares/errorHandler.js';
import mongoose from 'mongoose';

export const createRecord = async (req, res, next) => {
  try {
    const recordData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const record = await recordService.createRecord(recordData);

    await logAudit('CREATE', 'FinancialRecord', record._id, req.user._id, {
      amount: record.amount,
      type: record.type,
    });

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecords = async (req, res, next) => {
  try {
    // Determine if user should see all records (Admin/Analyst) or only their own
    const userRole = req.user.role?.name;
    const userId = ['Admin', 'Analyst'].includes(userRole) ? null : req.user._id;

    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      category: req.query.category,
      type: req.query.type,
      minAmount: req.query.minAmount,
      maxAmount: req.query.maxAmount,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    const result = await recordService.getRecords(filters, userId);

    res.status(200).json({
      success: true,
      message: 'Records retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);

    // Check ownership (only allow access to own records unless Admin)
    const userRole = req.user.role?.name;
    if (userRole !== 'Admin' && record.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this record',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Record retrieved successfully',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);

    // Check ownership (only allow updates to own records unless Admin)
    const userRole = req.user.role?.name;
    if (userRole !== 'Admin' && record.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this record',
      });
    }

    const updatedRecord = await recordService.updateRecord(req.params.id, {
      ...req.body,
      updatedAt: new Date(),
    });

    await logAudit('UPDATE', 'FinancialRecord', updatedRecord._id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      data: { record: updatedRecord },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);

    // Check ownership
    const userRole = req.user.role?.name;
    if (userRole !== 'Admin' && record.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this record',
      });
    }

    const deletedRecord = await recordService.deleteRecord(req.params.id);

    await logAudit('DELETE', 'FinancialRecord', deletedRecord._id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
      data: { record: deletedRecord },
    });
  } catch (error) {
    next(error);
  }
};
