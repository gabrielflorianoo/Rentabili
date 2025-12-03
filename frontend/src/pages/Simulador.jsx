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

// Registrando componentes do gráfico
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
    // Estados do Formulário
    const [tipoInvestimento, setTipoInvestimento] = useState("CDB"); // CDB, LCI, TESOURO
    const [valorInicial, setValorInicial] = useState("");
    const [aporteMensal, setAporteMensal] = useState(""); // Novo: Aporte mensal
    const [taxaAnual, setTaxaAnual] = useState(""); // Novo: Taxa Anual (mais comum)
    const [prazoMeses, setPrazoMeses] = useState("");

    // Estados de Resultado
    const [resultados, setResultados] = useState(null);
    const [dadosGrafico, setDadosGrafico] = useState(null);

    // --- REGRA DE NEGÓCIO: TABELA REGRESSIVA DE IR ---
    const calcularAliquotaIR = (dias) => {
        if (tipoInvestimento === "LCI") return 0; // LCI/LCA é isento
        
        if (dias <= 180) return 22.5;
        if (dias <= 360) return 20.0;
        if (dias <= 720) return 17.5;
        return 15.0;
    };

    const simular = () => {
        if (!valorInicial || !taxaAnual || !prazoMeses) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        // Conversão de Taxa Anual para Mensal
        const taxaMensal = (Math.pow(1 + (Number(taxaAnual) / 100), 1 / 12) - 1);
        
        let totalInvestido = Number(valorInicial);
        let montanteBruto = Number(valorInicial);
        const aporte = Number(aporteMensal) || 0;
        
        const labels = [];
        const dataBruto = [];
        const dataInvestido = [];
        const dataLiquido = [];

        // --- MOTOR DE CÁLCULO MÊS A MÊS ---
        for (let i = 0; i <= Number(prazoMeses); i++) {
            // Adiciona dados ao gráfico
            labels.push(`Mês ${i}`);
            dataInvestido.push(totalInvestido);
            
            // Calcula imposto proporcional ao tempo decorrido (em dias)
            const diasCorridos = i * 30;
            const aliquota = calcularAliquotaIR(diasCorridos);
            
            const rendimento = montanteBruto - totalInvestido;
            const descontoIR = rendimento * (aliquota / 100);
            const liquido = montanteBruto - descontoIR;

            dataBruto.push(montanteBruto);
            dataLiquido.push(liquido);

            // Avança para o próximo mês (Juros Compostos + Aporte)
            if (i < Number(prazoMeses)) {
                montanteBruto = (montanteBruto + aporte) * (1 + taxaMensal);
                totalInvestido += aporte;
            }
        }

        // Consolida resultados finais
        const valorFinalBruto = dataBruto[dataBruto.length - 1];
        const valorFinalInvestido = dataInvestido[dataInvestido.length - 1];
        const valorFinalLiquido = dataLiquido[dataLiquido.length - 1];
        const lucroBruto = valorFinalBruto - valorFinalInvestido;
        const impostoTotal = valorFinalBruto - valorFinalLiquido;

        setResultados({
            valorFinalBruto,
            valorFinalLiquido,
            valorFinalInvestido,
            lucroBruto,
            impostoTotal,
            aliquotaFinal: calcularAliquotaIR(Number(prazoMeses) * 30)
        });

        setDadosGrafico({
            labels,
            datasets: [
                {
                    label: 'Patrimônio Bruto',
                    data: dataBruto,
                    borderColor: '#00a651',
                    backgroundColor: 'rgba(0, 166, 81, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Patrimônio Líquido (Pós Imposto)',
                    data: dataLiquido,
                    borderColor: '#0077b6',
                    borderDash: [5, 5], // Linha pontilhada
                    tension: 0.4
                },
                {
                    label: 'Dinheiro Investido',
                    data: dataInvestido,
                    borderColor: '#666',
                    pointRadius: 0,
                    borderWidth: 1
                }
            ]
        });
    };

    return (
        <div className="dashboard-wrap">
            <div className="content">
                <header className="content-head">
                    <h2>Simulador Avançado</h2>
                    <div className="user-badge">Modo Projeção</div>
                </header>

                <div className="simulador-container">
                    {/* --- ÁREA DE INPUTS --- */}
                    <div className="form-section">
                        <h1 className="simuladorTitulo">Parâmetros da Simulação</h1>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tipo de Investimento</label>
                                <select 
                                    className="simuladorInput"
                                    value={tipoInvestimento}
                                    onChange={(e) => setTipoInvestimento(e.target.value)}
                                >
                                    <option value="CDB">CDB / RDB (Tributável)</option>
                                    <option value="TESOURO">Tesouro Direto (Tributável)</option>
                                    <option value="LCI">LCI / LCA (Isento de IR)</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Valor Inicial (R$)</label>
                                <input
                                    type="number"
                                    className="simuladorInput"
                                    placeholder="Ex: 5000"
                                    value={valorInicial}
                                    onChange={(e) => setValorInicial(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Aporte Mensal (R$)</label>
                                <input
                                    type="number"
                                    className="simuladorInput"
                                    placeholder="Ex: 500 (Opcional)"
                                    value={aporteMensal}
                                    onChange={(e) => setAporteMensal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Rentabilidade Anual (%)</label>
                                <input
                                    type="number"
                                    className="simuladorInput"
                                    placeholder="Ex: 13.75"
                                    value={taxaAnual}
                                    onChange={(e) => setTaxaAnual(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Prazo (Meses)</label>
                                <input
                                    type="number"
                                    className="simuladorInput"
                                    placeholder="Ex: 24"
                                    value={prazoMeses}
                                    onChange={(e) => setPrazoMeses(e.target.value)}
                                />
                            </div>
                        </div>

                        <button onClick={simular} className="simuladorButton">
                            Calcular Projeção
                        </button>
                    </div>

                    {/* --- ÁREA DE RESULTADOS --- */}
                    {resultados && (
                        <>
                            <section className="stats-grid">
                                <div className="stat-card green">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <div className="stat-label">Valor Final Líquido</div>
                                        <div className="stat-value">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultados.valorFinalLiquido)}
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card blue">
                                    <div className="stat-icon">📈</div>
                                    <div className="stat-info">
                                        <div className="stat-label">Total em Juros</div>
                                        <div className="stat-value">
                                            +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultados.lucroBruto)}
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card red">
                                    <div className="stat-icon">🏛️</div>
                                    <div className="stat-info">
                                        <div className="stat-label">Imposto (IR {resultados.aliquotaFinal}%)</div>
                                        <div className="stat-value">
                                            -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultados.impostoTotal)}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="chartWrapper">
                                <Line 
                                    data={dadosGrafico} 
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'top' },
                                            tooltip: { mode: 'index', intersect: false }
                                        },
                                        interaction: {
                                            mode: 'nearest',
                                            axis: 'x',
                                            intersect: false
                                        }
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
