import prisma from '../../prisma/client.js';

class DashboardController {
    async getSummary(req, res) {
        const userId = req.userId;

        try {
            // 1. Busca ativos e saldos
            const actives = await prisma.active.findMany({
                where: { userId },
                include: {
                    balances: { orderBy: { date: 'desc' }, take: 1 }
                }
            });

            // 2. Busca aportes para cálculo de lucro
            const transactions = await prisma.transaction.findMany({
                where: { userId }
            });

            let totalBalance = 0;
            let totalInvested = 0;

            // --- INTELIGÊNCIA DE DADOS: AGRUPAMENTO POR CATEGORIA ---
            // Isso permite saber: "Tenho 30% em Ações e 70% em CDB"
            const allocation = {};

            actives.forEach(active => {
                if (active.balances.length > 0) {
                    const currentVal = Number(active.balances[0].value);
                    totalBalance += currentVal;

                    // Agrupa por tipo (Ex: Ação, Fundo, CDB)
                    if (!allocation[active.type]) {
                        allocation[active.type] = 0;
                    }
                    allocation[active.type] += currentVal;
                }
            });

            // Formata para o gráfico do Front-end
            const allocationChart = Object.keys(allocation).map(type => ({
                name: type,
                value: allocation[type]
            }));

            // Calcula Investido vs Atual
            transactions.forEach(t => {
                if (t.kind === 'Investimento') totalInvested += Number(t.amount);
            });

            const totalGain = totalBalance - totalInvested;
            const profitability = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

            return res.json({
                totalBalance,
                totalInvested,
                totalGain,
                profitability: profitability.toFixed(2),
                activesCount: actives.length,
                allocationChart, // Manda os dados prontos pro gráfico
                lastTransactions: transactions.slice(-5).reverse() // Manda as últimas 5 movimentações
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao processar dados financeiros' });
        }
    }
}

export default new DashboardController();
