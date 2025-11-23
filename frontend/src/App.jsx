import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importação das Páginas
import HomeHero from './pages/HomeHero';
import PaginaAutenticacao from './pages/PaginaAutenticacao';
import Dashboard from './pages/DashBoard';

// --- NOVAS IMPORTAÇÕES NECESSÁRIAS ---
import Resumo from './pages/Resumo';
import Planos from './pages/Planos';
import Sobre from './pages/Sobre';
import Investimentos from './pages/Investimentos';
import Relatorios from './pages/Relatorios';
import Ativos from './pages/Ativos';
import Transacoes from './pages/Transacoes';
// -------------------------------------

// Importação dos Componentes e Estilos
import RotaProtegida from './components/ProtectRout'; // Mantive como você mandou
import './styles/estilo.css';

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rota Principal (Home) */}
                <Route path="/" element={<HomeHero />} />

                {/* Rota de Login */}
                <Route path="/login" element={<PaginaAutenticacao />} />

                {/* --- ROTAS DOS MENUS (PÚBLICAS) --- */}
                <Route path="/resumo" element={<Resumo />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/sobre" element={<Sobre />} />

                {/* --- ROTA PROTEGIDA (DASHBOARD) --- */}
                <Route
                    path="/dashboard"
                    element={
                        <RotaProtegida>
                            <Dashboard />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/investimentos"
                    element={
                        <RotaProtegida>
                            <Investimentos />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/transacoes"
                    element={
                        <RotaProtegida>
                            <Transacoes />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/relatorios"
                    element={
                        <RotaProtegida>
                            <Relatorios />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/actives"
                    element={
                        <RotaProtegida>
                            <Ativos />
                        </RotaProtegida>
                    }
                />
            </Routes>
        </Router>
    );
}
