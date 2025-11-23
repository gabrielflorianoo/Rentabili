import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import {
    investmentsApi,
    activesApi,
} from '../services/apis';
import { generateInvestment } from '../utils/fakeData';
import './Investimentos.css';
import Sidebar from '../components/Sidebar';

export default function Investimentos() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Carregando...' });
    const [investimentos, setInvestimentos] = useState([]);
    const [actives, setActives] = useState([]);
    const [filterKind, setFilterKind] = useState('Todos');
    const [filterActiveType, setFilterActiveType] = useState('Todos');
    const [carregando, setCarregando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [investimentoEditando, setInvestimentoEditando] = useState(null);
    const [formData, setFormData] = useState({
        activeId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const user = servicoAutenticacao.obterUsuarioAtual();
        const token = servicoAutenticacao.obterToken();

        if (!user || !token) {
            navigate('/');
            return;
        }
        setUserData(user);

        carregarInvestimentos();
        carregarActives();
    }, [navigate]);

    const carregarActives = async () => {
        try {
            const data = await activesApi.list().catch(() => []);
            setActives(data || []);
        } catch (err) {
            console.error('Erro ao carregar ativos:', err);
            setActives([]);
        }
    };

    const carregarInvestimentos = async () => {
        try {
            setCarregando(true);
            const data = await investmentsApi.list();
            setInvestimentos(data || []);
        } catch (err) {
            console.error('Erro ao carregar investimentos:', err);
            if (err.response?.status === 401) {
                servicoAutenticacao.sair();
                navigate('/');
            }
        } finally {
            setCarregando(false);
        }
    };

    const handleLogout = () => {
        servicoAutenticacao.sair();
        navigate('/');
    };

    const abrirModal = (investimento = null) => {
        if (investimento) {
            setInvestimentoEditando(investimento);
            setFormData({
                activeId: investimento.activeId,
                amount: investimento.amount,
                date: new Date(investimento.date).toISOString().split('T')[0],
                kind: investimento.kind || 'Investimento',
            });
        } else {
            setInvestimentoEditando(null);
            setFormData({
                activeId: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                kind: 'Investimento',
            });
        }
        setMostrarModal(true);
    };

    const fecharModal = () => {
        setMostrarModal(false);
        setInvestimentoEditando(null);
        setFormData({
            activeId: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDateISO = new Date(formData.date).toISOString();
            const dados = {
                ...formData,
                amount: parseFloat(formData.amount),
                activeId: parseInt(formData.activeId),
                date: formDateISO,
                kind: formData.kind || 'Investimento',
            };

            if (investimentoEditando) {
                await investmentsApi.update(investimentoEditando.id, dados);
            } else {
                await investmentsApi.create(dados);
            }

            fecharModal();
            carregarInvestimentos();
        } catch (err) {
            console.error('Erro ao salvar investimento:', err);
            alert(
                'Erro ao salvar investimento: ' +
                (err.response?.data?.error || err.message),
            );
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm('Tem certeza que deseja excluir este investimento?')
        )
            return;

        try {
            await investmentsApi.remove(id);
            carregarInvestimentos();
        } catch (err) {
            console.error('Erro ao excluir investimento:', err);
            alert(
                'Erro ao excluir investimento: ' +
                (err.response?.data?.error || err.message),
            );
        }
    };

    const handleSimular = async (inv) => {
        try {
            const token = servicoAutenticacao.obterToken();
            if (!token) {
                alert('Sessão expirada. Faça login novamente.');
                servicoAutenticacao.sair();
                navigate('/');
                return;
            }
            // calcula data do próximo mês
            const base = new Date(inv.date);
            const next = new Date(base);
            next.setMonth(next.getMonth() + 1);

            // variação aleatória entre -5% e +12%
            const min = -0.05;
            const max = 0.12;
            const pct = Math.random() * (max - min) + min;

            const currentAmount = parseFloat(inv.amount);
            const newAmount = parseFloat((currentAmount * (1 + pct)).toFixed(2));

            // Criar entrada do tipo 'Renda' contendo somente o ganho/perda (delta)
            const payload = {
                activeId: inv.activeId,
                amount: newAmount.toFixed(2),
                date: new Date(next).toISOString(),
                kind: 'Renda',
            };

            await createInvestment(payload);
            carregarInvestimentos();
        } catch (err) {
            console.error('Erro ao simular investimento:', err);
            if (err.response?.status === 403) {
                // token inválido/expirado
                alert('Ação não autorizada. Faça login novamente.');
                servicoAutenticacao.sair();
                navigate('/');
                return;
            }
            alert('Erro ao simular investimento: ' + (err.response?.data?.error || err.message));
        }
    };

    // Helper maps
    const activeById = React.useMemo(() => {
        const map = new Map();
        (actives || []).forEach(a => map.set(a.id, a));
        return map;
    }, [actives]);

    const tiposAtivos = React.useMemo(() => {
        const set = new Set();
        (actives || []).forEach(a => { if (a.type) set.add(a.type); });
        return Array.from(set);
    }, [actives]);

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} paginaAtiva="investimentos" />
            <div className="content">
                <header className="content-head">
                    <h2>Investimentos</h2>
                    <div className="user-badge">👤 {userData.name}</div>
                </header>

                <div className="actions-bar">
                    <button
                        className="btn-primary"
                        onClick={() => abrirModal()}
                    >
                        + Novo Investimento
                    </button>
                </div>

                <div className="filters-row">
                    <div className="filter-item">
                        <label>Mostrar:</label>
                        <select value={filterKind} onChange={(e) => setFilterKind(e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="Investimento">Investimentos</option>
                            <option value="Renda">Rendas</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Tipo do Ativo:</label>
                        <select value={filterActiveType} onChange={(e) => setFilterActiveType(e.target.value)}>
                            <option value="Todos">Todos</option>
                            {tiposAtivos.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {carregando ? (
                    <div className="loading">Carregando investimentos...</div>
                ) : (
                    <div className="table-container">
                        {/** Prepare filtered lists **/}
                        {(() => {
                            const filtered = (investimentos || []).filter(inv => {
                                const kindMatch = filterKind === 'Todos' ? true : (inv.kind === filterKind);
                                const ativo = inv.active || activeById.get(inv.activeId);
                                const tipoMatch = filterActiveType === 'Todos' ? true : (ativo && ativo.type === filterActiveType);
                                return kindMatch && tipoMatch;
                            });

                            const investimentosSomente = filtered.filter(i => i.kind !== 'Renda');
                            const rendas = filtered.filter(i => i.kind === 'Renda');

                            return (
                                <>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Ativo</th>
                                                <th>Valor</th>
                                                <th>Data</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {investimentosSomente.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        style={{
                                                            textAlign: 'center',
                                                            padding: '40px',
                                                        }}
                                                    >
                                                        Nenhum investimento cadastrado
                                                    </td>
                                                </tr>
                                            ) : (
                                                investimentosSomente.map((inv) => (
                                                    <tr key={inv.id}>
                                                        <td>{inv.id}</td>
                                                        <td>
                                                            {(inv.active?.name) || (activeById.get(inv.activeId)?.name) || `Ativo #${inv.activeId}`}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.amount)}
                                                        </td>
                                                        <td>
                                                            {new Date(inv.date).toLocaleDateString('pt-BR')}
                                                        </td>
                                                        <td>
                                                            <button className="btn-edit" onClick={() => abrirModal(inv)}>✏️</button>
                                                            <button className="btn-delete" onClick={() => handleDelete(inv.id)}>🗑️</button>
                                                            <button className="btn-simulate" onClick={() => handleSimular(inv)} title="Simular mercado (cria nova renda para o próximo mês)">🔁</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>

                                    {rendas.length > 0 && (
                                        <div className="renda-section">
                                            <h3>Rendas</h3>
                                            <ul className="renda-list">
                                                {rendas.map(r => {
                                                    // tenta achar o investimento base (último investimento deste ativo antes da renda)
                                                    const base = investimentosSomente
                                                        .filter(i => i.activeId === r.activeId && new Date(i.date) <= new Date(r.date))
                                                        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                                                    let displayAmount = r.amount;
                                                    // se encontrarmos base e ambos tiverem amount numérico, mostramos apenas o delta
                                                    const amtR = parseFloat(r.amount) || (typeof r.amountNum === 'number' ? r.amountNum : NaN);
                                                    const amtBase = base ? (parseFloat(base.amount) || (typeof base.amountNum === 'number' ? base.amountNum : NaN)) : NaN;
                                                    if (!isNaN(amtR) && !isNaN(amtBase)) {
                                                        const delta = +(amtR - amtBase).toFixed(2);
                                                        displayAmount = delta;
                                                    }

                                                    return (
                                                        <li key={r.id} className="renda-item">
                                                            {'\u00A0'}{(r.active?.name) || (activeById.get(r.activeId)?.name) || `Ativo #${r.activeId}`} — {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayAmount)} — {new Date(r.date).toLocaleDateString('pt-BR')}
                                                            <button className="btn-delete" style={{ marginLeft: 8 }} onClick={() => handleDelete(r.id)}>🗑️</button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* Modal */}
                {mostrarModal && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>
                                {investimentoEditando
                                    ? 'Editar Investimento'
                                    : 'Novo Investimento'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>ID do Ativo</label>
                                    <input
                                        type="number"
                                        value={formData.activeId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                activeId: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Valor</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                amount: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tipo</label>
                                    <select value={formData.kind} onChange={(e) => setFormData({ ...formData, kind: e.target.value })}>
                                        <option value="Investimento">Investimento</option>
                                        <option value="Renda">Renda</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Data</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                date: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={async () => {
                                            // Tenta buscar ativos válidos do backend
                                            try {
                                                const actives = await getActives().catch(() => []);
                                                const fake = generateInvestment();
                                                if (Array.isArray(actives) && actives.length > 0) {
                                                    const pick = actives[Math.floor(Math.random() * actives.length)];
                                                    fake.activeId = String(pick.id);
                                                }
                                                setFormData(fake);
                                            } catch (err) {
                                                console.error('Erro ao auto-preencher investimentos:', err);
                                                setFormData(generateInvestment());
                                            }
                                        }}
                                        style={{ marginRight: 8 }}
                                    >
                                        Auto-preencher
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={fecharModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-save">
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
