import getPrismaClient from '../prismaClient.js';
const prisma = getPrismaClient();

class DashboardController {
    constructor() {
        this.getSummary = this.getSummary.bind(this);
        this.getDashboard = this.getDashboard.bind(this);
    }

    async getSummary(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (process.env.USE_DB !== 'true') {
                // Mock data
                return res.json({
                    totalBalance: 10000.0,
                    activesCount: 5,
                });
            }

            const actives = await prisma.active.findMany({
                where: { userId },
                include: {
                    balances: {
                        orderBy: { date: 'desc' },
                        take: 1,
                    },
                },
            });

            let totalBalance = 0;
            actives.forEach((active) => {
                if (active.balances.length > 0) {
                    totalBalance += Number(active.balances[0].value);
                }
            });

            res.json({
                totalBalance,
                activesCount: actives.length,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Retorna todos os dados do dashboard para o usuário autenticado
    async getDashboard(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            if (process.env.USE_DB !== 'true') {
                // Mock completo do dashboard
                return res.json({
                    summary: {
                        totalBalance: 10000.0,
                        activesCount: 5,
                        walletsTotal: 2500,
                    },
                    actives: [
                        {
                            id: 1,
                            name: 'Ações X',
                            type: 'stock',
                            latestBalance: 2000,
                        },
                        {
                            id: 2,
                            name: 'FII Y',
                            type: 'fii',
                            latestBalance: 1500,
                        },
                    ],
                    wallets: [
                        { id: 1, name: 'Carteira Principal', balance: 2500 },
                    ],
                    investments: [{ id: 1, amount: 1000, activeId: 1 }],
                    recentTransactions: [
                        {
                            id: 1,
                            amount: 500,
                            type: 'income',
                            description: 'Depósito',
                        },
                    ],
                });
            }

            // Buscar ativos com último balanço
            const actives = await prisma.active.findMany({
                where: { userId },
                include: {
                    balances: { orderBy: { date: 'desc' }, take: 1 },
                },
            });

            // Mapear latestBalance
            const activesWithLatest = actives.map((a) => ({
                id: a.id,
                name: a.name,
                type: a.type,
                latestBalance:
                    a.balances && a.balances.length
                        ? Number(a.balances[0].value)
                        : 0,
            }));

            const wallets = await prisma.wallet.findMany({ where: { userId } });

            const transactions = await prisma.transaction.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 10,
            });

            const investments = await prisma.investment.findMany({
                where: { userId },
            });

            const totalActives = activesWithLatest.reduce(
                (s, a) => s + a.latestBalance,
                0,
            );
            const walletsTotal = wallets.reduce(
                (s, w) => s + Number(w.balance || 0),
                0,
            );
            const totalBalance = totalActives + walletsTotal;

            res.json({
                summary: {
                    totalBalance,
                    activesCount: activesWithLatest.length,
                    walletsTotal,
                    investmentsCount: investments.length,
                },
                actives: activesWithLatest,
                wallets,
                investments,
                recentTransactions: transactions,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default DashboardController;
