import React, { useState } from 'react';
import InputFlutuante from '../InputFlutuante';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import imgLogo from '../../assets/logo.jpeg';
import styles from './VersoCartao.module.css';
const VersoCartao = ({ aoVirar }) => {
    const [sucesso, setSucesso] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [dadosForm, setDadosForm] = useState({
        nome: '',
        email: '',
        nascimento: '',
        senha: '',
        confirmarSenha: '',
    });
    const [erros, setErros] = useState({});

    const lidarComMudanca = (eOrId, maybeValue) => {
        // Suporta tanto evento quanto (id, value)
        if (eOrId && eOrId.target) {
            const { id, value } = eOrId.target;
            setDadosForm((prev) => ({ ...prev, [id]: value }));
        } else if (typeof eOrId === 'string') {
            setDadosForm((prev) => ({ ...prev, [eOrId]: maybeValue }));
        }
    };

    const validar = () => {
        const novosErros = {};
        if (!dadosForm.nome) novosErros.nome = 'Nome é obrigatório';
        if (!dadosForm.email) novosErros.email = 'Email é obrigatório';
        if (!dadosForm.senha || dadosForm.senha.length < 6)
            novosErros.senha = 'Senha deve ter ao menos 6 caracteres';
        if (dadosForm.senha !== dadosForm.confirmarSenha)
            novosErros.confirmarSenha = 'Senhas não conferem';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const lidarComCadastro = async (ev) => {
        ev.preventDefault();
        if (!validar()) return;

        setCarregando(true);
        try {
            // Se `servicoAutenticacao` tiver função de cadastro, pode ser usada aqui.
            const resposta = await servicoAutenticacao.cadastrar(dadosForm);
            console.log(resposta);

            if (resposta.sucesso) setSucesso(true);
            else setErros({ geral: resposta.erro });
        } catch (err) {
            setErros({ geral: 'Erro ao criar conta' });
            console.error(err);
        } finally {
            setCarregando(false);
        }
    };

    const irParaLogin = () => {
        // Comportamento simples: virar o cartão ou navegar
        if (aoVirar) aoVirar();
    };

    const preencherAutomaticamente = () => {
        setDadosForm({
            nome: 'Banco do Bradesco2',
            email: 'email2@example.com',
            nascimento: '0001-01-01', // Formato YYYY-MM-DD para input type="date"
            senha: '123123@',
            confirmarSenha: '123123@',
        });
        setErros({}); // Limpa erros anteriores ao preencher
    };

    return (
    <div className={`${styles.cardFace} ${styles.cardBack}`}>
        <div className={styles.formArea}>
            {!sucesso ? (
                <div className={`${styles.formContent} ${styles.fadeInUp}`}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Crie sua conta</h2>
                        <p className={styles.formSubtitle}>Junte-se à inovação</p>
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

                        <span className={styles.dicaCampo}>
                            Mínimo de 6 caracteres e 1 caractere especial
                            (@, #, $, etc).
                        </span>

                        <InputFlutuante
                            id="confirmarSenha"
                            type="password"
                            rotulo="Confirmar Senha"
                            valor={dadosForm.confirmarSenha}
                            aoMudar={lidarComMudanca}
                            erro={erros.confirmarSenha}
                            required
                        />

                        {erros.geral && (
                            <div className={styles.errorMessage}>
                                {erros.geral}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.holoButton}
                        >
                            {carregando ? 'Enviando...' : 'Criar Conta'}
                        </button>

                        <button
                            type="button"
                            className={`${styles.holoButton} ${styles.secondaryButton}`}
                            onClick={preencherAutomaticamente}
                        >
                            Preencher Automaticamente
                        </button>
                    </form>
                </div>
            ) : (
                <div
                    className={`${styles.formContent} ${styles.fadeInUp}`}
                    style={{ textAlign: 'center' }}
                >
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Conta Criada!</h2>
                        <p className={styles.formSubtitle}>
                            Seja bem-vindo ao Rentabili Investidor.
                        </p>
                    </div>

                    <button className={styles.holoButton} onClick={irParaLogin}>
                        Fazer Login Agora
                    </button>
                </div>
            )}
        </div>

        <div className={`${styles.cardSection} ${styles.welcomeSection}`}>
            <div className={`${styles.welcomeContent} ${styles.fadeInUp}`}>
                <img src={imgLogo} alt="Logo" className={styles.logoImgBack} />
                <h1 className={styles.welcomeTitle}>Controle seu investimento</h1>
            </div>

            <button className={styles.flipButton} onClick={aoVirar}>
                ← Voltar
            </button>
        </div>
    </div>
);

};

export default VersoCartao;
