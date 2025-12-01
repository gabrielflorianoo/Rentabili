import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/estilo.css';

export default function Sobre() {
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        background: 'transparent',
    };
    const thStyle = {
        background: '#0f7c3a',
        color: 'white',
        padding: '12px',
        textAlign: 'left',
    };
    const tdStyle = { border: '1px solid #ddddddff', padding: '12px' };

    return (
        <div className="page-container">
            <Header />
            <main className="page-content">
                <h1 className="page-title">Sobre o Rentabili</h1>
                <p className="page-text">
                    O Rentabili é um sistema gerenciador de rentabilidade de
                    investimentos, desenvolvido para resolver a falta de
                    visibilidade e monitoramento ineficiente da rentabilidade de
                    investimentos por parte de investidores.
                </p>

                <h2 className="section-title">Equipe de Desenvolvimento</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Responsável</th>
                            <th style={thStyle}>Área</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={tdStyle}>Robson Luis de Carvalho</td>
                            <td style={tdStyle}>
                                Frontend + Integração Frontend-Backend
                            </td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>Matheus Marinho Rodrigues</td>
                            <td style={tdStyle}>Frontend</td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>Gabriel Fernando Floriano</td>
                            <td style={tdStyle}>Backend</td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>Celso Lopes Filho</td>
                            <td style={tdStyle}>Banco de Dados</td>
                        </tr>
                        <tr>
                            <td style={tdStyle}>Wilson de Oliveira Santos</td>
                            <td style={tdStyle}>Frontend + UI/UX + Gestão</td>
                        </tr>
                    </tbody>
                </table>

                <h2 className="section-title">Links do Projeto</h2>
                <ul className="page-list">
                    <li>
                        <a
                            href="https://github.com/gabrielflorianoo/Rentabili"
                            target="_blank"
                            style={{ color: '#0f7c3a' }}
                        >
                            GitHub do Projeto
                        </a>
                    </li>
                    <li>
                        <a href="#" style={{ color: '#0f7c3a' }}>
                            Documentação no Google Drive
                        </a>
                    </li>
                </ul>
            </main>
            <Footer />
        </div>
    );
}
