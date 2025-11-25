# 📊 Rentabili - Sistema de Gestão de Investimentos

O Rentabili é um sistema completo de gerenciamento de rentabilidade de investimentos. Ele ajuda investidores a monitorar o desempenho de seus ativos (renda fixa e fundos), calculando ganhos percentuais e exibindo gráficos comparativos para facilitar a tomada de decisões.

## 🚀 Funcionalidades

- ✅ **Autenticação completa** (Login e Cadastro, utilizando JWT e Refresh Tokens).
- ✅ **Dashboard** com resumo financeiro e distribuição de ativos.
- ✅ **Gestão de Investimentos e Ativos** (CRUD completo).
- ✅ **Transações** e **Carteiras** controladas por usuário.
- ✅ **Simulador** de crescimento de investimento.
- ✅ **Interface moderna** e responsiva.

---

## 🏗️ Arquitetura do Backend

O *backend* segue o padrão de camadas **Controller-Service-Repository** para modularidade e separação de responsabilidades:

| Diretório | Responsabilidade Principal | Interação |
| :--- | :--- | :--- |
| `controllers/` | Lida com requisições HTTP e validações de entrada. | Chama a camada `Service`. |
| `services/` | Contém a **lógica de negócio principal** e orquestração. | Chama `Repository` e outros serviços (ex: `tokenService`). |
| `repositories/` | Interage diretamente com o **Prisma ORM** (Banco de Dados). | Persistência de dados. |
| `middlewares/` | Lógica de pré-processamento (Autenticação, Cache, Rate Limiting). | Executada antes do `Controller`. |

### 🔐 Segurança e Autenticação (JWT)

A autenticação utiliza um fluxo de **Access Token (curta duração)** e **Refresh Token (longa duração)**:

* **Access Token:** Enviado no Header `Authorization` para acessar rotas protegidas.
* **Refresh Token:** Armazenado em **Cookie HTTP-Only** seguro e no banco de dados para a renovação do Access Token na rota `/auth/refresh`.
* As senhas são protegidas com **bcryptjs**.

### ⚡ Cache e Desempenho (Redis)

O **Redis** é utilizado para otimizar o desempenho do sistema:

* **Cache de Dados:** O `cacheMiddleware.js` armazena respostas de leitura frequente (como o Dashboard) para evitar repetidas consultas ao DB.
* **Rate Limiting:** Implementado via Redis para proteger rotas de autenticação e API contra ataques de força bruta.

### 📜 Logging e Observabilidade (Pino)

Utilizamos a biblioteca **Pino** para logging estruturado de alta performance. O `errorHandler.js` centraliza o registro de erros com contexto completo para facilitar a depuração.

### 📘 Documentação da API (Swagger/OpenAPI)

A documentação interativa da API é gerada a partir do `swagger.yaml` e está disponível em **`http://localhost:3000/api-docs`** (após a inicialização do backend).

---

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

# Banco de Dados

```bash
DATABASE_URL="mysql://usuario:senha@localhost:3306/rentabili"
USE_DB=false  # true para usar banco de dados, false para mock

# JWT
JWT_SECRET=seu_segredo_aqui
ACCESS_TOKEN_EXP="15m"
REFRESH_TOKEN_EXP="7d"

# Configuração de Cache
REDIS_URL="redis://localhost:6379"

# Porta e Frontend URL (para CORS e Cookies)
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### 5. Configurar Banco de Dados (Opcional)

Se `USE_DB=true`, execute as migrations e gere o cliente Prisma:

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

## 🎯 Uso e Endpoints Principais

### Login de Teste (Modo Mock, se `USE_DB=false`)

- **Email:** local@example.com
- **Password:** localpassword

### Endpoints Protegidos (Requerem Access Token)

| Rota | Método | Descrição |
| :--- | :--- | :--- |
| `/auth/refresh` | POST | Renova o Access Token (usa Refresh Token no Cookie). |
| `/dashboard/summary` | GET | Resumo financeiro do usuário. |
| `/investments` | GET/POST | Listar ou criar investimento. |
| `/transactions` | GET/POST | Listar ou criar transação. |

---

## 🎨 Tecnologias Utilizadas

### Frontend

- React 18
- React Router DOM
- Axios
- CSS3 com animações

### Backend

- Node.js (ES Modules)
- Express
- Prisma ORM (MySQL)
- JWT (jsonwebtoken, bcryptjs)
- Redis (para Cache e Rate Limiting)
- Pino (Logging)

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedores

_Ver página de contribuidores_