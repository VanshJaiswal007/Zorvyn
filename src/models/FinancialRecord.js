import mongoose from 'mongoose';

const financialRecordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type is required (income or expense)'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Salary',
      'Investment',
      'Bonus',
      'Other Income',
      'Food',
      'Transport',
      'Utilities',
      'Entertainment',
      'Healthcare',
      'Education',
      'Rent',
      'Insurance',
      'Other Expense',
    ],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better query performance
financialRecordSchema.index({ createdBy: 1, date: -1 });
financialRecordSchema.index({ category: 1 });
financialRecordSchema.index({ type: 1 });
financialRecordSchema.index({ date: 1 });

export default mongoose.model('FinancialRecord', financialRecordSchema);
