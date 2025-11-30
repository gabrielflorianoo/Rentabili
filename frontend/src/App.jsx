import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; 
// Importamos também o Outlet (mesmo que usado principalmente no Layout, ele pode ser útil no App)

// Serviço de autenticação
import { servicoAutenticacao } from './services/servicoAutenticacao';

// --- Importação das páginas da aplicação ---
import HomeHero from './pages/HomeHero';
import PaginaAutenticacao from './pages/PaginaAutenticacao';
import Dashboard from './pages/DashBoard';

import Resumo from './pages/Resumo';
import Planos from './pages/Planos';
import Sobre from './pages/Sobre';
import Investimentos from './pages/Investimentos';
import Relatorios from './pages/Relatorios';
import Ativos from './pages/Ativos';
import Transacoes from './pages/Transacoes';
import Simulador from './pages/Simulador';

// --- Componentes de layout e proteção de rotas ---
import RotaProtegida from './components/ProtectRout'; // Valida se o usuário está autenticado
import Sidebar from './components/Sidebar'; // Sidebar ainda pode ser usada diretamente
import SidebarLayout from './layouts/SidebarLayout'; // Layout que combina Sidebar + conteúdo

import './styles/estilo.css';

// Função de logout global, usada pelo botão de sair no Sidebar/Layout
const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
        servicoAutenticacao.sair();   // Limpa token/sessão
        window.location.href = "/login"; // Redireciona para login
    }
};

// Layout protegido que envolve o SidebarLayout e a verificação de autenticação
// Envolve todas as rotas internas que exigem login
const ProtectedLayout = ({ aoSair }) => (
    <RotaProtegida>
        <SidebarLayout aoSair={aoSair} /> 
        {/* O SidebarLayout internamente contém <Outlet />, permitindo exibir as páginas filhas */}
    </RotaProtegida>
);

export default function App() {
    return (
        <Router>
            <Routes>

                {/* -------------------------------------------------------------------- */}
                {/*                  ROTAS PÚBLICAS (SEM SIDEBAR)                      */}
                {/* -------------------------------------------------------------------- */}

                <Route path="/" element={<HomeHero />} />                {/* Página inicial institucional */}
                <Route path="/login" element={<PaginaAutenticacao />} /> {/* Login */}
                <Route path="/resumo" element={<Resumo />} />            {/* Página pública */}
                <Route path="/planos" element={<Planos />} />            {/* Página pública */}
                <Route path="/sobre" element={<Sobre />} />              {/* Página pública */}

                {/* -------------------------------------------------------------------- */}
                {/*     ROTAS PROTEGIDAS COM LAYOUT – USAM SIDEBAR + AUTH GUARD         */}
                {/* -------------------------------------------------------------------- */}

                {/* 
                    Este Route não tem path.
                    Ele serve como rota PAI e encapsula:
                        - Proteção com <RotaProtegida>
                        - Layout com Sidebar
                        - Outlet dentro do layout para exibir as páginas internas
                */}
                <Route element={<ProtectedLayout aoSair={handleLogout} />}>

                    {/* Estas rotas aparecerão dentro do SidebarLayout */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/investimentos" element={<Investimentos />} />
                    <Route path="/transacoes" element={<Transacoes />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                    <Route path="/actives" element={<Ativos />} />
                    <Route path="/simulador" element={<Simulador />} />

                </Route>

                {/* -------------------------------------------------------------------- */}
                {/*                           ROTA 404                                   */}
                {/* -------------------------------------------------------------------- */}
                <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />

            </Routes>
        </Router>
    );
}
