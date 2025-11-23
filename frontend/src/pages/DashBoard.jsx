import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';
import './DashBoard.css';

import { dashboardApi } from '../services/apis';

function Sidebar({ aoSair }) {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <div className="logo">
                📈<strong>RENTABIL</strong>
            </div>
            <nav>
                <a
                    onClick={() => navigate('/dashboard')}
                    className="active"
                    style={{ cursor: 'pointer' }}
                >
                    Dashboard
                </a>
                <a
                    onClick={() => navigate('/investimentos')}
                    style={{ cursor: 'pointer' }}
                >
                    Investimentos
                </a>
                <a
                    onClick={() => navigate('/actives')}
                    style={{ cursor: 'pointer' }}
                >
                    Ativos
                </a>
                <a
                    onClick={() => navigate('/relatorios')}
                    style={{ cursor: 'pointer' }}
                >
                    Relatórios
                </a>
                <a
                    onClick={aoSair}
                    style={{
                        marginTop: 'auto',
                        color: '#d90429',
                        cursor: 'pointer',
                    }}
                >
                    Sair da Conta
                </a>
            </nav>
        </aside>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Carregando...' });
    const [summary, setSummary] = useState({
        totalBalance: 0,
        activesCount: 0,
    });

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
            dashboardApi.getSummary()
                .then((data) => {
                    if (data.totalBalance !== undefined) {
                        setSummary(data);
                    }
                })
                .catch((err) => {
                    console.error('Erro ao conectar no dashboard:', err);
                    if (err.response?.status === 401) {
                        // Se o token venceu, desloga
                        servicoAutenticacao.sair();
                        navigate('/');
                    }
                });
        }
        getDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        servicoAutenticacao.sair();
        navigate('/');
    };

    return (
        <div className="dashboard-wrap">
            <Sidebar aoSair={handleLogout} />
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
                    </div>
                    <div className="right">
                        <div
                            className="evol"
                            style={{ marginBottom: '10px', fontWeight: '600' }}
                        >
                            Evolução
                        </div>
                        <div className="chart-placeholder">
                            (Gráfico de Performance)
                        </div>
                    </div>
                </section>

                <section className="widgets">
                    <div className="widget">
                        <div
                            className="pie"
                            style={{
                                fontSize: '2rem',
                                color: '#2f8a2f',
                                fontWeight: 'bold',
                            }}
                        >
                            +12%
                        </div>
                        <div>Rentabilidade Mensal</div>
                    </div>
                    <div className="widget">
                        <div className="donut" style={{ fontSize: '2rem' }}>
                            📊
                        </div>
                        <div>Carteira Diversificada</div>
                    </div>
                </section>
            </div>
        </div>
    );
}
