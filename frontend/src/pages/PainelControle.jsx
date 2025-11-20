import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../services/servicoAutenticacao';

const PainelControle = () => {
  const navegar = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioAtual = servicoAutenticacao.obterUsuarioAtual();
    if (!usuarioAtual) {
      navegar('/'); // Se não estiver logado, volta pro login
    } else {
      setUsuario(usuarioAtual);
    }
  }, [navegar]);

  const lidarComSaida = () => {
    servicoAutenticacao.sair();
    navegar('/');
  };

  if (!usuario) return null;

  return (
    <div style={{ padding: '40px', fontFamily: 'Poppins, sans-serif' }}>
      <h1>Olá, {usuario.nome}!</h1>
      <p>Bem-vindo ao Painel do Rentabili Investidor.</p>
      <br />
      <button 
        onClick={lidarComSaida}
        style={{
            padding: '10px 20px',
            background: '#d90429',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        }}
      >
        Sair
      </button>
    </div>
  );
};

export default PainelControle;