import getPrismaClient from '../prismaClient.js';
const prisma = getPrismaClient();

class InvestmentController {
    constructor() {
        this.investments = [
            {
                id: 1,
                amount: 1000,
                activeId: 1,
                userId: 1,
                date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                kind: 'Investimento',
            },
            {
                id: 2,
                amount: 2000,
                activeId: 2,
                userId: 1,
                date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                kind: 'Investimento',
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
            return res.json(this.investments);
        }
        try {
            const prisma = getPrismaClient();
            const investments = await prisma.investment.findMany();
            res.json(investments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const item = this.investments.find((i) => i.id === id);
            if (!item)
                return res
                    .status(404)
                    .json({ error: 'Investimento não encontrado' });
            return res.json(item);
        }
        try {
            const prisma = getPrismaClient();
            const id = Number(req.params.id);
            const investment = await prisma.investment.findUnique({
                where: { id },
            });
            if (!investment)
                return res
                    .status(404)
                    .json({ error: 'Investimento não encontrado' });
            res.json(investment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        if (process.env.USE_DB !== 'true') {
            const { amount, activeId, userId, date } = req.body || {};
            if (amount === undefined || !activeId || !userId)
                return res
                    .status(400)
                    .json({
                        error: 'amount, activeId e userId são obrigatórios',
                    });
            const id = this.investments.length
                ? Math.max(...this.investments.map((i) => i.id)) + 1
                : 1;
            const newItem = {
                id,
                amount,
                activeId,
                userId,
                date: date ? new Date(date) : new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.investments.push(newItem);
            return res.status(201).json(newItem);
        }
        try {
            const prisma = getPrismaClient();
            const { amount, activeId, date, kind } = req.body;
            // userId deve vir do token autenticado (req.user)
            const userId = req.user?.id ?? req.body?.userId;
            if (!userId) return res.status(400).json({ error: 'Usuário não autenticado' });

            // Tenta criar diretamente incluindo `kind`. Se o Prisma Client estiver desatualizado
            // e não reconhecer o campo, capturamos o erro e fazemos um fallback seguro.
            try {
                const newInvestment = await prisma.investment.create({
                    data: { amount, activeId, userId, date, kind: kind || 'Investimento' },
                });
                return res.status(201).json(newInvestment);
            } catch (innerErr) {
                // Se o erro indicar argumento desconhecido (campo não presente no client), fazemos fallback
                if (innerErr && String(innerErr.message).includes('Unknown argument `kind`')) {
                    // Cria sem o campo `kind` (o DB tem default 'Investimento')
                    const newInvestment = await prisma.investment.create({
                        data: { amount, activeId, userId, date },
                    });

                    // Se foi passado um kind diferente do default, aplicamos via SQL raw
                    if (kind && kind !== 'Investimento') {
                        // Usa $executeRaw com parâmetros para evitar SQL injection
                        await prisma.$executeRaw`UPDATE "Investment" SET "kind" = ${kind} WHERE id = ${newInvestment.id}`;
                        // Recarrega o registro recém atualizado
                        const refreshed = await prisma.investment.findUnique({ where: { id: newInvestment.id } });
                        return res.status(201).json(refreshed);
                    }

                    return res.status(201).json(newInvestment);
                }

                // Caso seja outro erro, repropaga
                throw innerErr;
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const idx = this.investments.findIndex((i) => i.id === id);
            if (idx === -1)
                return res
                    .status(404)
                    .json({ error: 'Investimento não encontrado' });
            const { amount, activeId, userId, date } = req.body || {};
            if (amount !== undefined) this.investments[idx].amount = amount;
            if (activeId !== undefined)
                this.investments[idx].activeId = activeId;
            if (userId !== undefined) this.investments[idx].userId = userId;
            if (date !== undefined) this.investments[idx].date = new Date(date);
            this.investments[idx].updatedAt = new Date();
            return res.json(this.investments[idx]);
        }
        try {
            const prisma = getPrismaClient();
            const id = Number(req.params.id);
            const { amount, activeId, date, kind } = req.body;
            const userId = req.user?.id ?? req.body?.userId;

            try {
                const updatedInvestment = await prisma.investment.update({
                    where: { id },
                    data: { amount, activeId, userId, date, ...(kind ? { kind } : {}) },
                });
                return res.json(updatedInvestment);
            } catch (innerErr) {
                if (innerErr && String(innerErr.message).includes('Unknown argument `kind`')) {
                    // Atualiza sem o campo `kind` e, se necessário, aplica via raw SQL
                    const updatedInvestment = await prisma.investment.update({
                        where: { id },
                        data: { amount, activeId, userId, date },
                    });
                    if (kind) {
                        await prisma.$executeRaw`UPDATE "Investment" SET "kind" = ${kind} WHERE id = ${id}`;
                    }
                    const refreshed = await prisma.investment.findUnique({ where: { id } });
                    return res.json(refreshed);
                }
                throw innerErr;
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async remove(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const idx = this.investments.findIndex((i) => i.id === id);
            if (idx === -1)
                return res
                    .status(404)
                    .json({ error: 'Investimento não encontrado' });
            this.investments.splice(idx, 1);
            return res.status(204).send();
        }
        try {
            const prisma = getPrismaClient();
            const id = Number(req.params.id);
            await prisma.investment.delete({ where: { id } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default InvestmentController;
