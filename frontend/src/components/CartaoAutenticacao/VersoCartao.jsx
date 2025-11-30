import React, { useState } from 'react';
import InputFlutuante from '../InputFlutuante';
import { servicoAutenticacao } from '../../services/servicoAutenticacao';
import imgLogo from '../../assets/logo.jpeg';
import styles from './VersoCartao.module.css';

const VersoCartao = ({ aoVirar }) => {
    // Indica se o cadastro foi concluído com sucesso
    const [sucesso, setSucesso] = useState(false);

    // Indica se o formulário está enviando dados
    const [carregando, setCarregando] = useState(false);

    // Armazena os valores dos campos digitados
    const [dadosForm, setDadosForm] = useState({
        nome: '',
        email: '',
        nascimento: '',
        senha: '',
        confirmarSenha: '',
    });

    // Armazena erros de validação para exibir ao usuário
    const [erros, setErros] = useState({});

    /**
     * Atualiza os campos do formulário.
     * Suporta dois formatos:
     * - Evento padrão do input
     * - Chamadas manuais como (id, valor)
     */
    const lidarComMudanca = (eOrId, maybeValue) => {
        if (eOrId && eOrId.target) {
            // Caso seja evento de input
            const { id, value } = eOrId.target;
            setDadosForm((prev) => ({ ...prev, [id]: value }));
        } else if (typeof eOrId === 'string') {
            // Caso seja chamado manualmente (id, valor)
            setDadosForm((prev) => ({ ...prev, [eOrId]: maybeValue }));
        }
    };

    /**
     * Verifica se todos os campos estão preenchidos corretamente.
     * Retorna true/false e atualiza o estado de erros.
     */
    const validar = () => {
        const novosErros = {};

        if (!dadosForm.nome) novosErros.nome = 'Nome é obrigatório';
        if (!dadosForm.email) novosErros.email = 'Email é obrigatório';

        if (!dadosForm.senha || dadosForm.senha.length < 6)
            novosErros.senha = 'Senha deve ter ao menos 6 caracteres';

        if (dadosForm.senha !== dadosForm.confirmarSenha)
            novosErros.confirmarSenha = 'Senhas não conferem';

        setErros(novosErros);

        // Retorna true se não houver erros
        return Object.keys(novosErros).length === 0;
    };

    /**
     * Envio do formulário de cadastro.
     * Chama o serviço de autenticação e trata sucesso/erro.
     */
    const lidarComCadastro = async (ev) => {
        ev.preventDefault();

        // Se a validação falhar, não envia o formulário
        if (!validar()) return;

        setCarregando(true);

        try {
            // Envia dados ao backend via serviço de autenticação
            const resposta = await servicoAutenticacao.cadastrar(dadosForm);

            console.log(resposta);

            if (resposta.sucesso) {
                // Mostra tela de sucesso
                setSucesso(true);
            } else {
                // Exibe erro retornado pelo backend
                setErros({ geral: resposta.erro });
            }
        } catch (err) {
            // Tratamento de erros inesperados
            setErros({ geral: 'Erro ao criar conta' });
            console.error(err);
        } finally {
            setCarregando(false);
        }
    };

    /**
     * Após concluir o cadastro, usuário pode voltar ao login.
     * Este método apenas chama a função de virar o cartão.
     */
    const irParaLogin = () => {
        if (aoVirar) aoVirar();
    };

    /**
     * Preenche automaticamente os campos
     * — ótimo para testes e demonstrações.
     */
    const preencherAutomaticamente = () => {
        setDadosForm({
            nome: 'Banco do Bradesco2',
            email: 'email2@example.com',
            nascimento: '0001-01-01',
            senha: '123123@',
            confirmarSenha: '123123@',
        });

        setErros({});
    };

    return (
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <div className={styles.formArea}>

                {/* Se o cadastro ainda não foi concluído, exibe o formulário */}
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
                                Mínimo de 6 caracteres e 1 caractere especial (@, #, $, etc).
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

                            {/* Exibe erro geral retornado do servidor */}
                            {erros.geral && (
                                <div className={styles.errorMessage}>
                                    {erros.geral}
                                </div>
                            )}

                            <button type="submit" className={styles.holoButton}>
                                {carregando ? 'Enviando...' : 'Criar Conta'}
                            </button>

                            {/* Botão para preencher dados automaticamente */}
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
                    // Tela exibida após cadastro bem-sucedido
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

            {/* Lado direito com branding e botão de voltar */}
            <div className={`${styles.cardSection} ${styles.welcomeSection}`}>
                <div className={`${styles.welcomeContent} ${styles.fadeInUp}`}>
                    <img src={imgLogo} alt="Logo" className={styles.logoImgBack} />
                    <h1 className={styles.welcomeTitle}>Controle seu investimento</h1>
                </div>

                {/* Botão que vira o cartão (volta ao login) */}
                <button className={styles.flipButton} onClick={aoVirar}>
                    ← Voltar
                </button>
            </div>
        </div>
    );
};

export default VersoCartao;
