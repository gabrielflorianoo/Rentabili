# Rentabili

# O Rentabili é um sistema de gerenciamento de rentabilidade de investimentos. Ele ajuda investidores a monitorar o desempenho de seus ativos (renda fixa e fundos), calculando ganhos percentuais e exibindo gráficos comparativos para facilitar a tomada de decisões.

# 📊 Rentabili - Sistema de Gestão de Investimentos

O Rentabili é um sistema completo de gerenciamento de rentabilidade de investimentos. Ele ajuda investidores a monitorar o desempenho de seus ativos (renda fixa e fundos), calculando ganhos percentuais e exibindo gráficos comparativos para facilitar a tomada de decisões.

## 🚀 Funcionalidades

- ✅ **Autenticação completa** (Login e Cadastro)
- ✅ **Dashboard** com resumo financeiro
- ✅ **Gestão de Investimentos** (CRUD completo)
- ✅ **Relatórios Financeiros** com estatísticas
- ✅ **Transações** e **Carteiras**
- ✅ **Interface moderna** com animações

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- MySQL (se usar banco de dados)
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Rentabili
```

### 2. Instalar dependências do Backend

```bash
cd backend
npm install
```

### 3. Instalar dependências do Frontend

```bash
cd ../frontend
npm install
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` com:

```env
# Banco de Dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/rentabili"
USE_DB=false  # true para usar banco de dados, false para mock

# JWT
JWT_SECRET=seu_segredo_aqui

# Porta
PORT=3000
```

### 5. Configurar Banco de Dados (Opcional)

Se `USE_DB=true`, execute as migrations:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## ▶️ Executar o Projeto

### Backend

```bash
cd backend
npm start
# Servidor rodará em http://localhost:3000
```

### Frontend

```bash
cd frontend
npm run dev
# Aplicação rodará em http://localhost:5173
```

## 🎯 Uso

### Login de Teste (Modo Mock)

- **Email:** local@example.com
- **Password:** localpassword

### Criar Nova Conta

1. Clique em "Criar Conta →" no cartão de login
2. Preencha os dados
3. Após criar, faça login

### Navegação

- **Dashboard:** Visão geral do patrimônio
- **Investimentos:** Gerenciar investimentos (adicionar, editar, excluir)
- **Relatórios:** Visualizar estatísticas e histórico de transações

## 📁 Estrutura do Projeto

```
Rentabili/
├── backend/
│   ├── controllers/      # Lógica de negócio
│   ├── routes/          # Rotas da API
│   ├── middlewares/     # Autenticação e validações
│   ├── prisma/          # Schema do banco de dados
│   └── app.js           # Configuração do Express
│
└── frontend/
    ├── src/
    │   ├── components/  # Componentes reutilizáveis
    │   ├── pages/       # Páginas da aplicação
    │   ├── services/    # Serviços de autenticação
    │   ├── utils/       # API client
    │   └── styles/      # Estilos globais
    └── package.json
```

## 🔐 API Endpoints

### Autenticação

- `POST /auth/login` - Login
- `POST /users` - Criar usuário

### Dashboard

- `GET /dashboard/summary` - Resumo financeiro (requer autenticação)

### Investimentos

- `GET /investments` - Listar investimentos
- `POST /investments` - Criar investimento
- `PUT /investments/:id` - Atualizar investimento
- `DELETE /investments/:id` - Deletar investimento

### Transações

- `GET /transactions` - Listar transações
- `POST /transactions` - Criar transação
- `PUT /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Deletar transação

### Carteiras

- `GET /wallets` - Listar carteiras
- `POST /wallets` - Criar carteira
- `PUT /wallets/:id` - Atualizar carteira
- `DELETE /wallets/:id` - Deletar carteira

## 🎨 Tecnologias Utilizadas

### Frontend

- React 18
- React Router DOM
- Axios
- CSS3 com animações

### Backend

- Node.js
- Express
- Prisma ORM
- JWT para autenticação
- bcryptjs para hash de senhas
- MySQL

## 🐛 Solução de Problemas

### Erro de CORS

Certifique-se de que o backend está configurado para aceitar requisições do frontend:

```javascript
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);
```

### Erro 401 (Unauthorized)

Verifique se o token está sendo enviado corretamente. O token é armazenado em `localStorage` como `rentabil_token`.

### Banco de dados não conecta

1. Verifique se o MySQL está rodando
2. Confirme as credenciais no `.env`
3. Execute `npx prisma migrate dev`

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedores

_Ver página de contribuidores_
