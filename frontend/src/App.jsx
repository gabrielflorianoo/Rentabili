import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaAutenticacao from './pages/PaginaAutenticacao';
import Dashboard from './pages/DashBoard';
import Investimentos from './pages/Investimentos';
import Relatorios from './pages/Relatorios';
import ProtectedRoute from './components/ProtectRout';
import './styles/estilo.css';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota padrão é o Login */}
        <Route path="/" element={<PaginaAutenticacao />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investimentos"
          element={
            <ProtectedRoute>
              <Investimentos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorios"
          element={
            <ProtectedRoute>
              <Relatorios />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}