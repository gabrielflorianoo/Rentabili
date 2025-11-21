import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import { getTransactions, getDashboard, getInvestments } from '../utils/api';
import './Relatorios.css';

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

export default function Relatorios() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Carregando...' });
    const [carregando, setCarregando] = useState(true);
    const [transacoes, setTransacoes] = useState([]);
    const [investimentos, setInvestimentos] = useState([]);
    const [resumo, setResumo] = useState({ totalBalance: 0, activesCount: 0 });
    const [filtro, setFiltro] = useState('todos'); // 'todos', 'receitas', 'despesas'
    const [periodo, setPeriodo] = useState('mes'); // 'mes', 'trimestre', 'ano'

    useEffect(() => {
        const user = servicoAutenticacao.obterUsuarioAtual();
        const token = servicoAutenticacao.obterToken();

        if (!user || !token) {
            navigate('/');
            return;
        }
        setUserData(user);

        carregarDados();
    }, [navigate]);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [transData, invData, dashData] = await Promise.all([
                getTransactions().catch(() => []),
                getInvestments().catch(() => []),
                getDashboard().catch(() => ({ totalBalance: 0, activesCount: 0 }))
            ]);

            setTransacoes(transData || []);
            setInvestimentos(invData || []);
            setResumo(dashData);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
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

    // Cálculos de estatísticas
    const calcularEstatisticas = () => {
        const totalReceitas = transacoes
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0);

        const totalDespesas = transacoes
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0);

        const totalInvestido = investimentos
            .reduce((acc, inv) => acc + parseFloat(inv.amount), 0);

        const saldoLiquido = totalReceitas - totalDespesas;

        return {
            totalReceitas,
            totalDespesas,
            totalInvestido,
            saldoLiquido
        };
    };

    const stats = calcularEstatisticas();

    const transacoesFiltradas = transacoes.filter(t => {
        if (filtro === 'receitas') return t.type === 'income';
        if (filtro === 'despesas') return t.type === 'expense';
        return true;
    });

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} paginaAtiva="relatorios" />
            <div className="content">
                <header className="content-head">
                    <h2>Relatórios Financeiros</h2>
                    <div className="user-badge">👤 {userData.name}</div>
                </header>

                {carregando ? (
                    <div className="loading">Carregando relatórios...</div>
                ) : (
                    <>
                        {/* Cards de Estatísticas */}
                        <section className="stats-grid">
                            <div className="stat-card green">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <div className="stat-label">Total em Receitas</div>
                                    <div className="stat-value">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalReceitas)}
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card red">
                                <div className="stat-icon">💸</div>
                                <div className="stat-info">
                                    <div className="stat-label">Total em Despesas</div>
                                    <div className="stat-value">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalDespesas)}
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card blue">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <div className="stat-label">Total Investido</div>
                                    <div className="stat-value">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalInvestido)}
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card purple">
                                <div className="stat-icon">💵</div>
                                <div className="stat-info">
                                    <div className="stat-label">Saldo Líquido</div>
                                    <div className="stat-value">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.saldoLiquido)}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Filtros */}
                        <section className="filters-section">
                            <div className="filter-group">
                                <label>Tipo de Transação:</label>
                                <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                                    <option value="todos">Todas</option>
                                    <option value="receitas">Receitas</option>
                                    <option value="despesas">Despesas</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Período:</label>
                                <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                                    <option value="mes">Último Mês</option>
                                    <option value="trimestre">Último Trimestre</option>
                                    <option value="ano">Último Ano</option>
                                </select>
                            </div>
                        </section>

                        {/* Tabela de Transações */}
                        <section className="report-section">
                            <h3>Histórico de Transações</h3>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Descrição</th>
                                            <th>Tipo</th>
                                            <th>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transacoesFiltradas.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                                                    Nenhuma transação encontrada
                                                </td>
                                            </tr>
                                        ) : (
                                            transacoesFiltradas.map(trans => (
                                                <tr key={trans.id}>
                                                    <td>{new Date(trans.date).toLocaleDateString('pt-BR')}</td>
                                                    <td>{trans.description || 'Sem descrição'}</td>
                                                    <td>
                                                        <span className={`badge ${trans.type === 'income' ? 'badge-green' : 'badge-red'}`}>
                                                            {trans.type === 'income' ? 'Receita' : 'Despesa'}
                                                        </span>
                                                    </td>
                                                    <td className={trans.type === 'income' ? 'text-green' : 'text-red'}>
                                                        {trans.type === 'income' ? '+' : '-'}
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(trans.amount))}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Resumo de Investimentos */}
                        <section className="report-section">
                            <h3>Resumo de Investimentos</h3>
                            <div className="investments-summary">
                                <div className="summary-item">
                                    <span className="summary-label">Total de Investimentos:</span>
                                    <span className="summary-value">{investimentos.length}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Valor Total Investido:</span>
                                    <span className="summary-value">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalInvestido)}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Ativos Diferentes:</span>
                                    <span className="summary-value">{resumo.activesCount}</span>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}
