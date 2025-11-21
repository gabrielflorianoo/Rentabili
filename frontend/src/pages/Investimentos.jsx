import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../utils/api';
import './Investimentos.css';

function Sidebar({ aoSair, paginaAtiva }) {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <div className="logo">📈<strong>RENTABIL</strong></div>
            <nav>
                <a onClick={() => navigate('/dashboard')} className={paginaAtiva === 'dashboard' ? 'active' : ''}>Dashboard</a>
                <a onClick={() => navigate('/investimentos')} className={paginaAtiva === 'investimentos' ? 'active' : ''}>Investimentos</a>
                <a onClick={() => navigate('/relatorios')} className={paginaAtiva === 'relatorios' ? 'active' : ''}>Relatórios</a>
                <a onClick={aoSair} style={{ marginTop: 'auto', color: '#d90429', cursor: 'pointer' }}>
                    Sair da Conta
                </a>
            </nav>
        </aside>
    )
}

export default function Investimentos() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Carregando...' });
    const [investimentos, setInvestimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [investimentoEditando, setInvestimentoEditando] = useState(null);
    const [formData, setFormData] = useState({
        activeId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
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
    }, [navigate]);

    const carregarInvestimentos = async () => {
        try {
            setCarregando(true);
            const data = await getInvestments();
            setInvestimentos(data || []);
        } catch (err) {
            console.error("Erro ao carregar investimentos:", err);
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
                date: new Date(investimento.date).toISOString().split('T')[0]
            });
        } else {
            setInvestimentoEditando(null);
            setFormData({
                activeId: '',
                amount: '',
                date: new Date().toISOString().split('T')[0]
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
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dados = {
                ...formData,
                amount: parseFloat(formData.amount),
                activeId: parseInt(formData.activeId)
            };

            if (investimentoEditando) {
                await updateInvestment(investimentoEditando.id, dados);
            } else {
                await createInvestment(dados);
            }

            fecharModal();
            carregarInvestimentos();
        } catch (err) {
            console.error("Erro ao salvar investimento:", err);
            alert("Erro ao salvar investimento: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este investimento?')) return;

        try {
            await deleteInvestment(id);
            carregarInvestimentos();
        } catch (err) {
            console.error("Erro ao excluir investimento:", err);
            alert("Erro ao excluir investimento: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} paginaAtiva="investimentos" />
            <div className="content">
                <header className="content-head">
                    <h2>Investimentos</h2>
                    <div className="user-badge">👤 {userData.name}</div>
                </header>

                <div className="actions-bar">
                    <button className="btn-primary" onClick={() => abrirModal()}>
                        + Novo Investimento
                    </button>
                </div>

                {carregando ? (
                    <div className="loading">Carregando investimentos...</div>
                ) : (
                    <div className="table-container">
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
                                {investimentos.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                            Nenhum investimento cadastrado
                                        </td>
                                    </tr>
                                ) : (
                                    investimentos.map(inv => (
                                        <tr key={inv.id}>
                                            <td>{inv.id}</td>
                                            <td>{inv.active?.name || `Ativo #${inv.activeId}`}</td>
                                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.amount)}</td>
                                            <td>{new Date(inv.date).toLocaleDateString('pt-BR')}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => abrirModal(inv)}>✏️</button>
                                                <button className="btn-delete" onClick={() => handleDelete(inv.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {mostrarModal && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>{investimentoEditando ? 'Editar Investimento' : 'Novo Investimento'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>ID do Ativo</label>
                                    <input
                                        type="number"
                                        value={formData.activeId}
                                        onChange={(e) => setFormData({ ...formData, activeId: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Valor</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Data</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={fecharModal}>Cancelar</button>
                                    <button type="submit" className="btn-save">Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
