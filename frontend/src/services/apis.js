import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors"; // <--- 1. IMPORTAR O CORS

// Importar rotas
import usersRouter from './routes/users.js';
import investmentsRouter from './routes/investments.js';
import transactionsRouter from './routes/transactions.js';
import walletsRouter from './routes/wallets.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js'; // (Se você criou essa rota separada)

const app = express();

// Middlewares
app.use(cors()); // <--- 2. ATIVAR O CORS (Crucial!)
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
app.use('/users', usersRouter);
app.use('/investments', investmentsRouter);
app.use('/transactions', transactionsRouter);
app.use('/wallets', walletsRouter);
app.use('/auth', authRouter);
// app.use('/dashboard', dashboardRouter); // Descomente se tiver criado a rota dashboard.js

// catch 404
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const payload = {
        message: err.message,
        error: req.app.get("env") === "development" ? err : {}
    };
    res.status(status).json(payload);
});

const PORT = process.env.PORT || 3000;

// Só inicia o servidor se não for teste
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

export default app;
