import InvestmentController from '../controllers/investmentController.js';
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const investmentController = new InvestmentController();
const router = express.Router();

router.get('/', authenticateToken, investmentController.getAll);
router.get('/:id', authenticateToken, investmentController.getById);
router.post('/', authenticateToken, investmentController.create);
router.put('/:id', authenticateToken, investmentController.update);
router.delete('/:id', authenticateToken, investmentController.remove);

export default router;
