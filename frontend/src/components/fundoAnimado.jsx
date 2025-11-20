import React, { useEffect, useRef } from 'react';

const FundoAnimado = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const contexto = canvas.getContext('2d');
    let idAnimationFrame;
    const linhas = [];
    const NUM_LINHAS = 60;

    const redimensionar = () => {
      const DPR = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      contexto.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const redefinirLinha = (linha) => {
      linha.x = Math.random() * (window.innerWidth * 1.5) - window.innerWidth * 0.25;
      linha.y = window.innerHeight + Math.random() * 200 + 20;
      linha.comprimento = 80 + Math.random() * 220;
      linha.velocidade = 0.6 + Math.random() * 2.4;
      linha.espessura = 1 + Math.random() * 2;
      linha.opacidade = 0.15 + Math.random() * 0.35;
      linha.angulo = -Math.PI / 4 + (Math.random() - 0.5) * 0.25;
      const verde = 150 + Math.floor(Math.random() * 105);
      linha.cor = `rgba(0, ${verde}, 0, ${linha.opacidade})`;
    };

    // Inicializa linhas
    for (let i = 0; i < NUM_LINHAS; i++) {
      const l = {};
      redefinirLinha(l);
      l.y += Math.random() * 800;
      linhas.push(l);
    }

    const animar = () => {
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      linhas.forEach(linha => {
        contexto.beginPath();
        contexto.strokeStyle = linha.cor;
        contexto.lineWidth = linha.espessura;
        contexto.lineCap = 'round';
        const x2 = linha.x + Math.cos(linha.angulo) * linha.comprimento;
        const y2 = linha.y + Math.sin(linha.angulo) * linha.comprimento;
        contexto.moveTo(linha.x, linha.y);
        contexto.lineTo(x2, y2);
        contexto.stroke();

        linha.y -= linha.velocidade;
        linha.x -= linha.velocidade * 0.9;

        if (y2 < -50 || x2 < -200) {
          redefinirLinha(linha);
          linha.y = window.innerHeight + Math.random() * 300;
        }
      });
      idAnimationFrame = requestAnimationFrame(animar);
    };

    window.addEventListener('resize', redimensionar);
    redimensionar();
    animar();

    return () => {
      window.removeEventListener('resize', redimensionar);
      cancelAnimationFrame(idAnimationFrame);
    };
  }, []);

  return (
    <div className="futuristic-background">
      <canvas ref={canvasRef} id="animatedLines" />
    </div>
  );
};

export default FundoAnimado;