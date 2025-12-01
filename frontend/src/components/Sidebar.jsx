import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from "../components/DarkModeToggle";

export default function Sidebar({ aoSair = () => {}, paginaAtiva = '' }) {
    // Hook do React Router para navegação programática
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            {/* Componente para alternar entre modo claro e escuro */}
            <div className="sidebar-darkmode">
                <DarkModeToggle />
            </div>

            {/* Logo / marca da aplicação */}
            <div className="logo">
                📈<strong>RENTABILI</strong>
            </div>

            {/* Menu de navegação lateral */}
            <nav>
                {/* Links de navegação com destaque para página ativa */}
                <a
                    onClick={() => navigate('/dashboard')}
                    className={paginaAtiva === 'dashboard' ? 'active' : ''}
                >
                    Dashboard
                </a>
                <a
                    onClick={() => navigate('/investimentos')}
                    className={paginaAtiva === 'investimentos' ? 'active' : ''}
                >
                    Investimentos
                </a>
                <a
                    onClick={() => navigate('/actives')}
                    className={paginaAtiva === 'actives' ? 'active' : ''}
                >
                    Ativos
                </a>
                <a
                    onClick={() => navigate('/transacoes')}
                    className={paginaAtiva === 'transacoes' ? 'active' : ''}
                >
                    Transações
                </a>
                <a
                    onClick={() => navigate('/relatorios')}
                    className={paginaAtiva === 'relatorios' ? 'active' : ''}
                >
                    Relatórios
                </a>
                <a
                    onClick={() => navigate('/simulador')}
                    className={paginaAtiva === 'simulador' ? 'active' : ''}
                >
                    Simulador
                </a>

                {/* Botão de logout / sair da conta */}
                <a
                    onClick={aoSair} // Callback passado pelo componente pai
                    style={{
                        marginTop: 'auto', // Empurra para o fim da barra
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
