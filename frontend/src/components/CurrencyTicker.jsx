import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from './Modal'; // Reaproveitando seu componente Modal existente
import './CurrencyTicker.css';

export default function CurrencyTicker() {
    const [cotacoes, setCotacoes] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState(null); // 'USD', 'EUR', 'BTC'
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // 1. Busca cotações atuais ao carregar (USD, EUR, BTC)
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
                const data = await res.json();
                setCotacoes(data);
            } catch (error) {
                console.error("Erro ao buscar cotações", error);
            }
        };
        fetchRates();
        // Atualiza a cada 30 segundos
        const interval = setInterval(fetchRates, 30000);
        return () => clearInterval(interval);
    }, []);

    // 2. Busca histórico de 7 dias quando clica na moeda
    const handleCoinClick = async (coinCode, name) => {
        setSelectedCoin({ code: coinCode, name });
        setModalOpen(true);
        setLoadingHistory(true);

        try {
            // API retorna últimos N dias
            const res = await fetch(`https://economia.awesomeapi.com.br/json/daily/${coinCode}-BRL/7`);
            const data = await res.json();

            // Formata para o gráfico (Recharts) - Inverte para ficar cronológico
            const formatted = data.map(item => ({
                data: new Date(item.timestamp * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                valor: parseFloat(item.bid)
            })).reverse();

            setHistoryData(formatted);
        } catch (error) {
            console.error("Erro ao buscar histórico", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    if (!cotacoes) return null; // Não mostra nada até carregar

    // Renderiza um item do letreiro
    const renderItem = (key, label, name) => {
        const item = cotacoes[key];
        const varValue = parseFloat(item.pctChange);
        return (
            <span className="ticker-item" onClick={() => handleCoinClick(item.code, name)}>
                {label}:
                <span className="ticker-value">R$ {parseFloat(item.bid).toFixed(2)}</span>
                <span className={`variation ${varValue >= 0 ? 'positive' : 'negative'}`}>
                    ({varValue >= 0 ? '+' : ''}{varValue}%)
                </span>
            </span>
        );
    };

    return (
        <>
            {/* LETREIRO */}
            <div className="ticker-container">
                <div className="ticker-content">
                    {/* Repete os itens algumas vezes para dar a sensação de infinito */}
                    {renderItem('USDBRL', '🇺🇸 Dólar Comercial', 'Dólar Americano')}
                    {renderItem('EURBRL', '🇪🇺 Euro Comercial', 'Euro')}
                    {renderItem('BTCBRL', '₿ Bitcoin', 'Bitcoin')}
                    {/* Repetição para loop visual suave */}
                    {renderItem('USDBRL', '🇺🇸 Dólar', 'Dólar Americano')}
                    {renderItem('EURBRL', '🇪🇺 Euro', 'Euro')}
                    {renderItem('BTCBRL', '₿ Bitcoin', 'Bitcoin')}
                </div>
            </div>

            {/* MODAL DE HISTÓRICO */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="currency-modal-content">
                    <div className="currency-header">
                        <h3>Histórico: {selectedCoin?.name} (7 Dias)</h3>
                        <p>Variação da cotação em relação ao Real (BRL)</p>
                    </div>

                    {loadingHistory ? (
                        <div className="loading-chart">Carregando gráfico...</div>
                    ) : (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={historyData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00a651" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#00a651" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="data" />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip
                                        formatter={(val) => `R$ ${val.toFixed(3)}`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="valor"
                                        stroke="#00a651"
                                        fillOpacity={1}
                                        fill="url(#colorVal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}