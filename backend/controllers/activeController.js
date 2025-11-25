import getPrismaClient from '../prismaClient.js';
const prisma = getPrismaClient();

// Create a new active
export async function createActive(req, res) {
    const { name, type } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    try {
        const active = await prisma.active.create({
            data: {
                name,
                type,
                userId,
            },
        });
        res.status(201).json(active);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get all actives for a user
export async function getActives(req, res) {
    const userId = req.user.id;

    try {
        const actives = await prisma.active.findMany({
            where: { userId },
            include: {
                balances: true,
                investments: true,
            },
        });
        res.status(200).json(actives);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get a single active by ID
export async function getActiveById(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const active = await prisma.active.findUnique({
            where: {
                id: parseInt(id),
                userId,
            },
            include: {
                balances: true,
                investments: true,
            },
        });

        if (!active) {
            return res.status(404).json({ error: 'Active not found' });
        }
        res.status(200).json(active);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Update an active
export async function updateActive(req, res) {
    const { id } = req.params;
    const { name, type } = req.body;
    const userId = req.user.id;

    try {
        const active = await prisma.active.update({
            where: {
                id: parseInt(id),
                userId,
            },
            data: {
                name,
                type,
            },
        });
        res.status(200).json(active);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete an active
export async function deleteActive(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // 1. DELETE Historical Balances (Foreign Key dependency)
        await prisma.historicalBalance.deleteMany({
            where: { activeId: parseInt(id) },
        });

        // 2. DELETE Investments (if any, dependency check)
        await prisma.investment.deleteMany({
            where: { activeId: parseInt(id) },
        });

        // 3. DELETE the Active
        await prisma.active.delete({
            where: {
                id: parseInt(id),
                userId,
            },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}