import activeRepository from '../repositories/activeRepository.js';

class ActiveService {
    async createActive(name, type, userId) {
        try {
            if (!name || !type || !userId) {
                throw new Error('Nome, tipo e userId são obrigatórios');
            }
            const active = await activeRepository.create(name, type, userId);
            return active;
        } catch (error) {
            console.error(error);
            throw error; // Re-lançar o erro para o controller tratar
        }
    }

    async getActives(userId) {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }
            const actives = await activeRepository.findAll(userId);
            return actives;
        } catch (error) {
            console.error(error);
            throw error; // Re-lançar o erro para o controller tratar
        }
    }

    async getActiveById(id, userId) {
        try {
            if (!id || !userId) {
                throw new Error('id e userId são obrigatórios');
            }
            const active = await activeRepository.findById(id, userId);
            if (!active) {
                throw new Error('Active não encontrado');
            }
            return active;
        } catch (error) {
            console.error(error);
            throw error; // Re-lançar o erro para o controller tratar
        }
    }

    async updateActive(id, name, type, userId) {
        try {
            if (!id || !name || !type || !userId) {
                throw new Error('id, nome, tipo e userId são obrigatórios');
            }
            const active = await activeRepository.update(
                id,
                name,
                type,
                userId,
            );
            return active;
        } catch (error) {
            console.error(error);
            throw error; // Re-lançar o erro para o controller tratar
        }
    }

    async deleteActive(id, userId) {
        try {
            if (!id || !userId) {
                throw new Error('id e userId são obrigatórios');
            }
            await activeRepository.delete(id, userId);
        } catch (error) {
            console.error(error);
            throw error; // Re-lançar o erro para o controller tratar
        }
    }
}

export default new ActiveService();
