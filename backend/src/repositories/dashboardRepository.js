// backend/src/repositories/dashboardRepository.js
import getPrismaClient from '../../prismaClient.js.js';
import DashboardRepositoryInterface from '../interfaces/DashboardRepositoryInterface.js';

const prisma = getPrismaClient();

class DashboardRepository implements DashboardRepositoryInterface {
  async findActivesWithBalances(userId) {
    try {
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
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findActivesWithLatestBalances(userId) {
    try {
      const actives = await prisma.active.findMany({
        where: { userId },
        include: {
          balances: { orderBy: { date: 'desc' }, take: 1 },
        },
      });

      return actives.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        latestBalance: a.balances && a.balances.length ? Number(a.balances[0].value) : 0,
      }));
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findWallets(userId) {
    try {
      return await prisma.wallet.findMany({ where: { userId } });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findTransactions(userId) {
    try {
      return await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10,
      });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findInvestments(userId) {
    try {
      return await prisma.investment.findMany({
        where: { userId },
      });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

export default new DashboardRepository();