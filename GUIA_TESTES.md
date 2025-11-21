# 🧪 Guia de Teste - Rentabili

## Como Testar o Projeto

### 1️⃣ Iniciar o Backend
```bash
cd backend
npm start
```
✅ Deve exibir: `🚀 Servidor rodando na porta 3000`

### 2️⃣ Iniciar o Frontend
```bash
cd frontend
npm run dev
```
✅ Deve exibir: `Local: http://localhost:5173/`

### 3️⃣ Testar Autenticação

#### Login (Modo Mock - USE_DB=false)
1. Acesse `http://localhost:5173`
2. Use as credenciais:
   - **Email:** local@example.com
   - **Password:** localpassword
3. Clique em "Entrar na Conta"
4. ✅ Deve redirecionar para `/dashboard`

#### Cadastro
1. Na tela de login, clique em "Criar Conta →"
2. Preencha todos os campos
3. Clique em "Criar Conta"
4. ✅ Deve mostrar mensagem de sucesso
5. Clique em "Fazer Login Agora"
6. Faça login com as credenciais criadas

### 4️⃣ Testar Dashboard
1. Após login, você estará no Dashboard
2. ✅ Deve exibir:
   - Nome do usuário no canto superior direito
   - Patrimônio Total
   - Número de ativos
   - Cards de rentabilidade

### 5️⃣ Testar Navegação
1. Clique em "Investimentos" na sidebar
2. ✅ Deve navegar para `/investimentos`
3. Clique em "Relatórios" na sidebar
4. ✅ Deve navegar para `/relatorios`
5. Clique em "Dashboard" na sidebar
6. ✅ Deve voltar para `/dashboard`

### 6️⃣ Testar Investimentos

#### Criar Investimento
1. Vá para "Investimentos"
2. Clique em "+ Novo Investimento"
3. Preencha:
   - ID do Ativo: 1
   - Valor: 1000.00
   - Data: (data atual)
4. Clique em "Salvar"
5. ✅ Investimento deve aparecer na tabela

#### Editar Investimento
1. Clique no ícone ✏️ de um investimento
2. Altere o valor
3. Clique em "Salvar"
4. ✅ Valor deve ser atualizado na tabela

#### Deletar Investimento
1. Clique no ícone 🗑️ de um investimento
2. Confirme a exclusão
3. ✅ Investimento deve sumir da tabela

### 7️⃣ Testar Relatórios
1. Vá para "Relatórios"
2. ✅ Deve exibir:
   - 4 cards de estatísticas (Receitas, Despesas, Investimentos, Saldo)
   - Filtros de tipo e período
   - Tabela de transações
   - Resumo de investimentos

#### Testar Filtros
1. Selecione "Receitas" no filtro de tipo
2. ✅ Tabela deve mostrar apenas receitas
3. Selecione "Despesas"
4. ✅ Tabela deve mostrar apenas despesas
5. Selecione "Todas"
6. ✅ Tabela deve mostrar tudo

### 8️⃣ Testar Logout
1. Em qualquer página, clique em "Sair da Conta" (vermelho)
2. ✅ Deve redirecionar para `/` (login)
3. ✅ Token deve ser removido do localStorage

### 9️⃣ Testar Proteção de Rotas
1. Faça logout
2. Tente acessar diretamente:
   - `http://localhost:5173/dashboard`
   - `http://localhost:5173/investimentos`
   - `http://localhost:5173/relatorios`
3. ✅ Todas devem redirecionar para `/` (login)

### 🔟 Testar Responsividade
1. Redimensione a janela do navegador
2. ✅ Layout deve se adaptar
3. Teste em diferentes tamanhos de tela

## 🐛 Problemas Comuns

### Backend não inicia
- Verifique se a porta 3000 está livre
- Verifique se todas as dependências foram instaladas (`npm install`)

### Frontend não conecta ao backend
- Verifique se o backend está rodando
- Verifique se a URL em `api.js` está correta (`http://localhost:3000`)
- Verifique CORS no backend

### Erro 401 ao acessar rotas
- Verifique se está logado
- Verifique se o token está no localStorage
- Tente fazer logout e login novamente

### Dados não aparecem
- Se `USE_DB=false`, os dados são mock/simulados
- Se `USE_DB=true`, verifique se o banco está configurado

## ✅ Checklist de Funcionalidades

- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Dashboard carrega dados
- [ ] Navegação entre páginas funciona
- [ ] Criar investimento funciona
- [ ] Editar investimento funciona
- [ ] Deletar investimento funciona
- [ ] Relatórios exibem estatísticas
- [ ] Filtros de relatórios funcionam
- [ ] Logout funciona
- [ ] Rotas protegidas redirecionam quando não autenticado
- [ ] Interface é responsiva

## 📝 Notas

- Modo Mock (`USE_DB=false`): Dados são simulados, não persistem
- Modo Database (`USE_DB=true`): Dados são salvos no MySQL
- Token JWT expira em 1 hora
- Todas as senhas são hasheadas com bcrypt
