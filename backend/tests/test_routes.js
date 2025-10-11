// Script de teste para rotas REST (assume que o servidor está rodando em http://localhost:3000)
// Executar: node tests/test_routes.js
// Testes feitos usando IA

const base = 'http://localhost:3000';

async function req(method, path, body) {
    const url = base + path;
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body !== undefined) opts.body = JSON.stringify(body);
    try {
        const res = await fetch(url, opts);
        const text = await res.text();
        let data = text;
        try { data = JSON.parse(text); } catch (e) { /* not json */ }
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        return { error: err.message };
    }
}

function print(title) {
    console.log('\n=== ' + title + ' ===');
}

function show(res) {
    if (res.error) console.log('ERROR:', res.error);
    else console.log('Status:', res.status, '\nBody:', res.data);
}

async function testUsers() {
    print('Users: GET /users');
    show(await req('GET', '/users'));

    print('Users: POST /users');
    const created = await req('POST', '/users', { name: 'Tester', email: 'tester@example.com' });
    show(created);
    const userId = created.data?.id;

    if (userId) {
        print('Users: GET /users/:id');
        show(await req('GET', `/users/${userId}`));

        print('Users: PUT /users/:id');
        show(await req('PUT', `/users/${userId}`, { name: 'Tester Updated' }));

        print('Users: DELETE /users/:id');
        show(await req('DELETE', `/users/${userId}`));

        print('Users: GET /users/:id (espera 404)');
        show(await req('GET', `/users/${userId}`));
    }
}

async function testWalletsInvestmentsTransactions() {
    // Wallet
    print('Wallets: GET /wallets');
    show(await req('GET', '/wallets'));

    print('Wallets: POST /wallets');
    const createdWallet = await req('POST', '/wallets', { name: 'Carteira Teste', balance: 1000 });
    show(createdWallet);
    const walletId = createdWallet.data?.id;

    // Investment (needs walletId)
    print('Investments: GET /investments');
    show(await req('GET', '/investments'));

    print('Investments: POST /investments');
    const createdInvestment = await req('POST', '/investments', { name: 'Ação Teste', value: 500, walletId });
    show(createdInvestment);
    const investmentId = createdInvestment.data?.id;

    // Transactions (can use walletId and investmentId)
    print('Transactions: GET /transactions');
    show(await req('GET', '/transactions'));

    print('Transactions: POST (deposit) /transactions');
    const deposit = await req('POST', '/transactions', { type: 'deposit', amount: 250, walletId, description: 'Depósito teste' });
    show(deposit);

    print('Transactions: POST (buy) /transactions');
    const buy = await req('POST', '/transactions', { type: 'buy', amount: 500, walletId, investmentId, description: 'Compra teste' });
    show(buy);

    // Cleanup: delete created investment and wallet
    if (investmentId) {
        print('Investments: DELETE /investments/:id');
        show(await req('DELETE', `/investments/${investmentId}`));
    }
    if (walletId) {
        print('Wallets: DELETE /wallets/:id');
        show(await req('DELETE', `/wallets/${walletId}`));
    }
}

(async function main() {
    console.log('Iniciando testes de rotas. Certifique-se de que o servidor está rodando em http://localhost:3000');

    // feature-detect fetch (Node versions recentes têm fetch global)
    if (typeof fetch === 'undefined') {
        console.error('fetch não disponível no runtime Node. Execute com Node >= 18 ou instale um polyfill (node-fetch).');
        process.exit(1);
    }

    await testUsers();
    await testWalletsInvestmentsTransactions();
    await testAuth();

    console.log('\nTestes finalizados.');
})();

async function testAuth() {
    print('Auth: POST /auth/login');
    // demo user from userController has email gabriela@example.com and default password 'password'
    const res = await req('POST', '/auth/login', { email: 'gabriela@example.com', password: 'password' });
    show(res);
}