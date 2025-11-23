import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cria uma instância do axios com baseURL e headers padrão
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token quando presente
apiClient.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('rentabil_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // localStorage pode falhar em ambientes não-browser
    }
    return config;
});

// Auth API
export const authApi = {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (payload) => apiClient.post('/users', payload),
};

// Users API
export const userApi = {
    list: () => apiClient.get('/users'),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (payload) => apiClient.post('/users', payload),
    update: (id, payload) => apiClient.put(`/users/${id}`, payload),
    remove: (id) => apiClient.delete(`/users/${id}`),
};

// Transactions API
export const transactionsApi = {
    list: () => apiClient.get('/transactions'),
    getById: (id) => apiClient.get(`/transactions/${id}`),
    create: (payload) => apiClient.post('/transactions', payload),
    update: (id, payload) => apiClient.put(`/transactions/${id}`, payload),
    remove: (id) => apiClient.delete(`/transactions/${id}`),
};

// Investments API
export const investmentsApi = {
    list: () => apiClient.get('/investments'),
    getById: (id) => apiClient.get(`/investments/${id}`),
    create: (payload) => apiClient.post('/investments', payload),
    update: (id, payload) => apiClient.put(`/investments/${id}`, payload),
    remove: (id) => apiClient.delete(`/investments/${id}`),
};

// Wallets API
export const walletsApi = {
    list: () => apiClient.get('/wallets'),
    getById: (id) => apiClient.get(`/wallets/${id}`),
    create: (payload) => apiClient.post('/wallets', payload),
    update: (id, payload) => apiClient.put(`/wallets/${id}`, payload),
    remove: (id) => apiClient.delete(`/wallets/${id}`),
};

// Dashboard API
export const dashboardApi = {
    getSummary: () => apiClient.get('/dashboard/summary'),
};

// Actives API
export const activesApi = {
    list: () => apiClient.get('/actives'),
    getById: (id) => apiClient.get(`/actives/${id}`),
    create: (payload) => apiClient.post('/actives', payload),
    update: (id, payload) => apiClient.put(`/actives/${id}`, payload),
    remove: (id) => apiClient.delete(`/actives/${id}`),
};

// Historical Balances API
export const historicalBalancesApi = {
    listByActive: (activeId) => apiClient.get(`/historical-balances/active/${activeId}`),
    getById: (id) => apiClient.get(`/historical-balances/${id}`),
    create: (payload) => apiClient.post('/historical-balances', payload),
    update: (id, payload) => apiClient.put(`/historical-balances/${id}`, payload),
    remove: (id) => apiClient.delete(`/historical-balances/${id}`),
};

export default apiClient;
