import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/estilo.css';

export default function Resumo() {
    return (
        <div className="page-container">
            {/* Componente de cabeçalho compartilhado */}
            <Header />

            {/* Conteúdo principal da página */}
            <main className="page-content">
                {/* Título principal da página */}
                <h1 className="page-title">Resumo do Projeto Rentabili</h1>

                {/* Parágrafo introdutório descrevendo a continuidade do projeto */}
                <p className="page-text">
                    Este documento é a continuação do projeto Rentabili. A Fase
                    1 apresentou o entendimento do negócio e a proposta inicial
                    de solução. A Fase 2 detalha o progresso do desenvolvimento,
                    incluindo o modelo de dados revisado.
                </p>

                {/* Seção: Entendimento do negócio */}
                <h2 className="section-title">Entendimento do Negócio</h2>
                <p className="page-text">
                    O problema central é a falta de visibilidade e o
                    monitoramento ineficiente da rentabilidade de investimentos
                    por parte de investidores.
                </p>

                {/* Seção: Requisitos do projeto */}
                <h2 className="section-title">Requisitos</h2>
                <ul className="page-list">
                    <li>
                        <strong>Funcionais:</strong> Cadastro de ativos,
                        registro de saldos, cálculo automático de rentabilidade
                        e gráficos.
                    </li>
                    <li>
                        <strong>Não Funcionais:</strong> Interface intuitiva,
                        segurança de dados e alta disponibilidade.
                    </li>
                </ul>

                {/* Área centralizada para figura/diagrama UML */}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p
                        style={{
                            fontSize: '0.9rem',
                            color: '#666',
                            marginTop: '10px',
                        }}
                    >
                        
                    </p>
                </div>
            </main>

            {/* Componente de rodapé compartilhado */}
            <Footer />
        </div>
    );
}
