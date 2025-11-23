import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from "../components/DarkModeToggle";


export default function Sidebar({ aoSair = () => {}, paginaAtiva = '' }) {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
             <div className="sidebar-darkmode">
                <DarkModeToggle />
            </div>
            <div className="logo">
                📈<strong>RENTABIL</strong>
            </div>
            <nav>
                <a onClick={() => navigate('/dashboard')} className={paginaAtiva === 'dashboard' ? 'active' : ''}>
                    Dashboard
                </a>
                <a onClick={() => navigate('/investimentos')} className={paginaAtiva === 'investimentos' ? 'active' : ''}>
                    Investimentos
                </a>
                <a onClick={() => navigate('/actives')} className={paginaAtiva === 'actives' ? 'active' : ''}>
                    Ativos
                </a>
                <a onClick={() => navigate('/transacoes')} className={paginaAtiva === 'transacoes' ? 'active' : ''}>
                    Transações
                </a>
                <a onClick={() => navigate('/relatorios')} className={paginaAtiva === 'relatorios' ? 'active' : ''}>
                    Relatórios
                </a>
                <a
                    onClick={aoSair}
                    style={{ marginTop: 'auto', color: '#d90429', cursor: 'pointer' }}
                >
                    Sair da Conta
                </a>
            </nav>
        </aside>
    );
}
