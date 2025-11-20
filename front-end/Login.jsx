import React from 'react';
import './Login.css';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';


export default function Login() {
return (
<div className="page-wrap">
<header className="topbar">
<div className="brand">
<div className="brand-icon">📈</div>
<div className="brand-text">RENTABIL</div>
</div>
<nav className="nav">
<a>inicio</a>
<a>resumo</a>
<a>planos</a>
<a>sobre</a>
<Link to="/login" className="btn-access">ACESSE AQUI</Link>
</nav>
</header>


<main className="hero">
<div className="hero-left">
<h1>SISTEMA GERADOR DE RENTABILIDADE E INVESTIMENTO</h1>
<p className="lead">Acompanhe o desempenho de sua carteira de investimentos de forma simples e eficiente</p>
<button className="btn-secondary">cadastre-se</button>


<div className="features">
<div>Mais recursos</div>
<div className="arrow">↓</div>
<div>Mais acessibilidade</div>
<div className="arrow">↓</div>
<div>Melhor para você</div>
</div>
</div>


<div className="hero-right">
<img src="/hero-person.png" alt="pessoa" />
</div>
</main>


<section className="auth-card">
<div className="card left">
<h2>Portal Inovador</h2>
<p className="sub">Bem-vindo ao futuro dos investimentos</p>


<ul className="bullets">
<li>💡 Tecnologia de ponta</li>
<li>🛡️ Segurança máxima</li>
<li>🧭 Interface intuitiva</li>
</ul>


<Link to="/signup" className="ghost-btn">Criar conta →</Link>
</div>


<div className="card right">
<h3>Acesse sua conta</h3>
<p className="sub">Entre com suas credenciais</p>
<LoginForm mode="login" />
<div className="links">
<Link to="/forgot">Esqueceu a senha?</Link>
</div>
</div>
</section>
</div>
);
}