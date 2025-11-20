import React, { useState } from 'react';
import InputFlutuante from '../InputFlutuante';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import imgLogo from '../../assets/logo.jpeg';

const VersoCartao = ({ aoVirar }) => {
  const [sucesso, setSucesso] = useState(false);
  const [dadosForm, setDadosForm] = useState({ nome: '', email: '', nascimento: '', senha: '', confirmarSenha: '' });
  const [erros, setErros] = useState({});

  const lidarComMudanca = (e) => {
    setDadosForm({ ...dadosForm, [e.target.id]: e.target.value });
    setErros({ ...erros, [e.target.id]: '' });
  };

  const validarIdade = (dataString) => {
    if(!dataString) return false;
    const partes = dataString.split('-');
    const dataNasc = new Date(partes[0], partes[1] - 1, partes[2]);
    const hoje = new Date();
    
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade >= 18;
  };

  const lidarComCadastro = (e) => {
    e.preventDefault();
    let novosErros = {};

    // 1. Validação de Idade (Mensagem específica)
    if (!validarIdade(dadosForm.nascimento)) {
        novosErros.nascimento = 'Você precisa ser maior de 18 anos para criar uma conta.';
    }

    // 2. Validação de Senha (Mínimo 6 e especial)
    if (dadosForm.senha.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(dadosForm.senha)) {
        novosErros.senha = 'A senha não atende aos requisitos mínimos.';
    }

    if (dadosForm.senha !== dadosForm.confirmarSenha) {
        novosErros.confirmarSenha = 'As senhas não conferem.';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    const resposta = servicoAutenticacao.cadastrar({
        nome: dadosForm.nome,
        email: dadosForm.email,
        senha: dadosForm.senha,
        nascimento: dadosForm.nascimento
    });

    if (resposta.sucesso) {
      setSucesso(true);
    } else {
      setErros({ [resposta.campo]: resposta.erro });
    }
  };

  const irParaLogin = () => {
      setSucesso(false);
      setDadosForm({ nome: '', email: '', nascimento: '', senha: '', confirmarSenha: '' });
      aoVirar(); 
  };

  return (
    <div className="card-face card-back">
      <div className="card-section form-section">
        {!sucesso ? (
          <div className="form-content fade-in-up">
            <div className="form-header">
              <h2 className="form-title">Crie sua conta</h2>
              <p className="form-subtitle">Junte-se à inovação</p>
            </div>
            <form onSubmit={lidarComCadastro}>
              <InputFlutuante id="nome" type="text" rotulo="Nome Completo" valor={dadosForm.nome} aoMudar={lidarComMudanca} required />
              
              <InputFlutuante id="email" type="email" rotulo="E-mail" valor={dadosForm.email} aoMudar={lidarComMudanca} erro={erros.email} required />
              
              {/* Campo de Data com erro de idade */}
              <InputFlutuante 
                id="nascimento" 
                type="date" 
                rotulo="Data de Nascimento" 
                valor={dadosForm.nascimento} 
                aoMudar={lidarComMudanca} 
                erro={erros.nascimento} 
                required 
              />

              {/* Campo de Senha */}
              <InputFlutuante 
                id="senha" 
                type="password" 
                rotulo="Senha" 
                valor={dadosForm.senha} 
                aoMudar={lidarComMudanca} 
                erro={erros.senha} 
                required 
              />
              {/* LEGENDA DA SENHA AQUI */}
              <span className="dica-campo">
                Mínimo de 6 caracteres e 1 caractere especial (@, #, $, etc).
              </span>

              <InputFlutuante id="confirmarSenha" type="password" rotulo="Confirmar Senha" valor={dadosForm.confirmarSenha} aoMudar={lidarComMudanca} erro={erros.confirmarSenha} required />
              
              <button type="submit" className="holo-button">Criar Conta</button>
            </form>
          </div>
        ) : (
          <div className="form-content fade-in-up" style={{textAlign: 'center'}}>
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