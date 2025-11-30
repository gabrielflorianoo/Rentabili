import React, { useState } from "react";
import "../styles/simulador.css";
import Sidebar from "../components/Sidebar"; // Componente de navegação lateral (sidebar)
import { investmentsApi } from "../services/apis"; // API de investimentos (não usada aqui diretamente)

// Importações e registro do Chart.js para gráficos de linha
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Simulador() {
    // Dados do usuário (mock inicial)
    const [userData] = useState({ name: "Usuário" });

    // Estados dos inputs do simulador
    const [valorInicial, setValorInicial] = useState(null);
    const [taxa, setTaxa] = useState(null);
    const [tempo, setTempo] = useState(null);

    // Estados dos resultados do cálculo
    const [resultado, setResultado] = useState(null);
    const [jurosTotais, setJurosTotais] = useState(null);
    const [crescimento, setCrescimento] = useState(null);
    const [evolucao, setEvolucao] = useState([]); // Array para evolução mês a mês

    // Função que calcula a evolução do investimento
    const calcularEvolucao = () => {
        if (!valorInicial || !taxa || !tempo) return; // validação simples

        const valores = [];
        let atual = valorInicial;

        // Calcula crescimento composto mês a mês
        for (let i = 0; i <= tempo; i++) {
            valores.push(atual);
            atual *= 1 + taxa / 100;
        }

        const final = valores[valores.length - 1];
        const juros = final - valorInicial;
        const crescimentoPct = (juros / valorInicial) * 100;

        // Atualiza estados com os resultados
        setResultado(final);
        setJurosTotais(juros);
        setCrescimento(crescimentoPct);
        setEvolucao(valores);
    };

    // Detecta tema escuro para adaptar cores do gráfico
    const dark = document.body.classList.contains("dark");
    const chartTextColor = dark ? "#0ed41fff" : "#11bb44ff";
    const chartBorderColor = dark ? "#4ade80" : "#166534";
    const chartGridColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    return (
        <div className="dashboard-wrap">
            <div className="content">
                {/* Cabeçalho do dashboard */}
                <header className="content-head">
                    <h2>Simulador</h2>
                    <div className="user-badge">👤 {userData.name}</div>
                </header>

                {/* Seção do formulário do simulador */}
                <div className="form-section">
                    <h1 className="simuladorTitulo">Simulador de Investimentos</h1>
                    <div className="form-row">
                        {/* Input Valor Inicial */}
                        <div className="form-group">
                            <label>Valor Inicial</label>
                            <input
                                placeholder="Ex: 1000"
                                type="number"
                                className="simuladorInput"
                                onChange={(e) => setValorInicial(Number(e.target.value))}
                            />
                        </div>

                        {/* Input Taxa mensal */}
                        <div className="form-group">
                            <label>Taxa (% ao mês)</label>
                            <input
                                placeholder="Ex: 0.8"
                                type="number"
                                className="simuladorInput"
                                onChange={(e) => setTaxa(Number(e.target.value))}
                            />
                        </div>

                        {/* Input Tempo em meses */}
                        <div className="form-group">
                            <label>Tempo (meses)</label>
                            <input
                                placeholder="Ex: 12"
                                type="number"
                                className="simuladorInput"
                                onChange={(e) => setTempo(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Botão para calcular */}
                    <button onClick={calcularEvolucao} className="simuladorButton">
                        Simular
                    </button>
                </div>

                {/* Cards de resultado */}
                {resultado !== null && (
                    <section className="stats-grid">
                        <div className="stat-card green">
                            <div className="stat-icon">📌</div>
                            <div className="stat-info">
                                <div className="stat-label">Valor Final</div>
                                <div className="stat-value">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(resultado)}
                                </div>
                            </div>
                        </div>

                        <div className="stat-card blue">
                            <div className="stat-icon">💰</div>
                            <div className="stat-info">
                                <div className="stat-label">Juros Totais</div>
                                <div className="stat-value">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(jurosTotais)}
                                </div>
                            </div>
                        </div>

                        <div className="stat-card purple">
                            <div className="stat-icon">📈</div>
                            <div className="stat-info">
                                <div className="stat-label">Crescimento</div>
                                <div className="stat-value">{crescimento.toFixed(2)}%</div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Gráfico de evolução */}
                {evolucao.length > 0 && (
                    <div className="chartWrapper">
                        <Line
                            data={{
                                labels: evolucao.map((_, i) => `Mês ${i}`),
                                datasets: [
                                    {
                                        label: "Evolução do Investimento",
                                        data: evolucao,
                                        borderWidth: 2,
                                        tension: 0.3,
                                        borderColor: chartBorderColor,
                                        backgroundColor: chartBorderColor,
                                        pointRadius: 4,
                                        pointHoverRadius: 6,
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: { labels: { color: chartTextColor } },
                                    tooltip: {
                                        callbacks: {
                                            label: function (ctx) {
                                                const raw = ctx.raw;
                                                if (typeof raw === "number") {
                                                    return `R$ ${raw.toFixed(2)}`;
                                                }
                                                return String(raw);
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                                    y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
