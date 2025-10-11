class WalletController {
    constructor() {
        this.wallets = [
            { id: 1, name: 'Carteira Principal', balance: 2500, createdAt: new Date().toISOString() }
        ];

        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    getAll(req, res) {
        res.json(this.wallets);
    }

    getById(req, res) {
        const id = Number(req.params.id);
        const item = this.wallets.find(w => w.id === id);
        if (!item) return res.status(404).json({ error: 'Carteira não encontrada' });
        res.json(item);
    }

    create(req, res) {
        const { name, balance } = req.body || {};
        if (!name) return res.status(400).json({ error: 'name é obrigatório' });
        const id = this.wallets.length ? Math.max(...this.wallets.map(w => w.id)) + 1 : 1;
        const newItem = { id, name, balance: balance ?? 0, createdAt: new Date().toISOString() };
        this.wallets.push(newItem);
        res.status(201).json(newItem);
    }

    update(req, res) {
        const id = Number(req.params.id);
        const idx = this.wallets.findIndex(w => w.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Carteira não encontrada' });
        const { name, balance } = req.body || {};
        if (name !== undefined) this.wallets[idx].name = name;
        if (balance !== undefined) this.wallets[idx].balance = balance;
        res.json(this.wallets[idx]);
    }

    remove(req, res) {
        const id = Number(req.params.id);
        const idx = this.wallets.findIndex(w => w.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Carteira não encontrada' });
        this.wallets.splice(idx, 1);
        res.status(204).send();
    }
}

export default WalletController;
