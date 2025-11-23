import getPrismaClient from '../prismaClient.js';
const prisma = getPrismaClient();

class TransactionController {
    constructor() {
        this.transactions = [
            {
                id: 1,
                amount: 500,
                type: 'income',
                description: 'Depósito inicial',
                date: new Date(),
                userId: 1,
                walletId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                amount: 1000,
                type: 'expense',
                description: 'Compra de ações',
                date: new Date(),
                userId: 1,
                walletId: 1,
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
            return res.json(this.transactions);
        }
        try {
            const transactions = await prisma.transaction.findMany();
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const item = this.transactions.find((t) => t.id === id);
            if (!item)
                return res
                    .status(404)
                    .json({ error: 'Transação não encontrada' });
            return res.json(item);
        }
        try {
            const id = Number(req.params.id);
            const transaction = await prisma.transaction.findUnique({
                where: { id },
            });
            if (!transaction)
                return res
                    .status(404)
                    .json({ error: 'Transação não encontrada' });
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        if (process.env.USE_DB !== 'true') {
            const { amount, type, description, date, userId, walletId } =
                req.body || {};
            if (amount === undefined || !type || !userId)
                return res
                    .status(400)
                    .json({ error: 'amount, type e userId são obrigatórios' });
            const id = this.transactions.length
                ? Math.max(...this.transactions.map((t) => t.id)) + 1
                : 1;
            const newItem = {
                id,
                amount,
                type,
                description: description ?? '',
                date: date ? new Date(date) : new Date(),
                userId,
                walletId: walletId ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.transactions.push(newItem);
            return res.status(201).json(newItem);
        }
        try {
            const { amount, type, description, date, userId, walletId } =
                req.body;
            const newTransaction = await prisma.transaction.create({
                data: { amount, type, description, date, userId, walletId },
            });
            res.status(201).json(newTransaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const idx = this.transactions.findIndex((t) => t.id === id);
            if (idx === -1)
                return res
                    .status(404)
                    .json({ error: 'Transação não encontrada' });
            const { amount, type, description, date, userId, walletId } =
                req.body || {};
            if (amount !== undefined) this.transactions[idx].amount = amount;
            if (type !== undefined) this.transactions[idx].type = type;
            if (description !== undefined)
                this.transactions[idx].description = description;
            if (date !== undefined)
                this.transactions[idx].date = new Date(date);
            if (userId !== undefined) this.transactions[idx].userId = userId;
            if (walletId !== undefined)
                this.transactions[idx].walletId = walletId;
            this.transactions[idx].updatedAt = new Date();
            return res.json(this.transactions[idx]);
        }
        try {
            const id = Number(req.params.id);
            const { amount, type, description, date, userId, walletId } =
                req.body;
            const updatedTransaction = await prisma.transaction.update({
                where: { id },
                data: { amount, type, description, date, userId, walletId },
            });
            res.json(updatedTransaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async remove(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const idx = this.transactions.findIndex((t) => t.id === id);
            if (idx === -1)
                return res
                    .status(404)
                    .json({ error: 'Transação não encontrada' });
            this.transactions.splice(idx, 1);
            return res.status(204).send();
        }
        try {
            const id = Number(req.params.id);
            await prisma.transaction.delete({ where: { id } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default TransactionController;
