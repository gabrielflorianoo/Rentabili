import getPrismaClient from '../../prismaClient.js';

const prisma = getPrismaClient();

class DashboardRepository {
    async findActivesWithBalances(userId) {
        try {
            if (!prisma) {
                console.warn('[Dashboard Repository] Prisma not initialized, returning empty array');
                return [];
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
            return actives;
        } catch (error) {
            console.error('Dashboard Repository - findActivesWithBalances:', error);
            throw new Error(error.message || 'Erro ao buscar ativos com saldos');
        }
    }

    async findActivesWithLatestBalances(userId) {
        try {
            if (!prisma) {
                console.warn('[Dashboard Repository] Prisma not initialized, returning empty array');
                return [];
            }
            
            const actives = await prisma.active.findMany({
                where: { userId },
                include: {
                    balances: { 
                        orderBy: { date: 'desc' }, 
                        take: 1 
                    },
                    investments: true,
                },
            });

            return actives.map((a) => {
                // Se tem saldo histórico, usar isso
                if (a.balances && a.balances.length > 0) {
                    return {
                        id: a.id,
                        name: a.name,
                        type: a.type,
                        latestBalance: Number(a.balances[0].value),
                    };
                }
                
                // Senão, calcular baseado nos investimentos
                const totalInvested = (a.investments || [])
                    .filter(inv => inv.kind !== 'Renda')
                    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
                
                const totalRenda = (a.investments || [])
                    .filter(inv => inv.kind === 'Renda')
                    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
                
                return {
                    id: a.id,
                    name: a.name,
                    type: a.type,
                    latestBalance: totalInvested + totalRenda,
                };
            });
        } catch (error) {
            console.error('Dashboard Repository - findActivesWithLatestBalances:', error);
            throw new Error(error.message || 'Erro ao buscar saldos atualizados');
        }
    }

    async findWallets(userId) {
        try {
            if (!prisma) {
                console.warn('[Dashboard Repository] Prisma not initialized, returning empty array');
                return [];
            }
            
            return await prisma.wallet.findMany({ 
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            console.error('Dashboard Repository - findWallets:', error);
            throw new Error(error.message || 'Erro ao buscar carteiras');
        }
    }

    async findTransactions(userId) {
        try {
            if (!prisma) {
                console.warn('[Dashboard Repository] Prisma not initialized, returning empty array');
                return [];
            }
            
            return await prisma.transaction.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 10,
                include: {
                    wallet: true,
                }
            });
        } catch (error) {
            console.error('Dashboard Repository - findTransactions:', error);
            throw new Error(error.message || 'Erro ao buscar transações');
        }
    }

    async findInvestments(userId) {
        try {
            if (!prisma) {
                console.warn('[Dashboard Repository] Prisma not initialized, returning empty array');
                return [];
            }
            
            return await prisma.investment.findMany({
                where: { userId },
                include: {
                    active: true,
                },
                orderBy: { date: 'desc' },
            });
        } catch (error) {
            console.error('Dashboard Repository - findInvestments:', error);
            throw new Error(error.message || 'Erro ao buscar investimentos');
        }
    }

    async findBalanceHistory(userId, months = 6) {
        try {
            if (!prisma) {
                console.warn('[Dashboard Repository] Prisma not initialized, returning empty array');
                return [];
            }
            
            const dateFrom = new Date();
            dateFrom.setMonth(dateFrom.getMonth() - months);
            
            const balances = await prisma.historicalBalance.findMany({
                where: {
                    active: { userId },
                    date: { gte: dateFrom },
                },
                orderBy: { date: 'asc' },
                include: {
                    active: true,
                },
            });
            
            return balances;
        } catch (error) {
            console.error('Dashboard Repository - findBalanceHistory:', error);
            throw new Error(error.message || 'Erro ao buscar histórico de balances');
        }
    }
}

export default new DashboardRepository();