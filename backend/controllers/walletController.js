import getPrismaClient from '../prismaClient.js';
const prisma = getPrismaClient();

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
        if (process.env.USE_DB !== 'true') {
            return res.json(this.wallets);
        }
        try {
            const wallets = await prisma.wallet.findMany();
            res.json(wallets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const item = this.wallets.find((w) => w.id === id);
            if (!item)
                return res
                    .status(404)
                    .json({ error: 'Carteira não encontrada' });
            return res.json(item);
        }
        try {
            const id = Number(req.params.id);
            const wallet = await prisma.wallet.findUnique({ where: { id } });
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
        if (process.env.USE_DB !== 'true') {
            const { name, balance, userId } = req.body || {};
            if (!name || !userId)
                return res
                    .status(400)
                    .json({ error: 'name e userId são obrigatórios' });
            const id = this.wallets.length
                ? Math.max(...this.wallets.map((w) => w.id)) + 1
                : 1;
            const newItem = {
                id,
                name,
                balance: balance ?? 0,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.wallets.push(newItem);
            return res.status(201).json(newItem);
        }
        try {
            const { name, balance, userId } = req.body;
            const newWallet = await prisma.wallet.create({
                data: { name, balance, userId },
            });
            res.status(201).json(newWallet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const idx = this.wallets.findIndex((w) => w.id === id);
            if (idx === -1)
                return res
                    .status(404)
                    .json({ error: 'Carteira não encontrada' });
            const { name, balance, userId } = req.body || {};
            if (name !== undefined) this.wallets[idx].name = name;
            if (balance !== undefined) this.wallets[idx].balance = balance;
            if (userId !== undefined) this.wallets[idx].userId = userId;
            this.wallets[idx].updatedAt = new Date();
            return res.json(this.wallets[idx]);
        }
        try {
            const id = Number(req.params.id);
            const { name, balance, userId } = req.body;
            const updatedWallet = await prisma.wallet.update({
                where: { id },
                data: { name, balance, userId },
            });
            res.json(updatedWallet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async remove(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const idx = this.wallets.findIndex((w) => w.id === id);
            if (idx === -1)
                return res
                    .status(404)
                    .json({ error: 'Carteira não encontrada' });
            this.wallets.splice(idx, 1);
            return res.status(204).send();
        }
        try {
            const id = Number(req.params.id);
            await prisma.wallet.delete({ where: { id } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default WalletController;
