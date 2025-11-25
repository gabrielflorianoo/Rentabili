import validateEnv from './src/config/validateEnv.js';
validateEnv();

import 'express-async-errors';
import 'dotenv/config';
import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import loggerMorgan from 'morgan';
import cors from 'cors';
import { getRedisClient } from './redisClient.js';
import { initializeRateLimiter } from './middlewares/rateLimiter.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// === Início do Bloco de Compatibilidade ESM para __dirname e __filename ===
// Necessário para que path.join(__dirname, 'swagger.yaml') funcione no Node.js ESM e no Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// === Fim do Bloco de Compatibilidade ESM ===


import usersRouter from './routes/users.js';
import investmentsRouter from './routes/investments.js';
import transactionsRouter from './routes/transactions.js';
import walletsRouter from './routes/wallets.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import activesRouter from './routes/actives.js';
import historicalBalancesRouter from './routes/historicalBalances.js';

import logger from './src/logger.js';

logger.info('🔧 Configuração do ambiente:');
logger.info({ USE_DB: process.env.USE_DB }, '    USE_DB:');
logger.info({ USE_CACHE: process.env.USE_CACHE }, '    USE_CACHE:');
logger.info(
    { DATABASE_URL: process.env.DATABASE_URL ? '✅ Configurado' : '❌ Não configurado' },
    '    DATABASE_URL:'
);
logger.info({ PORT: process.env.PORT || 3001 }, '    PORT:');

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(loggerMorgan('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

let swaggerDocument;

try {
    // CORREÇÃO FINAL: Usamos __dirname para o caminho absoluto, garantindo que o Vercel encontre o arquivo.
    const swaggerPath = path.join(__dirname, 'swagger.yaml');

    // Verifica se o arquivo existe antes de tentar ler
    if (!fs.existsSync(swaggerPath)) {
        // Lança um erro detalhado para o log
        throw new Error(`Swagger file not found at: ${swaggerPath}. Check vercel.json includeFiles.`);
    }

    const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
    swaggerDocument = YAML.parse(swaggerContent);

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
            customCssUrl: '/api-docs/swagger-ui.css',
            customJs: '/api-docs/swagger-ui-bundle.js',
            customJs: [
                '/api-docs/swagger-ui-bundle.js',
                '/api-docs/swagger-ui-standalone-preset.js'
            ],
            customSiteTitle: "Rentabili - API de Gestão Financeira",
        })
    );
    logger.info("📘 Swagger/OpenAPI carregado com sucesso.");
} catch (e) {
    logger.error({ message: e.message }, "ERRO FATAL AO CARREGAR SWAGGER/OPENAPI:");

    // Middleware de fallback para /api-docs em caso de falha de carregamento
    app.use('/api-docs', (req, res) => res.status(500).json({
        error: "Documentação da API indisponível (Erro de carregamento do arquivo YAML).",
        detail: e.message
    }));
}


app.use('/users', usersRouter);
app.use('/investments', investmentsRouter);
app.use('/transactions', transactionsRouter);
app.use('/wallets', walletsRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/actives', activesRouter);
app.use('/historical-balances', historicalBalancesRouter);

app.use(require('./src/middleware/errorHandler').default);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const payload = {
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {},
    };
    res.status(status).json(payload);
});

async function startServer() {
    const PORT = process.env.PORT || 3001;

    if (process.env.USE_CACHE === 'true' && process.env.NODE_ENV !== 'test') {
        try {
            await getRedisClient();
            await initializeRateLimiter();
        } catch (error) {
            logger.error({ error }, 'FATAL: Failed to initialize Redis. Rate Limiter will be disabled.');
        }
    }

    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
            logger.info(`🚀 Servidor rodando na porta ${PORT}`);
            if (swaggerDocument) {
                logger.info(`📘 Documentação da API disponível em: http://localhost:${PORT}/api-docs`);
            }
        });
    }
}

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default app;