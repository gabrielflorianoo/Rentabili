import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import getPrismaClient from '../prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = '1h';

class AuthController {
    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    async register(req, res) {
        try {
            const { name, email, password } = req.body || {};
            if (!name || !email || !password) {
                return res
                    .status(400)
                    .json({ error: 'Nome, email e senha são obrigatórios' });
            }

            if (process.env.USE_DB !== 'true') {
                // Mock register
                return res.status(201).json({
                    message: 'Usuário registrado com sucesso (mock)',
                    user: { name, email },
                });
            }

            const prisma = getPrismaClient();

            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res.status(409).json({ error: 'Email já registrado' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            res.status(201).json({
                message: 'Usuário registrado com sucesso',
                user: { id: newUser.id, name: newUser.name, email: newUser.email },
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body || {};
            if (!email || !password)
                return res
                    .status(400)
                    .json({ error: 'email e password são obrigatórios' });

            if (process.env.USE_DB !== 'true') {
                // Mock login
                if (
                    email === 'local@example.com' &&
                    password === 'localpassword'
                ) {
                    const payload = {
                        id: 1,
                        email: 'local@example.com',
                        name: 'Usuário Local',
                    };
                    const token = jwt.sign(payload, JWT_SECRET, {
                        expiresIn: JWT_EXPIRES_IN,
                    });
                    return res.json({ token, user: payload });
                } else {
                    return res
                        .status(401)
                        .json({ error: 'Credenciais inválidas' });
                }
            }

            const prisma = getPrismaClient();
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user)
                return res.status(401).json({ error: 'Credenciais inválidas' });

            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return res.status(401).json({ error: 'Credenciais inválidas' });

            const payload = { id: user.id, email: user.email, name: user.name };
            const token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });

            res.json({ token, user: payload });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default AuthController;
