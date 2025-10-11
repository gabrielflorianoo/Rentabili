class UserController {
    constructor() {
        this.users = [
            { id: 1, name: "Gabriela", email: "gabriela@example.com" },
            { id: 2, name: "João", email: "joao@example.com" }
        ];

        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    getAll(req, res) {
        res.json(this.users);
    }

    getById(req, res) {
        const id = Number(req.params.id);
        const user = this.users.find(u => u.id === id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
        res.json(user);
    }

    create(req, res) {
        const { name, email } = req.body || {};
        if (!name || !email) return res.status(400).json({ error: "name e email são obrigatórios" });
        const id = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        const newUser = { id, name, email };
        this.users.push(newUser);
        res.status(201).json(newUser);
    }

    update(req, res) {
        const id = Number(req.params.id);
        const idx = this.users.findIndex(u => u.id === id);
        if (idx === -1) return res.status(404).json({ error: "Usuário não encontrado" });
        const { name, email } = req.body || {};
        if (name !== undefined) this.users[idx].name = name;
        if (email !== undefined) this.users[idx].email = email;
        res.json(this.users[idx]);
    }

    remove(req, res) {
        const id = Number(req.params.id);
        const idx = this.users.findIndex(u => u.id === id);
        if (idx === -1) return res.status(404).json({ error: "Usuário não encontrado" });
        this.users.splice(idx, 1);
        res.status(204).send();
    }
}

export default UserController;