import dashboardRepository from '../repositories/dashboardRepository.js';

class DashboardService {
    async getSummary(userId) {
        try {
            if (!userId) {
                throw new Error('Unauthorized');
            }

            if (process.env.USE_DB !== 'true') {
                // Mock data mais realista
                return {
                    totalBalance: 25000.00,
                    activesCount: 5,
                    walletsTotal: 5000.00,
                    investmentsCount: 3,
                };
            }

            const actives =
                await dashboardRepository.findActivesWithBalances(userId);

            let totalBalance = 0;
            actives.forEach((active) => {
                if (active.balances.length > 0) {
                    totalBalance += Number(active.balances[0].value);
                }
            });

            return {
                totalBalance,
                activesCount: actives.length,
            };
        } catch (error) {
            console.error('DashboardService - getSummary:', error);
            throw new Error(error.message || 'Erro ao obter resumo do dashboard');
        }
    }

    async getDashboard(userId) {
        try {
            if (!userId) {
                throw new Error('Unauthorized');
            }

            if (process.env.USE_DB !== 'true') {
                // Mock completo do dashboard com dados mais realistas
                return {
                    summary: {
                        totalBalance: 25000.00,
                        activesCount: 5,
                        walletsTotal: 5000.00,
                        investmentsCount: 3,
                    },
                    allocationChart: [
                        {
                            name: 'Ações',
                            value: 45,
                        },
                        {
                            name: 'FII',
                            value: 30,
                        },
                        {
                            name: 'Renda Fixa',
                            value: 15,
                        },
                        {
                            name: 'Criptomoedas',
                            value: 10,
                        },
                    ],
                    evolutionChart: [
                        { month: 'Jan', value: 18000 },
                        { month: 'Fev', value: 19500 },
                        { month: 'Mar', value: 21000 },
                        { month: 'Abr', value: 22500 },
                        { month: 'Mai', value: 24000 },
                        { month: 'Jun', value: 25000 },
                    ],
                    actives: [
                        {
                            id: 1,
                            name: 'PETR4',
                            type: 'stock',
                            latestBalance: 5000,
                        },
                        {
                            id: 2,
                            name: 'MXRF11',
                            type: 'fii',
                            latestBalance: 4000,
                        },
                        {
                            id: 3,
                            name: 'Tesouro Direto',
                            type: 'fixed-income',
                            latestBalance: 6000,
                        },
                        {
                            id: 4,
                            name: 'Bitcoin',
                            type: 'crypto',
                            latestBalance: 3000,
                        },
                        {
                            id: 5,
                            name: 'Ethereum',
                            type: 'crypto',
                            latestBalance: 2000,
                        },
                    ],
                    wallets: [
                        { id: 1, name: 'Carteira Principal', balance: 5000.00 },
                    ],
                    investments: [
                        {
                            id: 1,
                            amount: 1000,
                            activeId: 1,
                            active: { name: 'PETR4' },
                            date: new Date(),
                            kind: 'Compra',
                        },
                        {
                            id: 2,
                            amount: 2000,
                            activeId: 2,
                            active: { name: 'MXRF11' },
                            date: new Date(),
                            kind: 'Compra',
                        },
                        {
                            id: 3,
                            amount: 1500,
                            activeId: 3,
                            active: { name: 'Tesouro' },
                            date: new Date(),
                            kind: 'Aplicação',
                        },
                    ],
                    recentTransactions: [
                        {
                            id: 1,
                            amount: 1000.00,
                            type: 'income',
                            description: 'Depósito',
                            date: new Date(),
                        },
                        {
                            id: 2,
                            amount: 500.00,
                            type: 'expense',
                            description: 'Taxa de investimento',
                            date: new Date(),
                        },
                        {
                            id: 3,
                            amount: 250.00,
                            type: 'income',
                            description: 'Dividendos',
                            date: new Date(),
                        },
                    ],
                };
            }

            const [actives, wallets, transactions, investments] =
                await Promise.all([
                    dashboardRepository.findActivesWithLatestBalances(userId),
                    dashboardRepository.findWallets(userId),
                    dashboardRepository.findTransactions(userId),
                    dashboardRepository.findInvestments(userId),
                ]);

            const totalActives = actives.reduce(
                (s, a) => s + a.latestBalance,
                0,
            );
            const walletsTotal = wallets.reduce(
                (s, w) => s + Number(w.balance || 0),
                0,
            );
            const totalBalance = totalActives + walletsTotal;

            // Criar gráfico de alocação
            const allocationChart = actives.map((a) => ({
                name: a.name,
                value: totalBalance > 0 ? ((a.latestBalance / totalBalance) * 100).toFixed(2) : 0,
            }));

            // Criar gráfico de evolução (mock simples)
            const evolutionChart = Array.from({ length: 6 }, (_, i) => ({
                month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][i],
                value: Math.round(totalBalance * (0.8 + (i * 0.04))),
            }));

            return {
                summary: {
                    totalBalance,
                    activesCount: actives.length,
                    walletsTotal,
                    investmentsCount: investments.length,
                },
                allocationChart,
                evolutionChart,
                actives,
                wallets,
                investments,
                recentTransactions: transactions,
            };
        } catch (error) {
            console.error('DashboardService - getDashboard:', error);
            throw new Error(error.message || 'Erro ao processar dados financeiros');
        }
    }
}

export default new DashboardService();
