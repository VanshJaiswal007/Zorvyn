import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
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
 *     responses:
 *       200:
 *         description: Dashboard summary with totals
 */
router.get('/summary', protect, authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getSummary);

/**
 * @swagger
 * /dashboard/category-summary:
 *   get:
 *     summary: Get category-wise summary
 *     tags: [Dashboard]
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
 *     responses:
 *       200:
 *         description: Summary by category
 */
router.get('/category-summary', protect, authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getCategorySummary);

/**
 * @swagger
 * /dashboard/monthly-trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trend data
 */
router.get('/monthly-trends', protect, authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getMonthlyTrends);

/**
 * @swagger
 * /dashboard/weekly-trends:
 *   get:
 *     summary: Get weekly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly trend data
 */
router.get('/weekly-trends', protect, authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getWeeklyTrends);

/**
 * @swagger
 * /dashboard/recent-activity:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent activity
 */
router.get('/recent-activity', protect, authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getRecentActivity);

/**
 * @swagger
 * /dashboard/type-summary:
 *   get:
 *     summary: Get summary by type (income/expense)
 *     tags: [Dashboard]
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
 *     responses:
 *       200:
 *         description: Summary by type
 */
router.get('/type-summary', protect, authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getTypeSummary);

export default router;
