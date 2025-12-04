import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import { dashboardApi } from '../services/apis';
import Sidebar from '../components/Sidebar'; 
import {
    useTopPerformers,
    usePortfolioEvolution,
    useAllocation,
} from '../hooks/usePerformanceHooks';
import {
    EvolutionLineChart,
    AllocationPieChart,
    TopPerformersWidget,
    PerformanceBarChart,
} from '../components/PerformanceCharts';
import './DashBoard.css';

// --- IMPORTAÇÃO DAS BIBLIOTECAS GRÁFICAS ---
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Registra os componentes do gráfico para eles funcionarem
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Investidor' });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Estado para Interatividade (Filtro ao clicar no gráfico)
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Custom hooks para performance
    const { topPerformers, loading: topLoading } = useTopPerformers(5);
    const { evolution, loading: evolutionLoading } = usePortfolioEvolution(12);
    const { allocation, loading: allocationLoading } = useAllocation();

    useEffect(() => {
        const user = servicoAutenticacao.obterUsuarioAtual();
        const token = servicoAutenticacao.obterToken();

        if (!user || !token) {
            navigate('/');
            return;
        }
        setUserData(user);

        const fetchData = async () => {
            try {
                const response = await dashboardApi.getSummary();
                setData(response);
            } catch (error) {
                console.error("Erro no dashboard:", error);
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

    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    // Prepara dados para o Gráfico de Rosca (Doughnut)
    const doughnutData = {
        labels: data?.allocationChart?.map(i => i.name) || [],
        datasets: [{
            data: data?.allocationChart?.map(i => i.value) || [],
            backgroundColor: ['#00a651', '#0077b6', '#9b5de5', '#f15bb5', '#fee440', '#ff9f43'],
            borderWidth: 0,
        }]
    };

    const doughnutOptions = {
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const categoryName = doughnutData.labels[index];
                setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
            }
        },
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 } } }
        },
        maintainAspectRatio: false
    };

    // Prepara dados para o Gráfico de Linha (Line)
    const lineData = {
        labels: data?.historyChart?.map(h => h.month) || [],
        datasets: [{
            label: 'Evolução Patrimonial',
            data: data?.historyChart?.map(h => h.amount) || [],
            fill: true,
            backgroundColor: 'rgba(0, 166, 81, 0.1)',
            borderColor: '#00a651',
            tension: 0.4,
            pointRadius: 4
        }]
    };

    if (loading) return <div className="loading">Carregando inteligência financeira...</div>;

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} paginaAtiva="dashboard" />
            
            <div className="content">
                <header className="content-head">
                    <div>
                        <h2>Olá, {userData.name}</h2>
                        <p className="subtitle">Visão geral da sua estratégia de investimentos.</p>
                    </div>
                    <div className={`status-badge ${data?.totalGain >= 0 ? 'profit' : 'loss'}`}>
                        {data?.totalGain >= 0 ? '🚀 Carteira Rentável' : '📉 Atenção Necessária'}
                    </div>
                </header>

                {/* 1. CARDS DE KPI */}
                <div className="kpi-grid">
                    <div className="kpi-card main">
                        <div className="kpi-icon">💰</div>
                        <div>
                            <span>Patrimônio Total</span>
                            <h3>{formatBRL(data?.totalBalance)}</h3>
                        </div>
                    </div>
                    
                    <div className="kpi-card">
                        <div className="kpi-icon">📥</div>
                        <div>
                            <span>Total Aportado</span>
                            <h3>{formatBRL(data?.totalInvested)}</h3>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon">📈</div>
                        <div>
                            <span>Rentabilidade</span>
                            <h3 style={{color: data?.totalGain >= 0 ? '#00a651' : '#d90429'}}>
                                {data?.totalGain >= 0 ? '+' : ''}{data?.profitability}%
                            </h3>
                            <small>{formatBRL(data?.totalGain)} de lucro real</small>
                        </div>
                    </div>
                </div>

                <div className="dashboard-split">
                    
                    {/* 2. GRÁFICO DE ALOCAÇÃO */}
                    <section className="chart-section glass-panel">
                        <div className="section-header">
                            <h3>Alocação de Ativos</h3>
                            {selectedCategory && 
                                <button className="btn-reset" onClick={() => setSelectedCategory(null)}>Ver Todos</button>
                            }
                        </div>
                        <div className="chart-container-donut">
                            {data?.allocationChart?.length > 0 ? (
                                <div style={{ width: '100%', height: '100%' }}>
                                    <Doughnut data={doughnutData} options={doughnutOptions} />
                                </div>
                            ) : (
                                <p className="empty-state">Cadastre ativos para ver sua alocação.</p>
                            )}
                        </div>
                        <p className="chart-hint">💡 Clique nas fatias para filtrar detalhes</p>
                    </section>

                    {/* 3. DETALHES DINÂMICOS */}
                    <section className="details-section glass-panel">
                        <h3>{selectedCategory ? `Detalhes: ${selectedCategory}` : 'Evolução & Destaques'}</h3>
                        
                        {selectedCategory ? (
                            <div className="category-detail-view">
                                <div className="detail-box">
                                    <span>Valor em {selectedCategory}</span>
                                    <strong>
                                        {formatBRL(data.allocationChart.find(c => c.name === selectedCategory)?.value)}
                                    </strong>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="fill" 
                                        style={{width: `${(data.allocationChart.find(x => x.name === selectedCategory)?.value / data.totalBalance * 100)}%`}}
                                    ></div>
                                </div>
                                <p>Isso representa uma parte estratégica do seu portfólio.</p>
                                <button className="btn-action" onClick={() => navigate('/actives')}>Gerenciar Ativos</button>
                            </div>
                        ) : (
                            <div className="chart-container-line">
                                <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        )}
                    </section>
                </div>

                {/* 4. GRÁFICOS DE PERFORMANCE */}
                <section className="performance-section glass-panel">
                    <h3>📊 Análise de Performance</h3>
                    <div className="performance-grid">
                        <div className="chart-wrapper">
                            <EvolutionLineChart
                                data={evolution}
                                title="Evolução Patrimonial (12 meses)"
                            />
                        </div>
                        <div className="chart-wrapper">
                            <AllocationPieChart
                                data={allocation}
                                title="Distribuição de Ativos"
                            />
                        </div>
                    </div>
                </section>

                {/* 5. TOP PERFORMERS */}
                <section className="top-performers-section">
                    <TopPerformersWidget
                        topPerformers={topPerformers}
                        loading={topLoading}
                        error={null}
                    />
                </section>

                {/* 6. ÚLTIMAS MOVIMENTAÇÕES */}
                <section className="transactions-section">
                    <h3>Últimas Movimentações</h3>
                    <div className="transactions-list-horizontal">
                        {data?.recentTransactions?.length > 0 ? (
                            data.recentTransactions.map(t => (
                                <div key={t.id} className="trans-card-mini">
                                    <span className={`trans-type ${t.kind === 'Investimento' ? 'in' : 'profit'}`}>
                                        {t.kind === 'Investimento' ? 'Aporte' : 'Rendimento'}
                                    </span>
                                    <strong>{formatBRL(t.amount)}</strong>
                                    <small>{new Date(t.date).toLocaleDateString('pt-BR')}</small>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">Nenhuma movimentação registrada.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
