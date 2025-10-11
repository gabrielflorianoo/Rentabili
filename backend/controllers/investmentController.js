class InvestmentController {
    constructor() {
        this.investments = [
            { id: 1, name: 'Tesla', value: 1000, walletId: 1, createdAt: new Date().toISOString() },
            { id: 2, name: 'Amazon', value: 2000, walletId: 1, createdAt: new Date().toISOString() }
        ];

        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    getAll(req, res) {
        res.json(this.investments);
    }

    getById(req, res) {
        const id = Number(req.params.id);
        const item = this.investments.find(i => i.id === id);
        if (!item) return res.status(404).json({ error: 'Investimento não encontrado' });
        res.json(item);
    }

    create(req, res) {
        const { name, value, walletId } = req.body || {};
        if (!name || value === undefined) return res.status(400).json({ error: 'name e value são obrigatórios' });
        const id = this.investments.length ? Math.max(...this.investments.map(i => i.id)) + 1 : 1;
        const newItem = { id, name, value, walletId: walletId ?? null, createdAt: new Date().toISOString() };
        this.investments.push(newItem);
        res.status(201).json(newItem);
    }

    update(req, res) {
        const id = Number(req.params.id);
        const idx = this.investments.findIndex(i => i.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Investimento não encontrado' });
        const { name, value, walletId } = req.body || {};
        if (name !== undefined) this.investments[idx].name = name;
        if (value !== undefined) this.investments[idx].value = value;
        if (walletId !== undefined) this.investments[idx].walletId = walletId;
        res.json(this.investments[idx]);
    }

    remove(req, res) {
        const id = Number(req.params.id);
        const idx = this.investments.findIndex(i => i.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Investimento não encontrado' });
        this.investments.splice(idx, 1);
        res.status(204).send();
    }
}

export default InvestmentController;
