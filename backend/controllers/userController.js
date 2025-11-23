import getPrismaClient from '../prismaClient.js';
const prisma = getPrismaClient();
import bcrypt from 'bcryptjs';

class UserController {
    constructor() {
        this.users = [
            {
                id: 1,
                name: 'Usuário Local',
                email: 'local@example.com',
                phone: '123456789',
                password: 'localpassword',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    async getAll(req, res) {
        if (process.env.USE_DB !== 'true') {
            return res.json(
                this.users.map((u) => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    createdAt: u.createdAt,
                })),
            );
        }
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const user = this.users.find((u) => u.id === id);
            if (user) {
                return res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt,
                });
            } else {
                return res
                    .status(404)
                    .json({ error: 'Usuário não encontrado' });
            }
        }
        try {
            const id = Number(req.params.id);
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            });
            if (!user)
                return res
                    .status(404)
                    .json({ error: 'Usuário não encontrado' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        if (process.env.USE_DB !== 'true') {
            const { name, email, password, phone } = req.body;
            if (!name || !email || !password) {
                return res
                    .status(400)
                    .json({ error: 'name, email e password são obrigatórios' });
            }
            // Simulate creation
            const newUser = {
                id: Date.now(),
                name,
                email,
                phone,
                createdAt: new Date(),
            };
            return res.status(201).json(newUser);
        }
        try {
            const { name, email, password, phone } = req.body;
            if (!name || !email || !password) {
                return res
                    .status(400)
                    .json({ error: 'name, email e password são obrigatórios' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                },
            });

            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            const { name, email, phone } = req.body;
            if (id === 1) {
                return res.json({
                    id: 1,
                    name: name || 'Usuário Local',
                    email: email || 'local@example.com',
                    phone: phone || '123456789',
                    createdAt: new Date(),
                });
            } else {
                return res
                    .status(404)
                    .json({ error: 'Usuário não encontrado' });
            }
        }
        try {
            const id = Number(req.params.id);
            const { name, email, phone } = req.body;

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { name, email, phone },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            });
            res.json(updatedUser);
        } catch (error) {
            if (error.code === 'P2025') {
                return res
                    .status(404)
                    .json({ error: 'Usuário não encontrado' });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async remove(req, res) {
        if (process.env.USE_DB !== 'true') {
            const id = Number(req.params.id);
            if (id === 1) {
            }
            res.status(500).json({ error: error.message });
        }
    }
}

export default UserController;
