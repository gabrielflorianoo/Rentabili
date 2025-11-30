import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import './DashBoard.css';
import GraficoLinha from '../components/GraficoLinha';
import GraficoDonut from '../components/GraficoDonut';
import { dashboardApi, investmentsApi } from '../services/apis';

export default function Dashboard() {
    const navigate = useNavigate();

    // Estado do usuário logado
    const [userData, setUserData] = useState({ name: 'Carregando...' });

    // Resumo geral do dashboard
    const [summary, setSummary] = useState({ totalBalance: 0, activesCount: 0 });

    // Lista de investimentos
    const [investmentos, setInvestmentos] = useState([]);
    const [totalInvested, setTotalInvested] = useState(0);
    const [totalGain, setTotalGain] = useState(0);
    const [rentabilidade, setRentabilidade] = useState(0);

    // Estados de carregamento e erro
    const [loading, setLoading] = useState(true);
    const [loadingInvestments, setLoadingInvestments] = useState(true);
    const [error, setError] = useState(null);

    // Dados para gráficos
    const [graphData, setGraphData] = useState([]);
    const [donutData, setDonutData] = useState([]);

    useEffect(() => {
        // Verifica autenticação
        const user = servicoAutenticacao.obterUsuarioAtual();
        const token = servicoAutenticacao.obterToken();
        if (!user || !token) {
            navigate('/');
            return;
        }
        setUserData(user);

        const getDashboardData = async () => {
            setLoading(true);
            setError(null);
            setLoadingInvestments(true);
            try {
                // Busca resumo geral do dashboard
                const data = await dashboardApi.getSummary();
                if (data.totalBalance !== undefined) setSummary(data);

                // Busca total investido e ganho/perda
                const [totalInvestedData, gainLossData] = await Promise.all([
                    investmentsApi.getTotalInvested(),
                    investmentsApi.getGainLoss(),
                ]);
                setTotalInvested(totalInvestedData.totalInvested || 0);
                setTotalGain(gainLossData.gainLoss || 0);

                // Lista de investimentos detalhados
                const invs = await investmentsApi.list();

                // Função para normalizar valores numéricos (string ou número)
                const parseAmount = (val) => {
                    if (val == null) return 0;
                    if (typeof val === 'number') return val;
                    let s = String(val).trim();
                    if (s === '') return 0;
                    if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
                    else if (s.includes(',')) s = s.replace(',', '.');
                    return parseFloat(s) || 0;
                };

                // Normaliza dados e categoriza tipo de investimento
                const normalized = invs.map((i) => {
                    const rawKind = (i.kind ?? 'Outros') + '';
                    let kindNorm;
                    if (rawKind.toLowerCase().includes('cdb') || rawKind.toLowerCase().includes('renda fixa')) kindNorm = 'Renda Fixa';
                    else if (rawKind.toLowerCase().includes('fundo')) kindNorm = 'Fundos';
                    else if (rawKind.toLowerCase().includes('ação')) kindNorm = 'Ações';
                    else kindNorm = 'Outros';
                    return { ...i, kind: kindNorm, amountNum: parseAmount(i.amount) };
                });

                setInvestmentos(normalized);

                // Calcula rentabilidade percentual
                const rentabilidadePorcentagem =
                    totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : 0;
                setRentabilidade(rentabilidadePorcentagem);

                // Dados para gráfico de donut (distribuição)
                const donutDataMap = normalized.reduce((acc, item) => {
                    if (item.kind !== 'Renda') acc[item.kind] = (acc[item.kind] || 0) + item.amountNum;
                    return acc;
                }, {});
                const processedDonutData = Object.keys(donutDataMap).map((kind) => ({
                    name: kind,
                    value: donutDataMap[kind],
                }));
                setDonutData(processedDonutData);

                // Dados para gráfico de linha (evolução mensal)
                const monthlyEvolution = normalized.reduce((acc, item) => {
                    const date = new Date(item.date);
                    const month = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
                    const year = date.getFullYear();
                    const key = `${month}-${year}`;
                    if (!acc[key]) acc[key] = { mes: `${month} - ${year}`, valor: 0, timestamp: date.getTime() };
                    acc[key].valor += item.amountNum;
                    return acc;
                }, {});
                const sortedLineGraphData = Object.values(monthlyEvolution)
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((item) => ({ mes: item.mes, valor: Number(item.valor).toFixed(2) }));
                setGraphData(sortedLineGraphData);

            } catch (err) {
                console.error('Erro ao conectar no dashboard ou carregar investimentos:', err);
                setError('Erro ao carregar dados do dashboard.');
                if (err.response?.status === 401) {
                    servicoAutenticacao.sair();
                    navigate('/');
                }
            } finally {
                setLoading(false);
                setLoadingInvestments(false);
            }
        };
        getDashboardData();
    }, [navigate]);

    return (
        <div className="dashboard-wrap">
            <div className="content">
                <header className="content-head">
                    <h2>Dashboard</h2>
                    <div className="user-badge">👤 {userData.name}</div>
                </header>

                <section className="summary">
                    <div className="left">
                        <h3>Patrimônio Total</h3>
                        <div className="big">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalBalance)}
                        </div>
                        <div className="acc">
                            Baseado em <strong>{summary.activesCount}</strong> ativos encontrados no banco.
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <div className="small-card">
                                <div className="small-label">Total Investido</div>
                                <div className="small-value">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
                                </div>
                            </div>

                            {loadingInvestments ? (
                                <p className="loading">Carregando...</p>
                            ) : (
                                <>
                                    <div className="small-card" style={{ marginTop: 8 }}>
                                        <div className="small-label">Ganho/Perda Investimentos</div>
                                        <div className="small-value" style={{
                                            color: totalGain >= 0 ? '#2f8a2f' : '#d90429',
                                            fontWeight: 700,
                                        }}>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGain)}
                                        </div>
                                    </div>

                                    <section className="widgets">
                                        <div className="widget">
                                            <div className="pie" style={{
                                                fontSize: '2rem',
                                                color: rentabilidade > 0 ? '#2f8a2f' : rentabilidade === 0 ? '#808080' : '#ff0000',
                                                fontWeight: 'bold',
                                            }}>
                                                {rentabilidade}%
                                            </div>
                                            <div>Rentabilidade Mensal</div>
                                        </div>

                                        <div className="widget">
                                            {error && <p style={{ color: 'red' }}>{error}</p>}
                                            {!loading && !error && donutData.length > 0 && <GraficoDonut data={donutData} />}
                                            {!loading && !error && donutData.length === 0 && <p>Nenhum dado de distribuição disponível.</p>}
                                            <div style={{ marginTop: -10 }}>Carteira Diversificada</div>
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="right">
                        <div className="evol" style={{ marginBottom: '10px', fontWeight: '600' }}>Evolução</div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {!loading && !error && graphData.length > 0 && <GraficoLinha data={graphData} />}
                        {!loading && !error && graphData.length === 0 && <p>Nenhum dado de evolução disponível.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}
