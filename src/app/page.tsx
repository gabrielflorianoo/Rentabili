"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "@/components/css/simulador.module.css";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SimuladorInvestimento() {
  const [valorInicial, setValorInicial] = useState<number | null>(null);
  const [taxa, setTaxa] = useState<number | null>(null);
  const [tempo, setTempo] = useState<number | null>(null);

  const [resultado, setResultado] = useState<number | null>(null);
  const [jurosTotais, setJurosTotais] = useState<number | null>(null);
  const [evolucao, setEvolucao] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [erros, setErros] = useState({
    valorInicial: "",
    taxa: "",
    tempo: "",
  });

  // Aplica a classe dark
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  // =========================
  // RECURSÃO
  // =========================

  const calcularEvolucaoRecursiva = (
    valorAtual: number,
    taxa: number,
    mesesRestantes: number,
    acumulado: number[] = []
  ): number[] => {
    if (mesesRestantes === 0) return [...acumulado, valorAtual];

    const novoValor = valorAtual * (1 + taxa / 100);

    return calcularEvolucaoRecursiva(
      novoValor,
      taxa,
      mesesRestantes - 1,
      [...acumulado, valorAtual]
    );
  };

  // =========================
  // VALIDAÇÃO UX
  // =========================

  const validar = () => {
    const e = { valorInicial: "", taxa: "", tempo: "" };
    let ok = true;

    if (!valorInicial || valorInicial <= 0) {
      e.valorInicial = "Informe um valor maior que zero.";
      ok = false;
    }

    if (taxa === null || taxa <= 0) {
      e.taxa = "A taxa deve ser maior que zero.";
      ok = false;
    }

    if (!tempo || tempo <= 0) {
      e.tempo = "O tempo deve ser maior que zero.";
      ok = false;
    }

    setErros(e);
    return ok;
  };

  // =========================
  // SIMULAÇÃO
  // =========================

  const simular = () => {
    if (!validar()) return;

    setLoading(true);

    setTimeout(() => {
      const listaValores = calcularEvolucaoRecursiva(valorInicial!, taxa!, tempo!);
      const valorFinal = listaValores[listaValores.length - 1];
      const juros = valorFinal - valorInicial!;

      setResultado(valorFinal);
      setJurosTotais(juros);
      setEvolucao(listaValores);

      setLoading(false);
    }, 600); // simula processamento
  };
const lineColor = darkMode ? "#ffffff" : "#000000";
const pointColor = darkMode ? "#ffffff" : "#000000";



  return (
    <div className={styles.simuladorContainer}>

      {/* -------- DARK MODE -------- */}
      <div className={styles.darkToggleWrapper}>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      {/* -------- FORM -------- */}
      <div className={styles.formWrapper}>
        <h1 className={styles.simuladorTitulo}>Simulador de Investimentos</h1>

        {/* Valor Inicial */}
        <div className={styles.campoWrapper}>
          <Input
            type="number"
            placeholder="Valor Inicial (ex: 1000)"
            className={erros.valorInicial ? styles.inputErro : ""}
            onChange={(e) => setValorInicial(Number(e.target.value))}
          />
          {erros.valorInicial && (
            <span className={styles.erroMsg}>{erros.valorInicial}</span>
          )}
        </div>

        {/* Taxa */}
        <div className={styles.campoWrapper}>
          <Input
            type="number"
            placeholder="Taxa (% ao mês, ex: 0.8)"
            className={erros.taxa ? styles.inputErro : ""}
            onChange={(e) => setTaxa(Number(e.target.value))}
          />
          {erros.taxa && (
            <span className={styles.erroMsg}>{erros.taxa}</span>
          )}
        </div>

        {/* Tempo */}
        <div className={styles.campoWrapper}>
          <Input
            type="number"
            placeholder="Tempo (meses, ex: 12)"
            className={erros.tempo ? styles.inputErro : ""}
            onChange={(e) => setTempo(Number(e.target.value))}
          />
          {erros.tempo && (
            <span className={styles.erroMsg}>{erros.tempo}</span>
          )}
        </div>

        {/* Botão */}
        <Button onClick={simular} disabled={loading}>
          {loading ? "Simulando..." : "Simular"}
        </Button>

        {/* Resultados */}
        {resultado !== null && (
          <div className={styles.resultadoCard}>
            <p>📌 Valor Final: <strong>R$ {resultado.toFixed(2)}</strong></p>
            <p>💸 Juros Totais: <strong>R$ {jurosTotais?.toFixed(2)}</strong></p>
            <p>📈 Crescimento: <strong>{((resultado / valorInicial!) - 1).toFixed(2)}%</strong></p>
          </div>
        )}

        {/* Gráfico */}
        {evolucao.length > 0 && (
          <div className={styles.graficoWrapper}>
            <Line
              data={{
                labels: evolucao.map((_, i) => `Mês ${i}`),
                datasets: [
                  {
                    label: "Evolução do Investimento",
                    data: evolucao,
                    borderWidth: 2,
                    tension: 0.3, // 🔥 animação suave
    borderColor: lineColor,        // <--- ADICIONADO
    pointBackgroundColor: pointColor,
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
