import React from 'react';
import './Dashboard.css';


function Sidebar(){
return (
<aside className="sidebar">
<div className="logo">📈<strong>RENTABIL</strong></div>
<nav>
<a className="active">Dashboard</a>
<a>Investimentos</a>
<a>Relatorios</a>
<a>Configurações</a>
</nav>
</aside>
)
}


export default function Dashboard(){
const user = JSON.parse(localStorage.getItem('rentabil_user') || '{}');
return (
<div className="dashboard-wrap">
<Sidebar />
<div className="content">
<header className="content-head">
<h2>Dashboard</h2>
<div className="user">👤 {user.username || 'João Silva'}</div>
</header>


<section className="summary">
<div className="left">
<h3>Resumo da carteira</h3>
<div className="big">R$150.000,00</div>
<div className="acc">Rentabilidade acumulada <strong>+8,5%</strong></div>
</div>
<div className="right">
<div className="evol">Evolução</div>
<div className="chart-placeholder">(gráfico)</div>
</div>
</section>


<section className="widgets">
<div className="widget"> <div className="pie">9,2%</div> <div>Rentabilidade</div></div>
<div className="widget"> <div className="donut">📊</div> <div>Alocação por Ativo</div></div>
</section>
</div>
</div>
)
}