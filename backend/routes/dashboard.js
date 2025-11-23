import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const dashboardController = new DashboardController();

// Rota antiga para resumo (compatibilidade)
router.get('/summary', authenticateToken, dashboardController.getSummary);

// Nova rota: GET /dashboard -> retorna todos os dados do dashboard do usuário
router.get('/', authenticateToken, dashboardController.getDashboard);

export default router;
