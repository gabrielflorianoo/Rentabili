import dashboardService from '../services/dashboardService.js';

class DashboardController {
    async getSummary(req, res) {
        const userId = req.userId;

        try {
            const summary = await dashboardService.getSummary(userId);

            return res.json(summary);
        } catch (error) {
            console.error(error);
            if (error.message === 'Not Found') {
                return res.status(404).json({ error: 'Not Found' });
            }
            return res.status(500).json({ error: 'Erro ao processar dados financeiros' });
        }
    }

    async getDashboard(req, res) {
        const userId = req.userId;

        try {
            const dashboardData = await dashboardService.getDashboard(userId);

            return res.json(dashboardData);
        } catch (error) {
            console.error(error);
            if (error.message === 'Not Found') {
                return res.status(404).json({ error: 'Not Found' });
            }
            return res.status(500).json({ error: 'Erro ao processar dados financeiros' });
        }
    }
}

export default DashboardController;