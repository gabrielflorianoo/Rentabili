import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFlutuante from '../InputFlutuante';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import imgLogo from '../../assets/logo.jpeg';

const FrenteCartao = ({ aoVirar }) => {
    const navegar = useNavigate();

    // Controla qual tela está sendo exibida: login, recuperar senha ou validar código
    const [visualizacao, setVisualizacao] = useState('login');

    // Armazena dados preenchidos pelo usuário
    const [dadosForm, setDadosForm] = useState({
        email: '',
        senha: '',
        codigo: '',
        novaSenha: '',
    });

    // Guardará mensagens de erro específicas para cada campo
    const [erros, setErros] = useState({});

    // Estado de loading para evitar múltiplos envios no login
    const [carregando, setCarregando] = useState(false);

    // Armazena o e-mail usado no processo de recuperação (usado para simulação)
    const [emailRecuperacao, setEmailRecuperacao] = useState('');

    // Atualiza o campo no formulário conforme o usuário digita
    const lidarComMudanca = (e) => {
        setDadosForm({ ...dadosForm, [e.target.id]: e.target.value });
        setErros({ ...erros, [e.target.id]: '' }); // Limpa erro do campo editado
    };

    // Preenche automaticamente com um usuário de testes
    const preencherAutomaticamente = () => {
        setDadosForm({
            ...dadosForm,
            email: 'email@example.com',
            senha: '123123@',
            codigo: '',
            novaSenha: '',
        });
        setErros({});
    };

    // --- LOGIN REAL (conecta ao backend) ---
    const lidarComLogin = async (e) => {
        e.preventDefault();
        setCarregando(true);

        // Chama o serviço de autenticação
        const resposta = await servicoAutenticacao.entrar(
            dadosForm.email,
            dadosForm.senha,
        );

        setCarregando(false);

        // Login bem-sucedido → redireciona para o dashboard
        if (resposta.sucesso) {
            navegar('/dashboard');
        } else {
            // Exibe o erro devolvido pelo backend no campo correspondente
            setErros({ [resposta.campo]: resposta.erro });
        }
    };

    // --- INÍCIO DA RECUPERAÇÃO DE SENHA (simulada) ---
    const lidarComEsqueciSenha = (e) => {
        e.preventDefault();

        // O e-mail precisa estar preenchido
        if (!dadosForm.email) {
            setErros({ email: 'Digite seu e-mail para continuar.' });
            return;
        }

        // Simula envio de código de verificação
        setEmailRecuperacao(dadosForm.email);
        alert(
            `SIMULAÇÃO: Um código foi enviado para ${dadosForm.email}.\n\nCódigo de teste: 123456`,
        );

        // Troca tela → vai para validação
        setVisualizacao('validar');
        setErros({});
    };

    // --- VALIDAÇÃO DO CÓDIGO E NOVA SENHA (simulada) ---
    const lidarComValidacao = (e) => {
        e.preventDefault();

        // Verifica se o código digitado é o simulado
        if (dadosForm.codigo !== '123456') {
            setErros({ codigo: 'Código inválido.' });
            return;
        }

        // Verifica força mínima da senha
        if (dadosForm.novaSenha.length < 6) {
            setErros({ novaSenha: 'A senha deve ter no mínimo 6 caracteres.' });
            return;
        }

        alert('Senha redefinida com sucesso! (Simulação)');

        // Volta para a tela de login após redefinir
        setVisualizacao('login');

        // Limpa campos relacionados à validação
        setDadosForm({ ...dadosForm, senha: '', codigo: '', novaSenha: '' });
    };

    return (
        <div className="card-face card-front">
            {/* Lado Esquerdo: Apresentação e botão de criar conta */}
            <div className="card-section welcome-section">
                <div className="welcome-content fade-in-up">
                    <div className="logo-container">
                        <img src={imgLogo} alt="Logo" className="logo-img" />
                    </div>
                    <h1 className="welcome-title">Rentabili Investidor</h1>
                    <p className="welcome-subtitle">
                        Bem-vindo ao futuro dos investimentos
                    </p>
                </div>

                {/* Botão que vira o cartão para a tela de cadastro */}
                <button className="flip-button" onClick={aoVirar}>
                    Criar Conta →
                </button>
            </div>

            {/* Lado Direito: Formulários trocados dinamicamente */}
            <div className="card-section form-section">

                {/* TELA 1 → LOGIN */}
                {visualizacao === 'login' && (
                    <div className="form-content fade-in-up">
                        <div className="form-header">
                            <h2 className="form-title">Acesse sua conta</h2>
                            <p className="form-subtitle">
                                Entre com suas credenciais
                            </p>
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

                            <button
                                type="submit"
                                className="holo-button"
                                disabled={carregando}
                            >
                                {carregando ? 'Entrando...' : 'Entrar na Conta'}
                            </button>

                            {/* Botão para inserir credenciais automaticamente */}
                            <button
                                type="button"
                                className="holo-button secondary-button"
                                onClick={preencherAutomaticamente}
                                style={{ marginTop: '10px' }}
                            >
                                Preencher Automaticamente
                            </button>
                        </form>

                        {/* Link para trocar para o fluxo de recuperação de senha */}
                        <a
                            href="#"
                            className="form-link"
                            onClick={(e) => {
                                e.preventDefault();
                                setVisualizacao('recuperar');
                            }}
                        >
                            Esqueceu sua senha?
                        </a>
                    </div>
                )}

                {/* TELA 2 → INSERIR E-MAIL PARA RECUPERAÇÃO */}
                {visualizacao === 'recuperar' && (
                    <div className="form-content fade-in-up">
                        <div className="form-header">
                            <h2 className="form-title">Recuperar Senha</h2>
                            <p className="form-subtitle">
                                Insira seu e-mail para receber o código
                            </p>
                        </div>

                        <form onSubmit={lidarComEsqueciSenha}>
                            <InputFlutuante
                                id="email"
                                type="email"
                                rotulo="Seu E-mail"
                                valor={dadosForm.email}
                                aoMudar={lidarComMudanca}
                                erro={erros.email}
                                required
                            />

                            <button type="submit" className="holo-button">
                                Enviar Código
                            </button>
                        </form>

                        {/* Voltar ao login */}
                        <a
                            href="#"
                            className="form-link"
                            onClick={(e) => {
                                e.preventDefault();
                                setVisualizacao('login');
                            }}
                        >
                            ← Voltar para Login
                        </a>
                    </div>
                )}

                {/* TELA 3 → VALIDAR CÓDIGO E ALTERAR SENHA */}
                {visualizacao === 'validar' && (
                    <div className="form-content fade-in-up">
                        <div className="form-header">
                            <h2 className="form-title">Redefinir</h2>
                            <p className="form-subtitle">
                                Código enviado para seu e-mail
                            </p>
                        </div>

                        <form onSubmit={lidarComValidacao}>
                            <InputFlutuante
                                id="codigo"
                                type="text"
                                rotulo="Código (Use 123456)"
                                valor={dadosForm.codigo}
                                aoMudar={lidarComMudanca}
                                erro={erros.codigo}
                                required
                            />

                            <InputFlutuante
                                id="novaSenha"
                                type="password"
                                rotulo="Nova Senha"
                                valor={dadosForm.novaSenha}
                                aoMudar={lidarComMudanca}
                                erro={erros.novaSenha}
                                required
                            />

                            <button type="submit" className="holo-button">
                                Salvar Nova Senha
                            </button>
                        </form>

                        {/* Cancelar processo e voltar ao login */}
                        <a
                            href="#"
                            className="form-link"
                            onClick={(e) => {
                                e.preventDefault();
                                setVisualizacao('login');
                            }}
                        >
                            Cancelar
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FrenteCartao;
