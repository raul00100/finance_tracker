import React, { useState, useEffect } from 'react';

import CryptoLineGraph from '../statistic/react-chart'

async function fetchCryptoHistory(symbol = 'BTCUSDT') {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=30`);
    if (!response.ok) {
        throw new Error(`Error fetching historical data for ${symbol}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(item => ({
        date: new Date(item[0]).toLocaleDateString(), // Convert timestamp to date
        price: parseFloat(item[4]), // Closing price
    }));
}
  
export default function Test() {
const [cryptoHistory, setCryptoHistory] = useState([]);
const [selectedCrypto, setSelectedCrypto] = useState('BTCUSDT'); // Default to Bitcoin
const [error, setError] = useState(null);

useEffect(() => {
    const loadCryptoHistory = async () => {
    try {
        const data = await fetchCryptoHistory(selectedCrypto);
        setCryptoHistory(data);
    } catch (err) {
        setError(err.message);
        console.error("Error fetching crypto history:", err);
    }
    };

    loadCryptoHistory();
}, [selectedCrypto]);

return (
    <div>
    <h2>Cryptocurrency Line Graph</h2>
    <select onChange={(e) => setSelectedCrypto(e.target.value)}>
        <option value="BTCUSDT">Bitcoin (BTC)</option>
        <option value="ETHUSDT">Ethereum (ETH)</option>
        <option value="XRPUSDT">Ripple (XRP)</option>
        <option value="SOLUSDT">Solana (SOL)</option>
        <option value="ADAUSDT">Cardano (ADA)</option>
    </select>

    {error && <p className="error">{error}</p>}

    {cryptoHistory.length > 0 && (
        <CryptoLineGraph data={cryptoHistory} label={selectedCrypto.replace('USDT', '')} />
    )}
    </div>
);
}