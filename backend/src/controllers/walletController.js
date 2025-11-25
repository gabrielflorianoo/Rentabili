// backend/controllers/walletController.js
import walletService from '../services/walletService.js';

class WalletController {
    constructor() {
        this.wallets = [
            {
                id: 1,
                name: 'Carteira Principal',
                balance: 2500,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    async getAll(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const wallets = await walletService.getAll(userId);
            res.json(wallets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const wallet = await walletService.getById(id);
            if (!wallet)
                return res
                    .status(404)
                    .json({ error: 'Carteira não encontrada' });
            res.json(wallet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        // O userId deve vir do token
        const userId = req.user?.userId;

        try {
            const { name, balance } = req.body;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const newWallet = await walletService.create(name, balance, userId);
            res.status(201).json(newWallet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const { name, balance, userId } = req.body;
            const updatedWallet = await walletService.update(
                id,
                name,
                balance,
                userId,
            );
            res.json(updatedWallet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async remove(req, res) {
        try {
            const id = Number(req.params.id);
            await walletService.remove(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default WalletController;
