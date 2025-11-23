import React, { useState, useEffect } from "react";
import "../styles/simulador.css";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import DarkModeToggle from "../components/ui/DarkModeToggle";

import { Line } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Simulador() {
const [dark, setDark] = useState(false);

// Aplica tema no body
useEffect(() => {
document.body.className = dark ? "dark" : "";
}, [dark]);

const chartTextColor = dark ? "#fff" : "#222";
const chartBorderColor = dark ? "#4ade80" : "#166534";
const chartGridColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

const [valorInicial, setValorInicial] = useState(null);
const [taxa, setTaxa] = useState(null);
const [tempo, setTempo] = useState(null);

const [resultado, setResultado] = useState(null);
const [jurosTotais, setJurosTotais] = useState(null);
const [crescimento, setCrescimento] = useState(null);
const [evolucao, setEvolucao] = useState([]);

const calcularEvolucao = () => {
if (!valorInicial || !taxa || !tempo) return;

const valores = [];
let atual = valorInicial;

for (let i = 0; i <= tempo; i++) {
  valores.push(atual);
  atual *= 1 + taxa / 100;
}

const final = valores[valores.length - 1];
const juros = final - valorInicial;
const crescimentoPct = (juros / valorInicial) * 100;

setResultado(final);
setJurosTotais(juros);
setCrescimento(crescimentoPct);
setEvolucao(valores);

};

return (
<div className={`simuladorContainer ${dark ? "dark" : ""}`}> <div className="darkToggleWrapper">
<DarkModeToggle onToggle={() => setDark(!dark)} dark={dark} /> </div>

  <div className={`card ${dark ? "cardDark" : ""}`}>
    <h1 className="simuladorTitulo">Simulador de Investimentos</h1>

    <div className="formWrapper">
      <Input
        placeholder="Ex: 1000 (valor inicial)"
        type="number"
        onChange={(e) => setValorInicial(Number(e.target.value))}
      />

      <Input
        placeholder="Ex: 0.8 (% ao mês)"
        type="number"
        onChange={(e) => setTaxa(Number(e.target.value))}
      />

      <Input
        placeholder="Ex: 12 (meses)"
        type="number"
        onChange={(e) => setTempo(Number(e.target.value))}
      />

      <Button onClick={calcularEvolucao} className="mt-4">
        Simular
      </Button>

      {resultado !== null && (
        <div className={`resultadoBox ${dark ? "resultadoDark" : ""}`}>
          <p>📌 Valor Final: <b>R$ {resultado.toFixed(2)}</b></p>
          <p>💰 Juros Totais: <b>R$ {jurosTotais?.toFixed(2)}</b></p>
          <p>📈 Crescimento: <b>{crescimento?.toFixed(2)}%</b></p>
        </div>
      )}

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
                x: {
                  ticks: { color: chartTextColor },
                  grid: { color: chartGridColor },
                },
                y: {
                  ticks: { color: chartTextColor },
                  grid: { color: chartGridColor },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  </div>
</div>
);
}