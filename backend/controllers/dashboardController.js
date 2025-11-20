import getPrisma from '../prismaClient.js';

class DashboardController {
    constructor() {
        this.getSummary = this.getSummary.bind(this);
    }

    async getSummary(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            if (process.env.USE_DB !== 'true') {
                // Mock data
                return res.json({
                    totalBalance: 10000.00,
                    activesCount: 5
                });
            }

            const prisma = await getPrisma();
            const actives = await prisma.active.findMany({
                where: { userId },
                include: {
                    balances: {
                        orderBy: { date: 'desc' },
                        take: 1
                    }
                }
            });

            let totalBalance = 0;
            actives.forEach(active => {
                if (active.balances.length > 0) {
                    totalBalance += Number(active.balances[0].value);
                }
            });

            res.json({
                totalBalance,
                activesCount: actives.length
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default DashboardController;
