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
            </Routes>
        </Router>
    );
}