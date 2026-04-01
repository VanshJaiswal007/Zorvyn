import express from 'express';
import * as recordController from '../controllers/recordController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validation.js';
import { createRecordSchema, updateRecordSchema, filterRecordsSchema } from '../validators/recordValidator.js';

const router = express.Router();

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create financial record (Analyst, Admin)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category]
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  protect,
  authorize('Analyst', 'Admin'),
  validateRequest(createRecordSchema),
  recordController.createRecord
);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get financial records (all authenticated users)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - name: minAmount
 *         in: query
 *         schema:
 *           type: number
 *       - name: maxAmount
 *         in: query
 *         schema:
 *           type: number
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [date, amount]
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of records
 */
router.get('/', protect, recordController.getRecords);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record data
 *       404:
 *         description: Record not found
 */
router.get('/:id', protect, recordController.getRecordById);

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     summary: Update record (Analyst, Admin)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 */
router.patch('/:id', protect, authorize('Analyst', 'Admin'), recordController.updateRecord);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete record (Analyst, Admin)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete('/:id', protect, authorize('Analyst', 'Admin'), recordController.deleteRecord);

export default router;
