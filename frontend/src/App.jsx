import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaAutenticacao from './pages/PaginaAutenticacao'; // Seu Login
import Dashboard from './pages/DashBoard'; // Dashboard Deles
import ProtectedRoute from './components/ProtectRout'; // Proteção Deles
import './styles/estilo.css';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota padrão é o SEU Login */}
        <Route path="/" element={<PaginaAutenticacao />} />
        
        {/* Rota protegida carrega o Dashboard DELES */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}