import axios from 'axios';

// Flag para alternar entre ambiente de produção e desenvolvimento
const PRODUCTION = false;

// Define a URL base conforme o ambiente (produção ou local)
const BASE_URL = PRODUCTION ? 'https://backend-rentabili.vercel.app' : 'http://localhost:3000' || import.meta.env.VITE_API_URL;

// Cria uma instância do axios com baseURL definida e cabeçalhos padrão
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Permite envio automático de cookies/sessões
});

/**
 * Função genérica para tratar respostas de requisições Axios.
 * Envolve a chamada em um try/catch para capturar possíveis erros.
 * @param {Promise} responsePromise - Promessa retornada por uma chamada axios.
 * @returns {Promise<any>} Retorna os dados da resposta ou lança um erro.
 */
const handleResponse = async (responsePromise) => {
    try {
        const response = await responsePromise;
        return response.data; // Retorna apenas o "data", simplificando o consumo
    } catch (error) {
        console.error('Erro na Requisição API:', error);
        // Lança o erro novamente para que quem chamou possa decidir o que fazer
        throw error;
    }
};

// Interceptor de requisição para adicionar o token JWT automaticamente
apiClient.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('rentabil_token'); // Recupera token salvo
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`; // Adiciona Authorization
        }
    } catch (e) {
        // Caso localStorage não esteja disponível (ex: SSR)
    }
    return config; // Retorna a config modificada
});

// --- Funções Auxiliares Genéricas ---
// Todas as chamadas usam handleResponse para padronizar o retorno e erros

const get = (url, config) => handleResponse(apiClient.get(url, config));
const post = (url, data, config) =>
    handleResponse(apiClient.post(url, data, config));
const put = (url, data, config) =>
    handleResponse(apiClient.put(url, data, config));
const remove = (url, config) => handleResponse(apiClient.delete(url, config));

// Auth API – Funções relacionadas à autenticação
export const authApi = {
    login: (email, password) => post('/auth/login', { email, password }),
    register: (payload) => post('/auth/register', payload),
};

// Users API – CRUD de usuários
export const userApi = {
    list: () => get('/users'), // Lista todos os usuários
    getById: (id) => get(`/users/${id}`), // Busca por ID
    create: (payload) => post('/users', payload), // Criação
    update: (id, payload) => put(`/users/${id}`, payload), // Atualização
    remove: (id) => remove(`/users/${id}`), // Remoção
};

// Transactions API – CRUD de transações financeiras
export const transactionsApi = {
    list: () => get('/transactions'),
    getById: (id) => get(`/transactions/${id}`),
    create: (payload) => post('/transactions', payload),
    update: (id, payload) => put(`/transactions/${id}`, payload),
    remove: (id) => remove(`/transactions/${id}`),
};

// Investments API – Operações financeiras e cálculos de investimentos
export const investmentsApi = {
    list: () => get('/investments'),
    getById: (id) => get(`/investments/${id}`),
    create: (payload) => post('/investments', payload),
    update: (id, payload) => put(`/investments/${id}`, payload),
    remove: (id) => remove(`/investments/${id}`),
    getTotalInvested: () => get('/investments/total-invested'), // Soma total investida
    getGainLoss: () => get('/investments/gain-loss'), // Ganhos e perdas
    simulateInvestment: (payload) => post('/investments/simulate', payload), // Simulações
};

// Wallets API – Para gerenciamento de carteiras
export const walletsApi = {
    list: () => get('/wallets'),
    getById: (id) => get(`/wallets/${id}`),
    create: (payload) => post('/wallets', payload),
    update: (id, payload) => put(`/wallets/${id}`, payload),
    remove: (id) => remove(`/wallets/${id}`),
};

// Dashboard API – Dados consolidados do painel
export const dashboardApi = {
    getSummary: () => get('/dashboard/summary'),
};

// Actives API – Gerenciamento de ativos financeiros
export const activesApi = {
    list: () => get('/actives'),
    getById: (id) => get(`/actives/${id}`),
    create: (payload) => post('/actives', payload),
    update: (id, payload) => put(`/actives/${id}`, payload),
    remove: (id) => remove(`/actives/${id}`),
};

// Historical Balances API – Histórico de valores dos ativos
export const historicalBalancesApi = {
    listByActive: (activeId) => get(`/historical-balances/active/${activeId}`),
    getById: (id) => get(`/historical-balances/${id}`),
    create: (payload) => post('/historical-balances', payload),
    update: (id, payload) => put(`/historical-balances/${id}`, payload),
    remove: (id) => remove(`/historical-balances/${id}`),
};

export default apiClient;
