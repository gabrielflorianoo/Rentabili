import { login, createUser } from '../utils/api.js';

const API_URL = 'http://localhost:3000';

export const servicoAutenticacao = {
  // LOGIN: Envia e-mail e senha para o Back-end
  entrar: async (email, password) => {
    try {
        const data = await login({ email, password });
        // Salva o token (chave de acesso) e o usuário no navegador
        localStorage.setItem('rentabil_token', data.token);
        localStorage.setItem('rentabil_user', JSON.stringify(data.user));
        return { sucesso: true, usuario: data.user };
    } catch (error) {
        console.error(error);
        return { sucesso: false, erro: error.response?.data?.error || 'Falha ao entrar', campo: 'email' };
    }
  },

  // CADASTRO: Envia os dados para criar usuário no Banco
  cadastrar: async (dados) => {
    try {
        const userData = {
            name: dados.nome,
            email: dados.email,
            password: dados.senha,
            phone: dados.nascimento // Usamos phone provisoriamente para guardar data ou telefone
        };
        await createUser(userData);
        return { sucesso: true };
    } catch (error) {
        return { sucesso: false, erro: error.response?.data?.error || 'Erro ao cadastrar', campo: 'email' };
    }
  },

  sair: () => {
    localStorage.removeItem('rentabil_token');
    localStorage.removeItem('rentabil_user');
  },

  obterUsuarioAtual: () => {
    const user = localStorage.getItem('rentabil_user');
    return user ? JSON.parse(user) : null;
  },

  obterToken: () => {
    return localStorage.getItem('rentabil_token');
  }
};