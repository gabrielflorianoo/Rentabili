import React, { useState } from 'react';
import InputFlutuante from '../InputFlutuante';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import imgLogo from '../../assets/logo.jpeg';

const VersoCartao = ({ aoVirar }) => {
  const [sucesso, setSucesso] = useState(false);
  const [dadosForm, setDadosForm] = useState({ nome: '', email: '', nascimento: '', senha: '', confirmarSenha: '' });
  const [erros, setErros] = useState({});

  const lidarComMudanca = (eOrId, maybeValue) => {
    // Suporta tanto evento quanto (id, value)
    if (eOrId && eOrId.target) {
      const { id, value } = eOrId.target;
      setDadosForm(prev => ({ ...prev, [id]: value }));
    } else if (typeof eOrId === 'string') {
      setDadosForm(prev => ({ ...prev, [eOrId]: maybeValue }));
    }
  };

  const validar = () => {
    const novosErros = {};
    if (!dadosForm.nome) novosErros.nome = 'Nome é obrigatório';
    if (!dadosForm.email) novosErros.email = 'Email é obrigatório';
    if (!dadosForm.senha || dadosForm.senha.length < 6) novosErros.senha = 'Senha deve ter ao menos 6 caracteres';
    if (dadosForm.senha !== dadosForm.confirmarSenha) novosErros.confirmarSenha = 'Senhas não conferem';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const lidarComCadastro = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;
    try {
      // Se `servicoAutenticacao` tiver função de cadastro, pode ser usada aqui.
      if (servicoAutenticacao && typeof servicoAutenticacao.cadastrar === 'function') {
        await servicoAutenticacao.cadastrar(dadosForm);
      }
      setSucesso(true);
    } catch (err) {
      setErros({ geral: 'Erro ao criar conta' });
      // opcional: console.error(err);
    }
  };

  const irParaLogin = () => {
    // Comportamento simples: virar o cartão ou navegar
    if (aoVirar) aoVirar();
  };

  return (
    <div className="card-face card-back">
      <div className="form-area">
        {!sucesso ? (
          <div className="form-content fade-in-up">
            <div className="form-header">
              <h2 className="form-title">Crie sua conta</h2>
              <p className="form-subtitle">Junte-se à inovação</p>
            </div>
            <form onSubmit={lidarComCadastro}>
              <InputFlutuante id="nome" type="text" rotulo="Nome Completo" valor={dadosForm.nome} aoMudar={lidarComMudanca} erro={erros.nome} required />

              <InputFlutuante id="email" type="email" rotulo="E-mail" valor={dadosForm.email} aoMudar={lidarComMudanca} erro={erros.email} required />

              <InputFlutuante
                id="nascimento"
                type="date"
                rotulo="Data de Nascimento"
                valor={dadosForm.nascimento}
                aoMudar={lidarComMudanca}
                erro={erros.nascimento}
                required
              />

              <InputFlutuante
                id="senha"
                type="password"
                rotulo="Senha"
                valor={dadosForm.senha}
                aoMudar={lidarComMudanca}
                erro={erros.senha}
                required
              />
              <span className="dica-campo">Mínimo de 6 caracteres e 1 caractere especial (@, #, $, etc).</span>

              <InputFlutuante id="confirmarSenha" type="password" rotulo="Confirmar Senha" valor={dadosForm.confirmarSenha} aoMudar={lidarComMudanca} erro={erros.confirmarSenha} required />

              {erros.geral && <div className="erro-geral">{erros.geral}</div>}

              <button type="submit" className="holo-button">Criar Conta</button>
            </form>
          </div>
        ) : (
          <div className="form-content fade-in-up" style={{ textAlign: 'center' }}>
            <div className="form-header">
              <h2 className="form-title">Conta Criada!</h2>
              <p className="form-subtitle">Seja bem-vindo ao Rentabili Investidor.</p>
            </div>
            <button className="holo-button" onClick={irParaLogin}>Fazer Login Agora</button>
          </div>
        )}
      </div>

      <div className="card-section welcome-section">
        <div className="welcome-content fade-in-up">
          <div className="holographic-logo"><img src={imgLogo} alt="Logo" className="logo-img-back" /></div>
          <h1 className="welcome-title">Controle seu investimento</h1>
        </div>
        <button className="flip-button" onClick={aoVirar}>← Voltar</button>
      </div>
    </div>
  );
};

export default VersoCartao;