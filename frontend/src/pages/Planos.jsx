import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Cabeçalho compartilhado da página
import Footer from '../components/Footer'; // Rodapé compartilhado da página
import '../styles/estilo.css'; // Estilos globais da aplicação

// Componente da página de Planos
export default function Planos() {
    const navigate = useNavigate(); // Hook do React Router para navegação programática

    // Estilo padrão dos cards de plano
    const cardStyle = {
        background: 'transparent',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        flex: 1,
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    return (
        <div className="page-container">
            <Header /> {/* Cabeçalho comum a todas as páginas */}

            <main className="page-content">
                <h1 className="page-title" style={{ textAlign: 'center' }}>
                    Nossos Planos
                </h1>

                {/* Container flexível para os cards de planos */}
                <div
                    style={{
                        display: 'flex',
                        gap: '30px',
                        flexWrap: 'wrap',
                        marginTop: '40px',
                    }}
                >
                    {/* Card do Plano Grátis */}
                    <div style={cardStyle}>
                        <h2 style={{ color: '#0f7c3a' }}>Grátis</h2>
                        <div
                            style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                margin: '10px 0',
                            }}
                        >
                            R$ 0
                        </div>
                        <ul
                            className="page-list"
                            style={{ textAlign: 'left', width: '100%' }}
                        >
                            <li>Cadastro básico de ativos</li>
                            <li>Cálculo de rentabilidade simples</li>
                            <li>Uma carteira de investimentos</li>
                        </ul>
                        {/* Botão que leva o usuário para a tela de login */}
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-acesso"
                            style={{ marginTop: 'auto', width: '100%' }}
                        >
                            Começar Grátis
                        </button>
                    </div>

                    {/* Card do Plano Avançado */}
                    <div style={{ ...cardStyle, border: '2px solid #0f7c3a' }}>
                        <h2 style={{ color: '#0f7c3a' }}>Avançado</h2>
                        <div
                            style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                margin: '10px 0',
                            }}
                        >
                            R$ 29,90
                        </div>
                        <ul
                            className="page-list"
                            style={{ textAlign: 'left', width: '100%' }}
                        >
                            <li>Tudo do plano Grátis</li>
                            <li>Múltiplas carteiras</li>
                            <li>Gráficos avançados e relatórios</li>
                            <li>Suporte prioritário</li>
                        </ul>
                        {/* Botão que leva o usuário para a tela de login para assinatura */}
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-acesso"
                            style={{ marginTop: 'auto', width: '100%' }}
                        >
                            Assinar Agora
                        </button>
                    </div>
                </div>
            </main>

            <Footer /> {/* Rodapé comum a todas as páginas */}
        </div>
    );
}
