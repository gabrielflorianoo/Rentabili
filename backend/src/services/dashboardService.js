// backend/src/services/dashboardService.js
import dashboardRepository from '../repositories/dashboardRepository.js';

class DashboardService {
    async getSummary(userId) {
        try {
            if (!userId) {
                throw new Error('Unauthorized');
            }

            if (process.env.USE_DB !== 'true') {
                // Mock data
                return {
                    totalBalance: 10000.0,
                    activesCount: 5,
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
            console.error(error);
            throw new Error(error.message);
        }
    }

    async getDashboard(userId) {
        try {
            if (!userId) return { error: 'Unauthorized' };

            if (process.env.USE_DB !== 'true') {
                // Mock completo do dashboard
                return {
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

            return {
                summary: {
                    totalBalance,
                    activesCount: actives.length,
                    walletsTotal,
                    investmentsCount: investments.length,
                },
                actives,
                wallets,
                investments,
                recentTransactions: transactions,
            };
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
}

export default new DashboardService();
