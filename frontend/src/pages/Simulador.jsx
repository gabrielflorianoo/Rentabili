import React, { useState } from "react";
import "../styles/simulador.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Tipos pré-definidos para facilitar a vida do usuário (Taxas Anuais Estimadas)
const OPCOES_INVESTIMENTO = {
    POUPANCA: { label: 'Poupança (Isento)', taxa: 6.17, tipoIR: 'ISENTO' },
    NU_CONTA: { label: 'Conta Digital (100% CDI)', taxa: 10.65, tipoIR: 'REGRESSIVO' },
    CDB_110: { label: 'CDB Promo (110% CDI)', taxa: 11.71, tipoIR: 'REGRESSIVO' },
    LCI_90: { label: 'LCI/LCA (90% CDI - Isento)', taxa: 9.58, tipoIR: 'ISENTO' },
    TESOURO: { label: 'Tesouro Selic', taxa: 10.75, tipoIR: 'REGRESSIVO' },
    ACOES: { label: 'Carteira de Ações (Est. 15%)', taxa: 15.00, tipoIR: 'RENDA_VARIAVEL' },
};

const CORES = ['#00a651', '#d90429', '#0077b6', '#9b5de5', '#f15bb5', '#fee440'];

export default function Simulador() {
    // Estado da lista de cenários
    const [cenarios, setCenarios] = useState([]);
    
    // Estado do formulário de adição
    const [novoCenario, setNovoCenario] = useState({
        nome: '',
        aporteInicial: 1000,
        aporteMensal: 200,
        taxaAnual: 10.65, // Começa com CDI padrão
        tipoIR: 'REGRESSIVO',
        prazoMeses: 24
    });

    const [graficoData, setGraficoData] = useState(null);

    // --- FUNÇÕES AUXILIARES ---
    
    const calcularIR = (dias, tipo) => {
        if (tipo === 'ISENTO') return 0;
        if (tipo === 'RENDA_VARIAVEL') return 15.0; // Swing trade padrão
        // Tabela Regressiva
        if (dias <= 180) return 22.5;
        if (dias <= 360) return 20.0;
        if (dias <= 720) return 17.5;
        return 15.0;
    };

    const adicionarCenario = () => {
        if (!novoCenario.nome) {
            alert("Dê um nome para este cenário (Ex: Minha Aposentadoria)");
            return;
        }

        const taxaMensal = Math.pow(1 + (Number(novoCenario.taxaAnual) / 100), 1 / 12) - 1;
        let montante = Number(novoCenario.aporteInicial);
        let totalInvestido = Number(novoCenario.aporteInicial);
        const evolucao = [montante];

        // Cálculo mês a mês
        for (let i = 1; i <= Number(novoCenario.prazoMeses); i++) {
            montante = (montante + Number(novoCenario.aporteMensal)) * (1 + taxaMensal);
            totalInvestido += Number(novoCenario.aporteMensal);
            evolucao.push(montante);
        }

        // Cálculo Final (Impostos)
        const lucroBruto = montante - totalInvestido;
        const aliquota = calcularIR(Number(novoCenario.prazoMeses) * 30, novoCenario.tipoIR);
        const imposto = lucroBruto * (aliquota / 100);
        const liquido = montante - imposto;

        const cenarioCalculado = {
            id: Date.now(),
            ...novoCenario,
            resultado: {
                bruto: montante,
                liquido: liquido,
                investido: totalInvestido,
                lucro: liquido - totalInvestido,
                evolucao: evolucao
            }
        };

        const novaLista = [...cenarios, cenarioCalculado];
        setCenarios(novaLista);
        atualizarGrafico(novaLista);
        
        // Limpa nome para o próximo
        setNovoCenario({...novoCenario, nome: ''});
    };

    const removerCenario = (id) => {
        const novaLista = cenarios.filter(c => c.id !== id);
        setCenarios(novaLista);
        atualizarGrafico(novaLista);
    };

    const atualizarGrafico = (lista) => {
        if (lista.length === 0) {
            setGraficoData(null);
            return;
        }

        // Pega o maior prazo para definir o eixo X
        const maiorPrazo = Math.max(...lista.map(c => Number(c.prazoMeses)));
        const labels = Array.from({ length: maiorPrazo + 1 }, (_, i) => `Mês ${i}`);

        const datasets = lista.map((c, index) => ({
            label: c.nome,
            data: c.resultado.evolucao,
            borderColor: CORES[index % CORES.length],
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: 2
        }));

        setGraficoData({ labels, datasets });
    };

    const handleSelectPreset = (key) => {
        const preset = OPCOES_INVESTIMENTO[key];
        setNovoCenario({
            ...novoCenario,
            nome: preset.label, // Sugere nome
            taxaAnual: preset.taxa,
            tipoIR: preset.tipoIR
        });
    };

    return (
        <div className="dashboard-wrap">
            <div className="content">
                <header className="content-head">
                    <h2>Simulador Multi-Cenários</h2>
                    <div className="user-badge">Comparativo Avançado</div>
                </header>

                <div className="simulador-container">
                    
                    {/* --- 1. ÁREA DE CADASTRO DE CENÁRIO --- */}
                    <div className="form-section">
                        <h1 className="simuladorTitulo">Adicionar Novo Investimento à Comparação</h1>
                        
                        {/* Botões Rápidos de Tipo */}
                        <div className="presets-row">
                            {Object.keys(OPCOES_INVESTIMENTO).map(key => (
                                <button 
                                    key={key} 
                                    className="btn-preset"
                                    onClick={() => handleSelectPreset(key)}
                                >
                                    {OPCOES_INVESTIMENTO[key].label}
                                </button>
                            ))}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nome do Cenário</label>
                                <input 
                                    className="simuladorInput" 
                                    placeholder="Ex: CDB do Banco X"
                                    value={novoCenario.nome} 
                                    onChange={e => setNovoCenario({...novoCenario, nome: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Taxa (% ao Ano)</label>
                                <input 
                                    type="number" 
                                    className="simuladorInput" 
                                    value={novoCenario.taxaAnual} 
                                    onChange={e => setNovoCenario({...novoCenario, taxaAnual: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de Imposto</label>
                                <select 
                                    className="simuladorInput" 
                                    value={novoCenario.tipoIR} 
                                    onChange={e => setNovoCenario({...novoCenario, tipoIR: e.target.value})}
                                >
                                    <option value="REGRESSIVO">Regressivo (CDB/Tesouro)</option>
                                    <option value="ISENTO">Isento (LCI/LCA/Poupança)</option>
                                    <option value="RENDA_VARIAVEL">Renda Variável (15%)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Aporte Inicial (R$)</label>
                                <input type="number" className="simuladorInput" value={novoCenario.aporteInicial} onChange={e => setNovoCenario({...novoCenario, aporteInicial: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Aporte Mensal (R$)</label>
                                <input type="number" className="simuladorInput" value={novoCenario.aporteMensal} onChange={e => setNovoCenario({...novoCenario, aporteMensal: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Prazo (Meses)</label>
                                <input type="number" className="simuladorInput" value={novoCenario.prazoMeses} onChange={e => setNovoCenario({...novoCenario, prazoMeses: e.target.value})} />
                            </div>
                        </div>

                        <button onClick={adicionarCenario} className="simuladorButton">
                            + ADICIONAR À COMPARAÇÃO
                        </button>
                    </div>

                    {/* --- 2. RESULTADOS (HORIZONTAL) --- */}
                    {cenarios.length > 0 && (
                        <>
                            <h3 className="section-title-small">Ranking de Resultados (Líquidos)</h3>
                            
                            <div className="cards-horizontal-scroll">
                                {cenarios
                                    .sort((a, b) => b.resultado.liquido - a.resultado.liquido) // Ordena do maior pro menor
                                    .map((cenario, index) => (
                                    <div key={cenario.id} className="resultado-card" style={{borderTop: `5px solid ${CORES[index % CORES.length]}`}}>
                                        <div className="card-header">
                                            <span className="posicao">#{index + 1}</span>
                                            <h4>{cenario.nome}</h4>
                                            <button className="btn-close" onClick={() => removerCenario(cenario.id)}>×</button>
                                        </div>
                                        
                                        <div className="card-body">
                                            <div className="row">
                                                <span>Valor Líquido:</span>
                                                <strong className="valor-final">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cenario.resultado.liquido)}
                                                </strong>
                                            </div>
                                            <div className="row">
                                                <span>Lucro Real:</span>
                                                <span className="valor-lucro">
                                                    +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cenario.resultado.lucro)}
                                                </span>
                                            </div>
                                            <hr/>
                                            <div className="row-small">
                                                <span>Taxa:</span>
                                                <span>{cenario.taxaAnual}% a.a.</span>
                                            </div>
                                            <div className="row-small">
                                                <span>Total Investido:</span>
                                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cenario.resultado.investido)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- 3. GRÁFICO COMPARATIVO --- */}
                            <div className="chartWrapper">
                                <h3 style={{textAlign: 'center', marginBottom: '15px'}}>Curva de Evolução Patrimonial</h3>
                                {graficoData && <Line data={graficoData} />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
