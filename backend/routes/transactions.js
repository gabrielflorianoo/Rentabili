import TransactionController from '../controllers/transactionController.js';
import express from 'express';

const transactionController = new TransactionController();
const router = express.Router();

router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);
router.post('/', transactionController.create);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.remove);

export default router;
