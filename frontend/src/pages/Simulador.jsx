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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Simulador() {
    // --- ESTADOS DO CENÁRIO A ---
    const [cenarioA, setCenarioA] = useState({
        nome: "Cenário A (Ex: Poupança)",
        tipo: "CDB", // Usando CDB como genérico tributável
        taxa: 0.6, // % ao mês
        inicial: 1000,
        aporte: 100
    });

    // --- ESTADOS DO CENÁRIO B ---
    const [cenarioB, setCenarioB] = useState({
        nome: "Cenário B (Ex: CDB 120%)",
        tipo: "CDB",
        taxa: 1.1, // % ao mês
        inicial: 1000,
        aporte: 100
    });

    const [prazo, setPrazo] = useState(24); // Meses
    const [resultado, setResultado] = useState(null);

    // Regra de Negócio: Tabela Regressiva IR
    const calcularIR = (dias, tipo) => {
        if (tipo === "LCI" || tipo === "LCA") return 0;
        if (dias <= 180) return 22.5;
        if (dias <= 360) return 20.0;
        if (dias <= 720) return 17.5;
        return 15.0;
    };

    const calcularCenario = (params, meses) => {
        let montante = Number(params.inicial);
        let investido = Number(params.inicial);
        const evolucao = [montante];
        const taxaDecimal = Number(params.taxa) / 100;

        for (let i = 1; i <= meses; i++) {
            montante = (montante + Number(params.aporte)) * (1 + taxaDecimal);
            investido += Number(params.aporte);
            evolucao.push(montante);
        }

        // Desconto de IR no final
        const lucroBruto = montante - investido;
        const aliquota = calcularIR(meses * 30, params.tipo);
        const imposto = lucroBruto * (aliquota / 100);
        const liquido = montante - imposto;

        return {
            bruto: montante,
            liquido: liquido,
            investido: investido,
            lucroLiquido: liquido - investido,
            evolucao: evolucao
        };
    };

    const simular = () => {
        const resA = calcularCenario(cenarioA, prazo);
        const resB = calcularCenario(cenarioB, prazo);

        const labels = Array.from({ length: Number(prazo) + 1 }, (_, i) => `Mês ${i}`);

        setResultado({
            a: resA,
            b: resB,
            diferenca: resB.liquido - resA.liquido,
            grafico: {
                labels,
                datasets: [
                    {
                        label: cenarioA.nome,
                        data: resA.evolucao,
                        borderColor: '#d90429', // Vermelho/Laranja
                        backgroundColor: 'rgba(217, 4, 41, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: cenarioB.nome,
                        data: resB.evolucao,
                        borderColor: '#00a651', // Verde Rentabili
                        backgroundColor: 'rgba(0, 166, 81, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            }
        });
    };

    return (
        <div className="dashboard-wrap">
            <div className="content">
                <header className="content-head">
                    <h2>Comparador de Investimentos</h2>
                    <div className="user-badge">Simulação Avançada</div>
                </header>

                <div className="simulador-container">
                    
                    {/* --- ÁREA DE INPUTS LADO A LADO --- */}
                    <div className="comparador-grid">
                        
                        {/* CENÁRIO A */}
                        <div className="cenario-card">
                            <h3 style={{color: '#d90429'}}>Cenário A</h3>
                            <div className="form-group">
                                <label>Nome</label>
                                <input className="simuladorInput" value={cenarioA.nome} onChange={e => setCenarioA({...cenarioA, nome: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Taxa (% a.m.)</label>
                                <input type="number" className="simuladorInput" value={cenarioA.taxa} onChange={e => setCenarioA({...cenarioA, taxa: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Tipo (IR)</label>
                                <select className="simuladorInput" value={cenarioA.tipo} onChange={e => setCenarioA({...cenarioA, tipo: e.target.value})}>
                                    <option value="CDB">CDB (Tributável)</option>
                                    <option value="LCI">LCI (Isento)</option>
                                </select>
                            </div>
                        </div>

                        {/* PARÂMETROS COMUNS */}
                        <div className="cenario-card centro">
                            <h3>Parâmetros</h3>
                            <div className="form-group">
                                <label>Valor Inicial (R$)</label>
                                <input type="number" className="simuladorInput" value={cenarioA.inicial} onChange={e => {
                                    setCenarioA({...cenarioA, inicial: e.target.value});
                                    setCenarioB({...cenarioB, inicial: e.target.value});
                                }} />
                            </div>
                            <div className="form-group">
                                <label>Aporte Mensal (R$)</label>
                                <input type="number" className="simuladorInput" value={cenarioA.aporte} onChange={e => {
                                    setCenarioA({...cenarioA, aporte: e.target.value});
                                    setCenarioB({...cenarioB, aporte: e.target.value});
                                }} />
                            </div>
                            <div className="form-group">
                                <label>Tempo (Meses)</label>
                                <input type="number" className="simuladorInput" value={prazo} onChange={e => setPrazo(e.target.value)} />
                            </div>
                            <button onClick={simular} className="simuladorButton" style={{marginTop: '20px'}}>
                                COMPARAR AGORA
                            </button>
                        </div>

                        {/* CENÁRIO B */}
                        <div className="cenario-card">
                            <h3 style={{color: '#00a651'}}>Cenário B</h3>
                            <div className="form-group">
                                <label>Nome</label>
                                <input className="simuladorInput" value={cenarioB.nome} onChange={e => setCenarioB({...cenarioB, nome: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Taxa (% a.m.)</label>
                                <input type="number" className="simuladorInput" value={cenarioB.taxa} onChange={e => setCenarioB({...cenarioB, taxa: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Tipo (IR)</label>
                                <select className="simuladorInput" value={cenarioB.tipo} onChange={e => setCenarioB({...cenarioB, tipo: e.target.value})}>
                                    <option value="CDB">CDB (Tributável)</option>
                                    <option value="LCI">LCI (Isento)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- RESULTADOS --- */}
                    {resultado && (
                        <div className="resultado-comparativo">
                            
                            <div className="placar">
                                <div className="placar-item">
                                    <span>Resultado A (Líquido)</span>
                                    <strong style={{color: '#d90429'}}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.a.liquido)}
                                    </strong>
                                </div>
                                <div className="vs">VS</div>
                                <div className="placar-item">
                                    <span>Resultado B (Líquido)</span>
                                    <strong style={{color: '#00a651'}}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.b.liquido)}
                                    </strong>
                                </div>
                            </div>

                            <div className="vencedor-banner">
                                {resultado.diferenca > 0 
                                    ? `🏆 O Cenário B rende R$ ${resultado.diferenca.toFixed(2)} a mais!` 
                                    : `🏆 O Cenário A rende R$ ${Math.abs(resultado.diferenca).toFixed(2)} a mais!`}
                            </div>

                            <div className="chartWrapper">
                                <Line data={resultado.grafico} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
