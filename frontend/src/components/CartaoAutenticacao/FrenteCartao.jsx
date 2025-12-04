import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFlutuante from '../InputFlutuante';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import imgLogo from '../../assets/logo.jpeg';
import styles from './FrenteCartao.module.css';

const FrenteCartao = ({ aoVirar }) => {
    const navigate = useNavigate();
    const [visualizacao, setVisualizacao] = useState('login');
    const [dadosForm, setDadosForm] = useState({
        email: '',
        senha: '',
        codigo: '',
        novaSenha: '',
    });
    const [erros, setErros] = useState({});
    const [carregando, setCarregando] = useState(false);
    const [emailRecuperacao, setEmailRecuperacao] = useState('');

    const lidarComMudanca = (e) => {
        setDadosForm({ ...dadosForm, [e.target.id]: e.target.value });
        setErros({ ...erros, [e.target.id]: '' });
    };

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

    const lidarComLogin = async (e) => {
        e.preventDefault();
        setCarregando(true);

        const resposta = await servicoAutenticacao.entrar(
            dadosForm.email,
            dadosForm.senha,
        );
        setCarregando(false);

        if (resposta.sucesso) {
            navigate('/dashboard');
        } else {
            setErros({ [resposta.campo]: resposta.erro });
        }
    };

    const lidarComEsqueciSenha = (e) => {
        e.preventDefault();
        if (!dadosForm.email) {
            setErros({ email: 'Digite seu e-mail para continuar.' });
            return;
        }

        setEmailRecuperacao(dadosForm.email);
        alert(
            `SIMULAÇÃO: Um código de verificação foi enviado para ${dadosForm.email}.\n\nSeu código de teste é: 123456`,
        );

        setVisualizacao('validar');
        setErros({});
    };

    const lidarComValidacao = (e) => {
        e.preventDefault();

        if (dadosForm.codigo !== '123456') {
            setErros({ codigo: 'Código inválido.' });
            return;
        }

        if (dadosForm.novaSenha.length < 6) {
            setErros({ novaSenha: 'A senha deve ter no mínimo 6 caracteres.' });
            return;
        }

        alert('Senha redefinida com sucesso! (Simulação)');
        setVisualizacao('login');
        setDadosForm({ ...dadosForm, senha: '', codigo: '', novaSenha: '' });
    };

    return (
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
            {/* Lado Esquerdo: Boas Vindas */}
            <div className={`${styles.cardSection} ${styles.welcomeSection}`}>
                <div className={`${styles.welcomeContent} ${styles.fadeInUp}`}>
                    
                    {/* --- ATALHO NA LOGO ADICIONADO AQUI --- */}
                    <div 
                        className={styles.logoContainer} 
                        onClick={() => navigate('/')} 
                        style={{ cursor: 'pointer' }}
                        title="Voltar para a Página Inicial"
                    >
                        <img src={imgLogo} alt="Logo" className={styles.logoImg} />
                    </div>
                    {/* -------------------------------------- */}

                    <h1 className={styles.welcomeTitle}>Rentabili Investidor</h1>
                    <p className={styles.welcomeSubtitle}>
                        Bem-vindo ao futuro dos investimentos
                    </p>
                </div>
                <button className={`${styles.flipButton}`} onClick={aoVirar}>
                    Criar Conta →
                </button>
            </div>

            {/* Lado Direito: Formulários */}
            <div className={`${styles.cardSection} ${styles.formSection}`}>
                {visualizacao === 'login' && (
                    <div className={`${styles.formContent} ${styles.fadeInUp}`}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Acesse sua conta</h2>
                            <p className={styles.formSubtitle}>
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
                                className={styles.holoButton}
                                disabled={carregando}
                            >
                                {carregando ? 'Entrando...' : 'Entrar na Conta'}
                            </button>

                            <button
                                type="button"
                                className={`${styles.holoButton} ${styles.secondaryButton}`}
                                onClick={preencherAutomaticamente}
                            >
                                Preencher Automaticamente
                            </button>
                        </form>
                        <a
                            href="#"
                            className={styles.formLink}
                            onClick={(e) => {
                                e.preventDefault();
                                setVisualizacao('recuperar');
                            }}
                        >
                            Esqueceu sua senha?
                        </a>
                    </div>
                )}

                {/* TELA DE RECUPERAÇÃO */}
                {visualizacao === 'recuperar' && (
                    <div className={`${styles.formContent} ${styles.fadeInUp}`}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Recuperar Senha</h2>
                            <p className={styles.formSubtitle}>
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
                            <button type="submit" className={styles.holoButton}>
                                Enviar Código
                            </button>
                        </form>
                        <a
                            href="#"
                            className={styles.formLink}
                            onClick={(e) => {
                                e.preventDefault();
                                setVisualizacao('login');
                            }}
                        >
                            ← Voltar para Login
                        </a>
                    </div>
                )}

                {/* TELA DE VALIDAÇÃO */}
                {visualizacao === 'validar' && (
                    <div className={`${styles.formContent} ${styles.fadeInUp}`}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Redefinir</h2>
                            <p className={styles.formSubtitle}>
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
                            <button type="submit" className={styles.holoButton}>
                                Salvar Nova Senha
                            </button>
                        </form>
                        <a
                            href="#"
                            className={styles.formLink}
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
