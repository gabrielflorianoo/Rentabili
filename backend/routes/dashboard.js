import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/summary', authenticateToken, dashboardController.getSummary);

export default router;
