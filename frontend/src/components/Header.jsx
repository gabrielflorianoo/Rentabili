import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from "../components/DarkModeToggle";

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="brand">
                <div className="logo-icon">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 3v18h18" />
                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                    </svg>
                </div>
                <span className="logo-text">RENTABIL</span>
            </div>

      <nav className="menu">
        <Link to="/">Início</Link>
        <Link to="/resumo">Resumo</Link>
        <Link to="/planos">Planos</Link>
        <Link to="/sobre">Sobre</Link>
      </nav>
        <div className="header-right"> 
          <DarkModeToggle /> 
          <button onClick={() => navigate('/login')} className="btn-acesso"> 
            ACESSE AQUI 
          </button> 
        </div>
    </header>
  );
}
