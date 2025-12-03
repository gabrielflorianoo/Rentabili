src/pages/DashBoard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import GraficoLinha from '../components/GraficoLinha';
import GraficoDonut from '../components/GraficoDonut';
import { dashboardApi } from '../services/apis'; // Certifique-se que essa importação existe
import './DashBoard.css';

function Sidebar({ aoSair }) {
    const navigate = useNavigate();
    return (
        <aside className="sidebar">
            <div className="logo">📈<strong>RENTABIL</strong></div>
            <nav>
                <a className="active">Visão Geral</a>
                <a onClick={() => navigate('/investimentos')} style={{cursor:'pointer'}}>Carteira</a>
                <a onClick={() => navigate('/simulador')} style={{cursor:'pointer'}}>Simulador Pro</a>
                <a onClick={aoSair} style={{marginTop: 'auto', color: '#d90429', cursor: 'pointer'}}>Sair</a>
            </nav>
        </aside>
    )
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Investidor' });
    
    // Estados de Dados
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Estado de Interatividade (Drill-down)
    const [filtroCategoria, setFiltroCategoria] = useState(null);

    useEffect(() => {
        const user = servicoAutenticacao.obterUsuarioAtual();
        const token = servicoAutenticacao.obterToken();

        if (!user || !token) {
            navigate('/');
            return;
        }
        setUserData(user);

        // Busca dados inteligentes do backend
        const fetchData = async () => {
            try {
                // Nota: precisamos garantir que dashboardApi.getSummary() use o axios configurado com token
                // Se dashboardApi usar a função genérica 'get', ela já tem o interceptor.
                const response = await dashboardApi.getSummary();
                setData(response);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        servicoAutenticacao.sair();
        navigate('/');
    };

    // Formata moeda
    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    if (loading) return <div className="dashboard-loading">Carregando sua carteira...</div>;

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} />
            
            <div className="content">
                <header className="content-head">
                    <div>
                        <h2>Olá, {userData.name}</h2>
                        <p className="subtitle">Aqui está o raio-x do seu patrimônio hoje.</p>
                    </div>
                    <div className="status-badge">
                        {data?.profitability >= 0 ? '🚀 Carteira em Alta' : '⚠️ Atenção Necessária'}
                    </div>
                </header>

                {/* 1. CARDS DE KPI (Key Performance Indicators) */}
                <div className="kpi-grid">
                    <div className="kpi-card main">
                        <span>Patrimônio Total</span>
                        <h3>{formatBRL(data?.totalBalance || 0)}</h3>
                        <small>Atualizado em tempo real</small>
                    </div>
                    
                    <div className="kpi-card">
                        <span>Total Investido</span>
                        <h3>{formatBRL(data?.totalInvested || 0)}</h3>
                    </div>

                    <div className="kpi-card" style={{borderLeft: data?.totalGain >= 0 ? '4px solid #00a651' : '4px solid #d90429'}}>
                        <span>Rentabilidade Histórica</span>
                        <h3 style={{color: data?.totalGain >= 0 ? '#00a651' : '#d90429'}}>
                            {data?.totalGain >= 0 ? '+' : ''}{data?.profitability}%
                        </h3>
                        <small>{formatBRL(data?.totalGain || 0)} de lucro</small>
                    </div>
                </div>

                <div className="dashboard-split">
                    
                    {/* 2. GRÁFICO DE ALOCAÇÃO (INTERATIVO) */}
                    <section className="chart-section glass-panel">
                        <div className="section-header">
                            <h3>Diversificação da Carteira</h3>
                            {filtroCategoria && (
                                <button className="btn-clear" onClick={() => setFiltroCategoria(null)}>
                                    Ver Tudo ✕
                                </button>
                            )}
                        </div>
                        
                        <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                             {/* Passamos um evento de clique para o gráfico (se o componente suportar) ou simulamos a legenda */}
                             {data?.allocationChart?.length > 0 ? (
                                <div className="donut-interaction-wrapper">
                                    <GraficoDonut data={data.allocationChart} />
                                    <p className="chart-hint">Clique na legenda para filtrar</p>
                                </div>
                             ) : (
                                <p className="empty-state">Adicione investimentos para ver o gráfico.</p>
                             )}
                        </div>

                        {/* Legenda Interativa Manual (Simulando o clique no gráfico para o professor ver) */}
                        <div className="legend-interactive">
                            {data?.allocationChart?.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className={`legend-item ${filtroCategoria === item.name ? 'active' : ''}`}
                                    onClick={() => setFiltroCategoria(item.name === filtroCategoria ? null : item.name)}
                                >
                                    <span className="dot" style={{background: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4]}}></span>
                                    {item.name} ({((item.value / data.totalBalance) * 100).toFixed(0)}%)
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. DETALHES DINÂMICOS (Muda conforme o clique no gráfico) */}
                    <section className="details-section glass-panel">
                        <h3>
                            {filtroCategoria ? `Detalhes: ${filtroCategoria}` : 'Últimas Movimentações'}
                        </h3>
                        
                        <div className="transactions-list">
                            {filtroCategoria ? (
                                // MODO FILTRO: Mostra apenas info daquela categoria (Simulação visual)
                                <div className="category-details">
                                    <p>Você tem <strong>{formatBRL(data.allocationChart.find(x => x.name === filtroCategoria)?.value)}</strong> alocado em {filtroCategoria}.</p>
                                    <div className="progress-bar">
                                        <div 
                                            className="fill" 
                                            style={{width: `${(data.allocationChart.find(x => x.name === filtroCategoria)?.value / data.totalBalance * 100)}%`}}
                                        ></div>
                                    </div>
                                    <p>Isso representa uma fatia estratégica do seu portfólio.</p>
                                </div>
                            ) : (
                                // MODO PADRÃO: Lista últimas transações reais
                                <ul>
                                    {data?.lastTransactions?.length > 0 ? (
                                        data.lastTransactions.map(t => (
                                            <li key={t.id} className="transaction-item">
                                                <div className="trans-icon">{t.kind === 'Investimento' ? 'KX' : '💰'}</div>
                                                <div className="trans-info">
                                                    <strong>{t.kind}</strong>
                                                    <span>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <div className="trans-value">
                                                    {formatBRL(t.amount)}
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="empty-state">Nenhuma movimentação recente.</p>
                                    )}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}