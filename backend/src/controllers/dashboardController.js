// backend/controllers/dashboardController.js
import dashboardService from '../services/dashboardService.js';

class DashboardController {
    constructor() {
        this.getSummary = this.getSummary.bind(this);
        this.getDashboard = this.getDashboard.bind(this);
    }

    async getSummary(req, res) {
        try {
            const userId = req.user?.userId;
            const summary = await dashboardService.getSummary(userId);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Retorna todos os dados do dashboard para o usuário autenticado
    async getDashboard(req, res) {
        try {
            const userId = req.user?.userId;
            const dashboardData = await dashboardService.getDashboard(userId);
            res.json(dashboardData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default DashboardController;
