import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import './DashBoard.css';
import Sidebar from '../components/Sidebar';
import GraficoLinha from '../components/GraficoLinha';
import GraficoDonut from '../components/GraficoDonut';

import { dashboardApi } from '../services/apis';
import { investmentsApi } from '../services/apis';

export default function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Carregando...' });
    const [summary, setSummary] = useState({
        totalBalance: 0,
        activesCount: 0,
    });
    const [investments, setInvestments] = useState([]);
    const [totalInvested, setTotalInvested] = useState(0);
    const [totalGain, setTotalGain] = useState(0);
    const [rentabilidade, setRentabilidade] = useState(0);

    useEffect(() => {
        const user = servicoAutenticacao.obterUsuarioAtual();
        const token = servicoAutenticacao.obterToken();

        if (!user || !token) {
            navigate('/');
            return;
        }
        setUserData(user);

        // BUSCA DADOS REAIS NO BACK-END
        const getDashboardData = async () => {
            try {
                const data = await dashboardApi.getSummary();
                if (data.totalBalance !== undefined) {
                    setSummary(data);
                }

                // Busca investimentos para calcular total investido e rentabilidade
                const invs = await investmentsApi.list().catch(() => []);

                // Normaliza kind e amount para evitar problemas de tipagem/formatos
                const parseAmount = (val) => {
                    if (val === null || val === undefined) return 0;
                    if (typeof val === 'number') return val;
                    const s = String(val).trim();
                    if (s === '') return 0;
                    try {
                        // Caso o número venha com separador de milhares e vírgula decimal (ex: "10.000,00")
                        if (s.indexOf(',') > -1 && s.indexOf('.') > -1) {
                            // assume '.' milhares e ',' decimal
                            return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
                        }
                        // caso venha com vírgula decimal (ex: "1000,50")
                        if (s.indexOf(',') > -1 && s.indexOf('.') === -1) {
                            return parseFloat(s.replace(',', '.')) || 0;
                        }
                        // caso padrão inglês (ex: "13284.81")
                        return parseFloat(s) || 0;
                    } catch (e) {
                        return 0;
                    }
                };

                const normalized = invs.map(i => {
                    const rawKind = (i.kind ?? 'Investimento') + '';
                    const kindNorm = rawKind.toLowerCase() === 'renda' ? 'Renda' : 'Investimento';
                    return { ...i, kind: kindNorm, amountNum: parseAmount(i.amount) };
                });

                // mantemos a lista normalizada no estado para debug/uso futuro
                setInvestments(normalized || []);

                const invested = (normalized || [])
                    .filter(it => it.kind === 'Investimento')
                    .reduce((acc, it) => acc + (it.amountNum || 0), 0);

                // Somar ganhos/perdas como DELTA entre cada 'Renda' e o investimento anterior do mesmo ativo
                const investmentsByActive = (normalized || [])
                    .filter(it => it.kind === 'Investimento')
                    .reduce((map, it) => {
                        if (!map[it.activeId]) map[it.activeId] = [];
                        map[it.activeId].push(it);
                        return map;
                    }, {});

                // sort investments per active by date asc
                Object.keys(investmentsByActive).forEach(k => investmentsByActive[k].sort((a, b) => new Date(a.date) - new Date(b.date)));

                const gain = (normalized || [])
                    .filter(it => it.kind === 'Renda')
                    .reduce((acc, renda) => {
                        const list = investmentsByActive[renda.activeId] || [];
                        // find latest investment with date <= renda.date
                        const base = list.slice().reverse().find(inv => new Date(inv.date) <= new Date(renda.date));
                        if (base) {
                            const delta = (renda.amountNum || 0) - (base.amountNum || 0);
                            return acc + delta;
                        }
                        // fallback: if no base found, assume renda.amountNum is already the delta
                        return acc + (renda.amountNum || 0);
                    }, 0);

                console.log('Investimentos normalizados:', normalized);

                setTotalInvested(invested);
                // totalBalance pode ser string/number
                setTotalGain(gain);

                const rentabilidadePorcentagem = Math.floor(gain / invested) / 100;

                setRentabilidade(rentabilidadePorcentagem);
            } catch (err) {
                console.error('Erro ao conectar no dashboard ou carregar investimentos:', err);
                if (err.response?.status === 401) {
                    // Se o token venceu, desloga
                    servicoAutenticacao.sair();
                    navigate('/');
                }
            }
        }

        getDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        servicoAutenticacao.sair();
        navigate('/');
    };

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} paginaAtiva="dashboard" />
            <div className="content">
                <header className="content-head">
                    <h2>Dashboard</h2>
                    <div className="user-badge">👤 {userData.name}</div>
                </header>

                <section className="summary">
                    <div className="left">
                        <h3>Patrimônio Total</h3>
                        {/* Formata dinheiro para R$ */}
                        <div className="big">
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(summary.totalBalance)}
                        </div>
                        <div className="acc">
                            Baseado em <strong>{summary.activesCount}</strong>{' '}
                            ativos encontrados no banco.
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <div className="small-card">
                                <div className="small-label">Total Investido</div>
                                <div className="small-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}</div>
                            </div>
                            <div className="small-card" style={{ marginTop: 8 }}>
                                <div className="small-label">Ganho/Perda Investimentos</div>
                                <div className="small-value" style={{ color: totalGain >= 0 ? '#2f8a2f' : '#d90429', fontWeight: 700 }}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGain)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div
                            className="evol"
                            style={{ marginBottom: '10px', fontWeight: '600' }}
                        >
                            Evolução
                        </div>
                        <GraficoLinha
                            data={[
                                { mes: "JAN", valor: 2 },
                                { mes: "FEB", valor: 4 },
                                { mes: "MAR", valor: 6 },
                                { mes: "APR", valor: 8 }
                            ]}
                        />
                    </div>
                </section>

                <section className="widgets">
                    <div className="widget">
                        <div
                            className="pie"
                            style={{
                                fontSize: '2rem',
                                color: rentabilidade > 0
                                    ? '#2f8a2f'
                                    : rentabilidade === 0
                                        ? '#808080'
                                        : '#ff0000',
                                fontWeight: 'bold',
                            }}
                        >
                            +{rentabilidade}%
                        </div>
                        <div>Rentabilidade Mensal</div>
                    </div>
                    <div className="widget">
                        <GraficoDonut
                            data={[
                                { name: "Ações", value: 40 },
                                { name: "Fundos", value: 25 },
                                { name: "Renda Fixa", value: 20 },
                                { name: "Criptomoedas", value: 15 }
                            ]}
                        />
                        <div style={{ marginTop: -10 }}>Carteira Diversificada</div>
                    </div>
                </section>
            </div>
        </div>
    );
}