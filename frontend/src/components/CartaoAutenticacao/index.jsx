import React, { useState } from 'react';
import FrenteCartao from './FrenteCartao';
import VersoCartao from './VersoCartao';

const CartaoAutenticacao = () => {
    // Estado que controla se o cartão está virado (true) ou mostrando a frente (false)
    const [estaVirado, setEstaVirado] = useState(false);

    // Função chamada para alternar o estado de virado/não virado
    const alternarGiro = () => {
        setEstaVirado(!estaVirado);
    };

    return (
        // A classe "flipped" ativa a animação no CSS para girar o cartão
        <div className={`innovative-card ${estaVirado ? 'flipped' : ''}`}>
            {/* A frente do cartão recebe a função para virar */}
            <FrenteCartao aoVirar={alternarGiro} />

            {/* O verso do cartão também recebe a função para virar */}
            <VersoCartao aoVirar={alternarGiro} />
        </div>
    );
};

export default CartaoAutenticacao;
