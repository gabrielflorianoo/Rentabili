// filepath: c:\Users\Gabriel\Documents\1 - Projetos\Rentabili\frontend\src\utils\api.js
import axios from 'axios';

// --- Configuração Base ---
const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('rentabil_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- Função Auxiliar para Tratamento de Respostas/Erros ---
/**
 * Trata a resposta de uma requisição HTTP.
 * @param {Promise} request - A promessa (Promise) da requisição axios.
 * @returns {Promise<Object>} - Uma promessa que resolve com os dados (data) da resposta ou rejeita com o erro.
 */
export const handleHTTP = async (request) => {
    try {
        const response = await request;
        return response.data; // Retorna os dados da resposta com sucesso
    } catch (error) {
        // Lógica de tratamento de erro mais robusta pode ser adicionada aqui
        console.error('Erro na requisição HTTP:', error.response || error.message || error);

        // Rejeita a promessa com o objeto de erro, para que o componente/serviço chamador possa tratar
        // Pode-se optar por retornar 'error.response.data' se o backend fornecer mensagens de erro úteis.
        throw error;
    }
};

// --- Funções de API Separadas ---

// 🚀 Auth Routes
export const login = (credentials) => handleHTTP(api.post('/auth/login', credentials));
export const register = (userData) => handleHTTP(api.post('/users', userData));
export const logout = () => handleHTTP(api.post('/auth/logout'));

// 📊 Dashboard Routes
export const getDashboard = () => handleHTTP(api.get('/dashboard/summary'));

// 💰 Investments Routes
export const getInvestments = () => handleHTTP(api.get('/investments'));
export const createInvestment = (investmentData) => handleHTTP(api.post('/investments', investmentData));
export const updateInvestment = (id, investmentData) => handleHTTP(api.put(`/investments/${id}`, investmentData));
export const deleteInvestment = (id) => handleHTTP(api.delete(`/investments/${id}`));

// 💸 Transactions Routes
export const getTransactions = () => handleHTTP(api.get('/transactions'));
export const createTransaction = (transactionData) => handleHTTP(api.post('/transactions', transactionData));
export const updateTransaction = (id, transactionData) => handleHTTP(api.put(`/transactions/${id}`, transactionData));
export const deleteTransaction = (id) => handleHTTP(api.delete(`/transactions/${id}`));

// 👥 Users Routes
export const getUsers = () => handleHTTP(api.get('/users'));
export const createUser = (userData) => handleHTTP(api.post('/users', userData));
export const getUser = (id) => handleHTTP(api.get(`/users/${id}`));
export const updateUser = (id, userData) => handleHTTP(api.put(`/users/${id}`, userData));
export const deleteUser = (id) => handleHTTP(api.delete(`/users/${id}`));

// 👛 Wallets Routes
export const getWallets = () => handleHTTP(api.get('/wallets'));
export const createWallet = (walletData) => handleHTTP(api.post('/wallets', walletData));
export const updateWallet = (id, walletData) => handleHTTP(api.put(`/wallets/${id}`, walletData));
export const deleteWallet = (id) => handleHTTP(api.delete(`/wallets/${id}`));