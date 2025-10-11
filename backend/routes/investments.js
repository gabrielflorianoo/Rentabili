import InvestmentController from '../controllers/investmentController.js';
import express from 'express';

const investmentController = new InvestmentController();
const router = express.Router();

router.get('/', investmentController.getAll);
router.get('/:id', investmentController.getById);
router.post('/', investmentController.create);
router.put('/:id', investmentController.update);
router.delete('/:id', investmentController.remove);

export default router;
