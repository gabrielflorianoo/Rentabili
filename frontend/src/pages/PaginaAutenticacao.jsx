import React from 'react';
import FundoAnimado from '../components/FundoAnimado'; // Componente que renderiza um fundo animado da página
import CartaoAutenticacao from '../components/CartaoAutenticacao'; // Componente do card de login/cadastro

// Componente principal da página de autenticação
const PaginaAutenticacao = () => {
    return (
        <>
            {/* Fundo animado da página, pode incluir efeitos visuais ou partículas */}
            <FundoAnimado />

            {/* Conteúdo principal centralizado */}
            <main className="main-container">
                {/* Card de autenticação que contém o formulário de login ou cadastro */}
                <CartaoAutenticacao />
            </main>
        </>
    );
};

export default PaginaAutenticacao;
