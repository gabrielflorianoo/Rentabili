// backend/src/services/authService.js
import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (username, password) => {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário no banco de dados
    const user = await userRepository.create(username, hashedPassword);

    return user;
};

const login = async (username, password) => {
    // Buscar usuário no banco de dados
    const user = await userRepository.findByUsername(username);

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    // Comparar senhas
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error('Senha incorreta');
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret', {
        expiresIn: '1h',
    });

    return token;
};

export default { register, login };
