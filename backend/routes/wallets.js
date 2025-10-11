import WalletController from '../controllers/walletController.js';
import express from 'express';

const walletController = new WalletController();
const router = express.Router();

router.get('/', walletController.getAll);
router.get('/:id', walletController.getById);
router.post('/', walletController.create);
router.put('/:id', walletController.update);
router.delete('/:id', walletController.remove);

export default router;
