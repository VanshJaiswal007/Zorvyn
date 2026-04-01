import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense'], { errorMap: () => ({ message: 'Type must be income or expense' }) }),
  category: z.enum([
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
  ]),
  date: z.string().datetime().or(z.date()).optional(),
  description: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.enum([
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
  ]).optional(),
  date: z.string().datetime().or(z.date()).optional(),
  description: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
});

export const filterRecordsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  category: z.string().optional(),
  type: z.enum(['income', 'expense']).optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(['date', 'amount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
