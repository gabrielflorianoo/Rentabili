import React from 'react';
import { Navigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';

export default function RotaProtegida({ children }) {
  const usuario = servicoAutenticacao.obterUsuarioAtual();
  const token = servicoAutenticacao.obterToken();
  
  if (!usuario || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}