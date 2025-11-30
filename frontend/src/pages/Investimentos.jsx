import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegação entre páginas
import Header from '../components/Header'; // Componente de cabeçalho compartilhado
import Footer from '../components/Footer'; // Componente de rodapé compartilhado
import './HomeHero.css'; // Arquivo CSS específico para esta página
import rentabil from '../assets/rentabil.png'; // Logo ou imagem local (não utilizada diretamente aqui)

export default function HomeHero() {
    // Inicializa o hook de navegação programática
    const navigate = useNavigate();

    // Função que redireciona o usuário para a página de login
    const irParaLogin = () => {
        navigate('/login');
    };

    return (
        <div className="home-container">
            <Header /> {/* Renderiza o cabeçalho da aplicação */}

            <main className="hero">
                {/* Seção esquerda do Hero: título, subtítulo, botão e lista de benefícios */}
                <section className="hero-left">
                    {/* Título principal da página */}
                    <h1 className="hero-title">
                        SISTEMA GERADOR DE
                        <br />
                        <strong>
                            RENTABILIDADE E<br />
                            INVESTIMENTO
                        </strong>
                    </h1>

                    {/* Subtítulo explicando o objetivo do sistema */}
                    <p className="hero-sub">
                        Acompanhe o desempenho de sua carteira de investimentos
                        de forma simples e eficiente.
                    </p>

                    {/* Botão que redireciona para a página de login */}
                    <button onClick={irParaLogin} className="btn-cad">
                        cadastre-se
                    </button>

                    {/* Lista de destaques/benefícios da plataforma */}
                    <div className="info-list">
                        <div className="info-item">
                            <span>Mais recursos</span>
                            <span className="arrow">↓</span>
                        </div>
                        <div className="info-item">
                            <span>Mais acessibilidade</span>
                            <span className="arrow">↓</span>
                        </div>
                        <div className="info-item">
                            <span>Melhor para você</span>
                            <span className="arrow">↓</span>
                        </div>
                    </div>
                </section>

                {/* Seção direita do Hero: imagens circulares decorativas */}
                <aside className="hero-right">
                    <div className="circle-wrapper-3">
                        {/* Círculo 1 – Principal (topo esquerdo) */}
                        <div className="hero-circle circle-main">
                            <img 
                                src="https://img.freepik.com/fotos-gratis/homem-de-negocios-feliz-apontando-para-o-lado_1149-1233.jpg?w=740"
                                alt="Homem apontando"
                            />
                        </div>

                        {/* Círculo 2 – Inferior direito */}
                        <div className="hero-circle circle-secondary">
                            <img 
                                src="https://img.freepik.com/free-photo/happy-entrepreneur-using-digital-tablet-reading-something-while-working-office_637285-806.jpg?w=1480"
                                alt="Empresário usando tablet"
                            />
                        </div>

                        {/* Círculo 3 – Superior direito */}
                        <div className="hero-circle circle-third">
                            <img 
                                src="https://img.freepik.com/free-photo/cheerful-entrepreneur-saying-hello-talking-video-call-using-phone-businessman-course-important-video-conference-while-doing-overtime-office_482257-10312.jpg?w=1480"
                                alt="Empresário acenando em vídeo"
                            />
                        </div>
                    </div>
                </aside>
            </main>

            <Footer /> {/* Renderiza o rodapé da aplicação */}
        </div>
    );
}
