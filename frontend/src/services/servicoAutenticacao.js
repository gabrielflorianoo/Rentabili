const API_URL = 'http://localhost:3000';

export const servicoAutenticacao = {
  // LOGIN: Envia e-mail e senha para o Back-end
  entrar: async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token (chave de acesso) e o usuário no navegador
            localStorage.setItem('rentabil_token', data.token);
            localStorage.setItem('rentabil_user', JSON.stringify(data.user));
            return { sucesso: true, usuario: data.user };
        } else {
            return { sucesso: false, erro: data.error || 'Falha ao entrar', campo: 'email' };
        }
    } catch (error) {
        console.error(error);
        return { sucesso: false, erro: 'Sem conexão com o servidor.', campo: 'email' };
    }
  },

  // CADASTRO: Envia os dados para criar usuário no Banco
  cadastrar: async (dados) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: dados.nome,
                email: dados.email,
                password: dados.senha, // Envia a senha para ser criptografada no back
                phone: dados.nascimento // Usamos phone provisoriamente para guardar data ou telefone
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { sucesso: true };
        } else {
            return { sucesso: false, erro: data.error || 'Erro ao cadastrar', campo: 'email' };
        }
    } catch (error) {
        return { sucesso: false, erro: 'Erro de conexão.', campo: 'email' };
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