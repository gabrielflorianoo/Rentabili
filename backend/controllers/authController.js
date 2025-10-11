import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserController from './userController.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = '1h';

class AuthController {
	constructor() {
		this.userController = new UserController();
		if (!this._passwordsSeeded) {
			this.userController.users = this.userController.users.map(u => ({
				...u,
				passwordHash: bcrypt.hashSync('password', 8)
			}));
			this._passwordsSeeded = true;
		}

		this.login = this.login.bind(this);
	}

	async login(req, res) {
		const { email, password } = req.body || {};
		if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

		const user = this.userController.users.find(u => u.email === email);
		if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

		const match = await bcrypt.compare(password, user.passwordHash);
		if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

		const payload = { id: user.id, email: user.email, name: user.name };
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		res.json({ token, user: payload });
	}
}

export default AuthController;
