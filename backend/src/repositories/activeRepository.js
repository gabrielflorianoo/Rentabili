// backend/src/repositories/activeRepository.js
import getPrismaClient from '../../prismaClient.js.js';
import ActiveRepositoryInterface from '../interfaces/activeRepositoryInterface.js';

const prisma = getPrismaClient();

class ActiveRepository implements ActiveRepositoryInterface {
  async create(name: string, type: string, userId: number): Promise<any> {
    try {
      const active = await prisma.active.create({
        data: {
          name,
          type,
          userId,
        },
      });
      return active;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar active no banco de dados');
    }
  }

  async findAll(userId: number): Promise<any[]> {
    try {
      const actives = await prisma.active.findMany({
        where: { userId },
        include: {
          balances: true,
          investments: true,
        },
      });
      return actives;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar actives no banco de dados');
    }
  }

  async findById(id: number, userId: number): Promise<any> {
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
      return active;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar active por ID no banco de dados');
    }
  }

  async update(id: number, name: string, type: string, userId: number): Promise<any> {
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
      return active;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao atualizar active no banco de dados');
    }
  }

  async delete(id: number, userId: number): Promise<void> {
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
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao deletar active no banco de dados');
    }
  }
}

export default new ActiveRepository();