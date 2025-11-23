import getPrismaClient from '../prismaClient.js';
const prisma = getPrismaClient();

// Create a new historical balance for an active
export async function createHistoricalBalance(req, res) {
    const { date, value, activeId } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    try {
        // Verify that the active belongs to the user
        const active = await prisma.active.findUnique({
            where: {
                id: parseInt(activeId),
                userId,
            },
        });

        if (!active) {
            return res
                .status(404)
                .json({
                    error: 'Active not found or does not belong to the user',
                });
        }

        const historicalBalance = await prisma.historicalBalance.create({
            data: {
                date: new Date(date),
                value: parseFloat(value),
                activeId: parseInt(activeId),
            },
        });
        res.status(201).json(historicalBalance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get all historical balances for a specific active
export async function getHistoricalBalancesByActive(req, res) {
    const { activeId } = req.params;
    const userId = req.user.id;

    try {
        // Verify that the active belongs to the user
        const active = await prisma.active.findUnique({
            where: {
                id: parseInt(activeId),
                userId,
            },
        });

        if (!active) {
            return res
                .status(404)
                .json({
                    error: 'Active not found or does not belong to the user',
                });
        }

        const historicalBalances = await prisma.historicalBalance.findMany({
            where: { activeId: parseInt(activeId) },
            orderBy: { date: 'asc' },
        });
        res.status(200).json(historicalBalances);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get a single historical balance by ID
export async function getHistoricalBalanceById(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const historicalBalance = await prisma.historicalBalance.findUnique({
            where: { id: parseInt(id) },
            include: {
                active: true,
            },
        });

        if (!historicalBalance || historicalBalance.active.userId !== userId) {
            return res
                .status(404)
                .json({
                    error: 'Historical balance not found or does not belong to the user',
                });
        }
        res.status(200).json(historicalBalance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Update a historical balance
export async function updateHistoricalBalance(req, res) {
    const { id } = req.params;
    const { date, value } = req.body;
    const userId = req.user.id;

    try {
        const existingBalance = await prisma.historicalBalance.findUnique({
            where: { id: parseInt(id) },
            include: { active: true },
        });

        if (!existingBalance || existingBalance.active.userId !== userId) {
            return res
                .status(404)
                .json({
                    error: 'Historical balance not found or does not belong to the user',
                });
        }

        const historicalBalance = await prisma.historicalBalance.update({
            where: { id: parseInt(id) },
            data: {
                date: date ? new Date(date) : undefined,
                value: value ? parseFloat(value) : undefined,
            },
        });
        res.status(200).json(historicalBalance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a historical balance
export async function deleteHistoricalBalance(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const existingBalance = await prisma.historicalBalance.findUnique({
            where: { id: parseInt(id) },
            include: { active: true },
        });

        if (!existingBalance || existingBalance.active.userId !== userId) {
            return res
                .status(404)
                .json({
                    error: 'Historical balance not found or does not belong to the user',
                });
        }

        await prisma.historicalBalance.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
