import React, { useState } from 'react';
import FrenteCartao from './FrenteCartao';
import VersoCartao from './VersoCartao';

const CartaoAutenticacao = () => {
  const [estaVirado, setEstaVirado] = useState(false);

  const alternarGiro = () => {
    setEstaVirado(!estaVirado);
  };

  return (
    <div className={`innovative-card ${estaVirado ? 'flipped' : ''}`}>
      <FrenteCartao aoVirar={alternarGiro} />
      <VersoCartao aoVirar={alternarGiro} />
    </div>
  );
};

export default CartaoAutenticacao;