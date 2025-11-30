import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegação programática entre páginas
import Header from '../components/Header'; // Componente compartilhado de cabeçalho
import Footer from '../components/Footer'; // Componente compartilhado de rodapé
import './HomeHero.css'; // Estilos específicos para esta página
import rentabil from '../assets/rentabil.png'; // Logo ou imagem local (não usado diretamente aqui)

export default function HomeHero() {
    const navigate = useNavigate(); // Inicializa hook de navegação

    // Função que redireciona o usuário para a página de login
    const irParaLogin = () => {
        navigate('/login');
    };

    return (
        <div className="home-container">
            <Header /> {/* Renderiza o cabeçalho compartilhado */}

            <main className="hero">
                {/* Seção esquerda do Hero com título, subtítulo, botão e lista de benefícios */}
                <section className="hero-left">
                    <h1 className="hero-title">
                        SISTEMA GERADOR DE
                        <br />
                        <strong>
                            RENTABILIDADE E<br />
                            INVESTIMENTO
                        </strong>
                    </h1>

                    {/* Subtítulo explicativo da página inicial */}
                    <p className="hero-sub">
                        Acompanhe o desempenho de sua carteira de investimentos
                        de forma simples e eficiente.
                    </p>

                    {/* Botão de cadastro que chama a função irParaLogin ao clicar */}
                    <button onClick={irParaLogin} className="btn-cad">
                        cadastre-se
                    </button>

                    {/* Lista de benefícios ou destaques da plataforma */}
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

                {/* Seção direita do Hero com imagens circulares decorativas */}
                <aside className="hero-right">

                    <div className="circle-wrapper-3">

                        {/* Círculo 1 – Principal, localizado no topo esquerdo */}
                        <div className="hero-circle circle-main">
                            <img 
                                src="https://img.freepik.com/fotos-gratis/homem-de-negocios-feliz-apontando-para-o-lado_1149-1233.jpg?w=740"
                                alt="Homem apontando"
                            />
                        </div>

                        {/* Círculo 2 – Secundário, localizado no inferior direito */}
                        <div className="hero-circle circle-secondary">
                            <img 
                                src="https://img.freepik.com/free-photo/happy-entrepreneur-using-digital-tablet-reading-something-while-working-office_637285-806.jpg?w=1480"
                                alt="Empresário usando tablet"
                            />
                        </div>

                        {/* Círculo 3 – Terciário, localizado no superior direito */}
                        <div className="hero-circle circle-third">
                            <img 
                                src="https://img.freepik.com/free-photo/cheerful-entrepreneur-saying-hello-talking-video-call-using-phone-businessman-course-important-video-conference-while-doing-overtime-office_482257-10312.jpg?w=1480"
                                alt="Empresário acenando em vídeo"
                            />
                        </div>

                    </div>

                </aside>
            </main>

            <Footer /> {/* Renderiza o rodapé compartilhado */}
        </div>
    );
}
