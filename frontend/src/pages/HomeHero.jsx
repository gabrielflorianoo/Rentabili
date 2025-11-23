import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomeHero.css';
import rentabil from '../assets/rentabil.png';

export default function HomeHero() {
  const navigate = useNavigate();

  const irParaLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <Header /> {/* Usando o componente compartilhado */}

      <main className="hero">
        <section className="hero-left">
          <h1 className="hero-title">
            SISTEMA GERADOR DE<br />
            <strong>RENTABILIDADE E<br />
            INVESTIMENTO</strong>
          </h1>
          <p className="hero-sub">Acompanhe o desempenho de sua carteira de investimentos de forma simples e eficiente.</p>
          <button onClick={irParaLogin} className="btn-cad">cadastre-se</button>

          <div className="info-list">
            <div className="info-item"><span>Mais recursos</span><span className="arrow">↓</span></div>
            <div className="info-item"><span>Mais acessibilidade</span><span className="arrow">↓</span></div>
            <div className="info-item"><span>Melhor para você</span><span className="arrow">↓</span></div>
          </div>
        </section>

        <aside className="hero-right">
          <img src={rentabil} alt="Ilustração do Rentabil" /> 
        </aside>
      </main>
      <Footer />
    </div>
  );
}