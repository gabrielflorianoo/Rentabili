// investmentRoutes.js (Versão Corrigida)

import InvestmentController from '../controllers/investmentController.js';
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const investmentController = new InvestmentController();
const router = express.Router();

// 1. Custom routes for aggregated data (MAIS ESPECÍFICAS: devem vir primeiro)
router.get(
    '/total-invested',
    authenticateToken,
    investmentController.getTotalInvested,
);
router.get('/gain-loss', authenticateToken, investmentController.getGainLoss);

// 2. Rotas Genéricas com ID (MENOS ESPECÍFICAS: devem vir por último)
router.get('/:id', authenticateToken, investmentController.getById); // Agora só casará com números/IDs

// Outras rotas permanecem no final ou em ordem lógica
router.get('/', authenticateToken, investmentController.getAll);
router.post('/', authenticateToken, investmentController.create);
router.put('/:id', authenticateToken, investmentController.update);
router.delete('/:id', authenticateToken, investmentController.remove);

export default router;
