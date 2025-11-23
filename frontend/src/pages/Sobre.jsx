import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/estilo.css';

export default function Sobre() {
  return (
    <div className="page-container">
      <Header />
      <main className="page-content">
        <h1 className="page-title">Sobre o Rentabil</h1>
        <p className="page-text">
          O Rentabil é um sistema gerenciador de rentabilidade de investimentos, desenvolvido para resolver a falta de visibilidade e monitoramento ineficiente da rentabilidade de investimentos por parte de investidores.
        </p>

        <h2 className="section-title">Equipe de Desenvolvimento</h2>

        <table className="tabela-sobre">
          <thead>
            <tr>
              <th className="tabela-head">Responsável</th>
              <th className="tabela-head">Área</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="tabela-cell">Robson Luis de Carvalho</td><td className="tabela-cell">Frontend + Integração Frontend-Backend</td></tr>
            <tr><td className="tabela-cell">Matheus Marinho Rodrigues</td><td className="tabela-cell">Frontend</td></tr>
            <tr><td className="tabela-cell">Gabriel Fernando Floriano</td><td className="tabela-cell">Backend</td></tr>
            <tr><td className="tabela-cell">Celso Lopes Filho</td><td className="tabela-cell">Banco de Dados</td></tr>
            <tr><td className="tabela-cell">Wilson de Oliveira Santos</td><td className="tabela-cell">Frontend + Gestão</td></tr>
          </tbody>
        </table>

        <h2 className="section-title">Links do Projeto</h2>
        <ul className="page-list">
          <li>
            <a href="https://github.com/gabrielflorianoo/Rentabili" target="_blank" className="texto-verde">
              GitHub do Projeto
            </a>
          </li>
          <li>
            <a href="#" className="texto-verde">
              Documentação no Google Drive
            </a>
          </li>
        </ul>
      </main>

      <Footer />
    </div>
  );
}
