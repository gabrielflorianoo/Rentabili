class TransactionController {
    constructor() {
        this.transactions = [
            { id: 1, type: 'deposit', amount: 500, walletId: 1, description: 'Depósito inicial', createdAt: new Date().toISOString() },
            { id: 2, type: 'buy', amount: 1000, investmentId: 1, walletId: 1, description: 'Compra de ações', createdAt: new Date().toISOString() }
        ];

        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    getAll(req, res) {
        res.json(this.transactions);
    }

    getById(req, res) {
        const id = Number(req.params.id);
        const item = this.transactions.find(t => t.id === id);
        if (!item) return res.status(404).json({ error: 'Transação não encontrada' });
        res.json(item);
    }

    create(req, res) {
        const { type, amount, walletId, investmentId, description } = req.body || {};
        if (!type || amount === undefined) return res.status(400).json({ error: 'type e amount são obrigatórios' });
        const id = this.transactions.length ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1;
        const newItem = { id, type, amount, walletId: walletId ?? null, investmentId: investmentId ?? null, description: description ?? '', createdAt: new Date().toISOString() };
        this.transactions.push(newItem);
        res.status(201).json(newItem);
    }

    update(req, res) {
        const id = Number(req.params.id);
        const idx = this.transactions.findIndex(t => t.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Transação não encontrada' });
        const { type, amount, walletId, investmentId, description } = req.body || {};
        if (type !== undefined) this.transactions[idx].type = type;
        if (amount !== undefined) this.transactions[idx].amount = amount;
        if (walletId !== undefined) this.transactions[idx].walletId = walletId;
        if (investmentId !== undefined) this.transactions[idx].investmentId = investmentId;
        if (description !== undefined) this.transactions[idx].description = description;
        res.json(this.transactions[idx]);
    }

    remove(req, res) {
        const id = Number(req.params.id);
        const idx = this.transactions.findIndex(t => t.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Transação não encontrada' });
        this.transactions.splice(idx, 1);
        res.status(204).send();
    }
}

export default TransactionController;
