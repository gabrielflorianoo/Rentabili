import React, { useState } from 'react';
import InputFlutuante from '../InputFlutuante';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import imgLogo from '../../assets/logo.jpeg';

const VersoCartao = ({ aoVirar }) => {
    const [sucesso, setSucesso] = useState(false);
    const [carregando, setCarregando] = useState(false);
    
    // Estado dos dados
    const [dadosForm, setDadosForm] = useState({ 
        nome: '', 
        email: '', 
        nascimento: '', 
        senha: '', 
        confirmarSenha: '' 
    });
    
    // Estado dos erros
    const [erros, setErros] = useState({});

    const lidarComMudanca = (eOrId, maybeValue) => {
        if (eOrId && eOrId.target) {
            const { id, value } = eOrId.target;
            setDadosForm((prev) => ({ ...prev, [id]: value }));
            // Limpa erro ao digitar
            if (erros[id]) setErros((prev) => ({ ...prev, [id]: '' }));
        } else {
            setDadosForm((prev) => ({ ...prev, [eOrId]: maybeValue }));
        }
    };

    // --- VALIDAÇÃO REFORÇADA ---
    const validar = () => {
        const novosErros = {};
        const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;

        // 1. Campos obrigatórios básicos
        if (!dadosForm.nome) novosErros.nome = 'Nome é obrigatório';
        if (!dadosForm.email) novosErros.email = 'Email é obrigatório';

        // 2. Validação de Idade (Mínimo 18 anos)
        if (!dadosForm.nascimento) {
            novosErros.nascimento = 'Data de nascimento obrigatória';
        } else {
            const hoje = new Date();
            const nascimento = new Date(dadosForm.nascimento);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();
            
            // Ajusta idade se ainda não fez aniversário este ano
            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }

            if (idade < 18) {
                novosErros.nascimento = 'Você precisa ter pelo menos 18 anos.';
            }
        }

        // 3. Validação de Senha Forte
        if (!dadosForm.senha) {
            novosErros.senha = 'Senha é obrigatória';
        } else if (dadosForm.senha.length < 6) {
            novosErros.senha = 'A senha deve ter no mínimo 6 caracteres';
        } else if (!regexEspecial.test(dadosForm.senha)) {
            novosErros.senha = 'A senha deve conter um caractere especial (@, #, $, etc).';
        }

        // 4. Confirmação de Senha
        if (dadosForm.senha !== dadosForm.confirmarSenha) {
            novosErros.confirmarSenha = 'As senhas não conferem';
        }
        
        setErros(novosErros);
        // Retorna true se não houver erros (objeto vazio)
        return Object.keys(novosErros).length === 0;
    };

    const lidarComCadastro = async (e) => {
        e.preventDefault();
        
        // Só prossegue se a validação passar
        if (!validar()) return;

        setCarregando(true);
        const resposta = await servicoAutenticacao.cadastrar(dadosForm);
        setCarregando(false);

        if (resposta.sucesso) {
            setSucesso(true);
        } else {
            setErros({ geral: resposta.erro });
        }
    };

    const irParaLogin = () => {
        if (aoVirar) aoVirar();
    };

    const preencherAuto = () => {
        setDadosForm({
            nome: 'Usuário Teste',
            email: `teste${Math.floor(Math.random()*1000)}@exemplo.com`,
            nascimento: '2000-01-01', // Data válida (+18)
            senha: '123123@', // Senha válida (6 chars + especial)
            confirmarSenha: '123123@'
        });
        setErros({});
    };

    return (
        <div className="card-face card-back">
            {/* LADO ESQUERDO: BRANCO (Formulário) */}
            <div className="card-section form-section">
                {!sucesso ? (
                    <div className="form-content fade-in-up">
                        <div className="form-header">
                            <h2 className="form-title">Crie sua conta</h2>
                            <p className="form-subtitle">Junte-se à inovação</p>
                        </div>

                        <form onSubmit={lidarComCadastro}>
                            <InputFlutuante 
                                id="nome" 
                                type="text" 
                                rotulo="Nome Completo" 
                                valor={dadosForm.nome} 
                                aoMudar={lidarComMudanca} 
                                erro={erros.nome} 
                                required 
                            />
                            
                            <InputFlutuante 
                                id="email" 
                                type="email" 
                                rotulo="E-mail" 
                                valor={dadosForm.email} 
                                aoMudar={lidarComMudanca} 
                                erro={erros.email} 
                                required 
                            />
                            
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
                            {/* Dica visual sobre a senha */}
                            {!erros.senha && <span className="dica-campo">Mínimo de 6 caracteres e 1 especial (@, #, $).</span>}
                            
                            <InputFlutuante 
                                id="confirmarSenha" 
                                type="password" 
                                rotulo="Confirmar Senha" 
                                valor={dadosForm.confirmarSenha} 
                                aoMudar={lidarComMudanca} 
                                erro={erros.confirmarSenha} 
                                required 
                            />

                            {erros.geral && <div className="error-message">{erros.geral}</div>}

                            <button type="submit" className="holo-button" disabled={carregando}>
                                {carregando ? 'Enviando...' : 'Criar Conta'}
                            </button>

                            <button type="button" className="holo-button secondary-button" onClick={preencherAuto}>
                                Preencher Automaticamente
                            </button>
                        </form>
                    </div>
                ) : (
                    // Tela de Sucesso
                    <div className="form-content fade-in-up" style={{textAlign: 'center'}}>
                        <div className="form-header">
                            <h2 className="form-title" style={{color: '#00a651'}}>Sucesso!</h2>
                            <p className="form-subtitle">Sua conta foi criada.</p>
                        </div>
                        <button className="holo-button" onClick={irParaLogin}>Fazer Login Agora</button>
                    </div>
                )}
            </div>

            {/* LADO DIREITO: VERDE (Branding) */}
            <div className="card-section welcome-section">
                <div className="welcome-content fade-in-up">
                    <div className="logo-container">
                        <img src={imgLogo} alt="Logo Rentabili" className="logo-img" />
                    </div>
                    <h1 className="welcome-title">Controle Total</h1>
                    <p className="welcome-subtitle">Gerencie seus investimentos com facilidade.</p>
                </div>

                <button className="flip-button" onClick={aoVirar}>
                    ← Voltar ao Login
                </button>
            </div>
        </div>
    );
};

export default VersoCartao;
