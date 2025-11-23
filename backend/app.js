import 'dotenv/config';
import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// Importar rotas
import usersRouter from './routes/users.js';
import investmentsRouter from './routes/investments.js';
import transactionsRouter from './routes/transactions.js';
import walletsRouter from './routes/wallets.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import activesRouter from './routes/actives.js';
import historicalBalancesRouter from './routes/historicalBalances.js';

// Log para verificar se o .env está sendo lido
console.log('🔧 Configuração do ambiente:');
console.log('   USE_DB:', process.env.USE_DB);
console.log(
    '   DATABASE_URL:',
    process.env.DATABASE_URL ? '✅ Configurado' : '❌ Não configurado',
);
console.log('   PORT:', process.env.PORT || 3000);

const app = express();

// Middlewares
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://reimagined-fishstick-v69vx7j79rxx3wj9x-3000.app.github.dev/',
            'https://reimagined-fishstick-v69vx7j79rxx3wj9x-5173.app.github.dev',
            'https://crispy-bassoon-5gjqwp7pj5r9hj76-5173.app.github.dev',
            'https://crispy-bassoon-5gjqwp7pj5r9hj76-3000.app.github.dev',
        ],
        credentials: true,
    }),
);
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
app.use('/users', usersRouter);
app.use('/investments', investmentsRouter);
app.use('/transactions', transactionsRouter);
app.use('/wallets', walletsRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/actives', activesRouter);
app.use('/historical-balances', historicalBalancesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const payload = {
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {},
    };
    res.status(status).json(payload);
});

// Inicia o servidor se este arquivo for executado diretamente
const PORT = process.env.PORT || 3000;
// Apenas inicia o listen se não estiver sendo importado por testes
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

export default app;
