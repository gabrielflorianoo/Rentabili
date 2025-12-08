import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFlutuante from '../InputFlutuante'; // Ajuste o caminho se necessário
import { servicoAutenticacao } from '../../services/servicoAutenticacao'; // Ajuste o caminho se necessário
import imgLogo from '../../assets/logo.jpeg'; // Ajuste o caminho se necessário

const FrenteCartao = ({ aoVirar }) => {
    const navigate = useNavigate();
    const [dadosForm, setDadosForm] = useState({ email: '', senha: '' });
    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState({});

    // Atualiza estado dos inputs
    const lidarComMudanca = (e) => {
        setDadosForm({ ...dadosForm, [e.target.id]: e.target.value });
        // Limpa erro ao digitar
        if (erros[e.target.id]) {
            setErros({ ...erros, [e.target.id]: '' });
        }
    };

    // Função de Login
    const lidarComLogin = async (e) => {
        e.preventDefault();
        setCarregando(true);
        
        const resposta = await servicoAutenticacao.entrar(dadosForm.email, dadosForm.senha);
        
        setCarregando(false);

        if (resposta.sucesso) {
            navigate('/dashboard');
        } else {
            setErros({ [resposta.campo]: resposta.erro });
        }
    };

    return (
        <div className="card-face card-front">
            {/* LADO ESQUERDO: VERDE (Boas Vindas) */}
            <div className="card-section welcome-section">
                <div className="welcome-content fade-in-up">
                    {/* Logo com link para a Home */}
                    <div 
                        className="logo-container" 
                        onClick={() => navigate('/')} 
                        title="Voltar para a Página Inicial"
                    >
                        <img src={imgLogo} alt="Logo Rentabili" className="logo-img" />
                    </div>
                    
                    <h1 className="welcome-title">Rentabili Investidor</h1>
                    <p className="welcome-subtitle">
                        Bem-vindo ao futuro dos investimentos.
                    </p>
                </div>
                
                {/* Botão para virar o cartão (ir para cadastro) */}
                <button className="flip-button" onClick={aoVirar}>
                    Criar Conta Nova →
                </button>
            </div>

            {/* LADO DIREITO: BRANCO (Formulário) */}
            <div className="card-section form-section">
                <div className="form-content fade-in-up">
                    <div className="form-header">
                        <h2 className="form-title">Acesse sua conta</h2>
                        <p className="form-subtitle">Entre com suas credenciais</p>
                    </div>

                    <form onSubmit={lidarComLogin}>
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
                            id="senha" 
                            type="password" 
                            rotulo="Senha" 
                            valor={dadosForm.senha} 
                            aoMudar={lidarComMudanca} 
                            erro={erros.senha}
                            required
                        />
                        
                        {/* Mensagem de erro geral, se houver */}
                        {erros.geral && <span className="error-message">{erros.geral}</span>}

                        <button type="submit" className="holo-button" disabled={carregando}>
                            {carregando ? 'Entrando...' : 'Entrar na Conta'}
                        </button>
                    </form>

                    <a href="#" className="form-link">Esqueci minha senha</a>
                </div>
            </div>
        </div>
    );
};

export default FrenteCartao;
