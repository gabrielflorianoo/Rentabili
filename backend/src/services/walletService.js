// backend/src/services/walletService.js
import walletRepository from '../repositories/walletRepository.js';
import getPrismaClient from '../../prismaClient.js';

const prisma = getPrismaClient();

class WalletService {
    /**
     * Calcula o saldo dinâmico de uma carteira
     * Saldo = Soma de transações (income - expense)
     */
    async calculateWalletBalance(walletId) {
        try {
            // Buscar transações da carteira
            const transactions = await prisma.transaction.findMany({
                where: { walletId }
            });

            // Calcular saldo a partir das transações
            const balanceFromTransactions = transactions.reduce((sum, trans) => {
                const amount = Number(trans.amount || 0);
                return sum + (trans.type === 'income' ? amount : -amount);
            }, 0);

            return Math.max(balanceFromTransactions, 0);
        } catch (error) {
            console.error('Erro ao calcular saldo da carteira:', error);
            return 0;
        }
    }

    async getAll(userId) {
        try {
            if (!userId) {
                throw new Error('Usuário não autenticado');
            }
            const wallets = await walletRepository.findAll(userId);
            
            // Enriquecer cada carteira com o saldo dinâmico
            const walletsWithBalance = await Promise.all(
                wallets.map(async (wallet) => ({
                    ...wallet,
                    balance: await this.calculateWalletBalance(wallet.id)
                }))
            );
            
            return walletsWithBalance;
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async getById(id, userId) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }
            const wallet = await walletRepository.findById(id, userId);
            if (!wallet) {
                throw new Error('Carteira não encontrada');
            }
            
            // Calcular saldo dinâmico
            const balance = await this.calculateWalletBalance(id);
            
            return {
                ...wallet,
                balance
            };
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async create(name, balance, userId) {
        try {
            if (!name || !userId) {
                throw new Error('Nome e userId são obrigatórios');
            }
            
            // Criar carteira (balance será calculado dinamicamente)
            const newWallet = await walletRepository.create(
                name,
                balance || 0,
                userId,
            );
            
            // Retornar com o saldo calculado
            const calculatedBalance = await this.calculateWalletBalance(newWallet.id);
            return {
                ...newWallet,
                balance: calculatedBalance
            };
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async update(id, name, balance, userId) {
        try {
            if (!id || !userId) {
                throw new Error('ID e userId são obrigatórios');
            }
            
            // Validar que a carteira pertence ao usuário
            const wallet = await walletRepository.findById(id, userId);
            if (!wallet) {
                throw new Error('Carteira não encontrada ou não pertence ao usuário');
            }

            // Atualizar apenas o nome (balance é ignorado pois é calculado dinamicamente)
            const updatedWallet = await walletRepository.update(
                id,
                name,
                balance || 0,
                userId,
            );
            
            // Retornar com o saldo calculado
            const calculatedBalance = await this.calculateWalletBalance(id);
            return {
                ...updatedWallet,
                balance: calculatedBalance
            };
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async remove(id, userId) {
        try {
            if (!id || !userId) {
                throw new Error('ID e userId são obrigatórios');
            }
            
            // Validar que a carteira pertence ao usuário
            const wallet = await walletRepository.findById(id, userId);
            if (!wallet) {
                throw new Error('Carteira não encontrada ou não pertence ao usuário');
            }

            await walletRepository.remove(id);
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
}

export default new WalletService();
