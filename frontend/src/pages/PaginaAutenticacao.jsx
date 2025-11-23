import React from 'react';
import FundoAnimado from '../components/FundoAnimado';
import CartaoAutenticacao from '../components/CartaoAutenticacao';

const PaginaAutenticacao = () => {
    return (
        <>
            <FundoAnimado />
            <main className="main-container">
                <CartaoAutenticacao />
            </main>
        </>
    );
};

export default PaginaAutenticacao;
