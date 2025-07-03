import React, { useState, useEffect } from "react";
import { useShared } from "../parts/shared";
import '../css/main.css';
import CryptoLineGraph from '../statistic/react-chart'

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


async function currRates(baseCurrency = 'USD') {
  const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
  if (!response.ok) {
    throw new Error(`Error fetching currency data: ${response.statusText}`);
  }
  return await response.json();
}

async function cryptoRates() {
  const symbols = JSON.stringify(["BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "ADAUSDT", "SUIUSDT"]);
  const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbols)}`);
  if (!response.ok) {
    throw new Error(`Error fetching crypto data: ${response.statusText}`);
  }
  return await response.json();
}

async function fetchAllCryptoHistories(symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT",  "SUIUSDT"]) {
  const histories = {};

  for (const symbol of symbols) {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=30`);
    if (!response.ok) {
      console.error(`Error fetching historical data for ${symbol}: ${response.statusText}`);
      continue; // Skip this symbol if there's an error
    }
    const data = await response.json();
    histories[symbol] = data.map(item => ({
      date: new Date(item[0]).toLocaleDateString(), // Convert timestamp to date
      price: parseFloat(item[4]), // Closing price
    }));
  }

  return histories; // Return an object with historical data for all symbols
}

async function fetchFiatHistory(baseCurrency, targetCurrencies, startDate, endDate) {
  const response = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${baseCurrency}&to=${targetCurrencies.join(',')}`);
  if (!response.ok) {
    throw new Error(`Error fetching the fiat data: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.rates) {
    throw new Error("Invalid API response: 'rates' is missing");
  }
  // Transform the rates into the desired format
  const transformedData = targetCurrencies.map(currency => ({
    currency,
    data: Object.entries(data.rates).map(([date, rate]) => ({
      date,
      price: rate[currency],
    })),
  }));
  return transformedData;
}


export default function HomePage() {
  const { balance, setBalance} = useShared('');
  const [submitted, setSubmitted] = useState(false);
  const [crypto, setCrypto] = useState({});
  const baseCurrency = 'USD'
  const [selected, setSelected] = useState('USD')
  const [rates, setRates] = useState(null);
  const [error, setError] = useState(null);
  const [cryptoHistories, setCryptoHistories] = useState({}); 
  const [fiat, setFiat] = useState([]);

  const handleBalance = (e) => {
    setBalance(e.target.value);
  };

  useEffect(() => {
    const savedSub = localStorage.getItem("submitted");
    if (savedSub) {
      setSubmitted(savedSub); 
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("submitted", submitted); 
  }, [submitted]);


  useEffect(() => {
    const loadCurrencyData = async () => {
      try {
        const data = await currRates(baseCurrency);
        const displayCurrencies = ['USD', 'EUR', 'GBP', 'JPY' ];

        const filteredRates = {};
        displayCurrencies.forEach(currency => {
          if (data.rates[currency]) {
            filteredRates[currency] = data.rates[currency];
          }
        });
        setRates(filteredRates);
      } catch (err) {
        setError(err.message);
        console.error("Fetch failed:", err);
      }
    };

    loadCurrencyData();
  }, [baseCurrency]);

  useEffect(() => {
    const targetCurrencies = ['EUR', 'GBP', 'JPY'];
    const loadFiat = async () => {
      try {
        const data = await fetchFiatHistory('USD', targetCurrencies, '2023-01-01', '2023-01-31');
        setFiat(data);
      } catch (err) {
        setError(err);
        console.error("error fetching fiat history", err);
      }
    };
    loadFiat();
  }, []);


  useEffect(() => {
    const loadCryptoData = async () => {
      try {
        const data = await cryptoRates();
        const formattedPrices = {};
        data.forEach(item => {
          const coin = item.symbol.replace('USDT', '').toLowerCase();
          formattedPrices[coin] = parseFloat(item.price).toFixed(2);
        });
        setCrypto(formattedPrices);
      } catch (err) {
        setError(err.message);
        console.error("Fetch failed:", err);
      }
    };
    loadCryptoData();
  }, []);

  useEffect(() => {
    const loadAllCryptoHistories = async () => {
      try {
        const data = await fetchAllCryptoHistories();
        setCryptoHistories(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching crypto histories:", err);
      }
    };

    loadAllCryptoHistories();
  }, []);

  const handleClick = (currency) => {
    setSelected(currency);
  }

const convertedBalance = selected === baseCurrency 
  ? new Intl.NumberFormat('en-US', { useGrouping: true }).format(balance) 
  : new Intl.NumberFormat('en-US', { useGrouping: true }).format((balance * rates[selected]).toFixed(2));

  if (error) return <div className="error">Error: {error}</div>;
  if (!rates) return <div className="loading">Loading...</div>;



  return (
    <div className="base">


      {submitted ? (
      <div className="mb-10">

        <h1 className="font-bold text-3xl mt-8 font-mono flex flex-row mb-6">
          Balance in{' '}
          <ul className="flex flex-row ">
            {Object.keys(rates).map((currency) => (
            <li
              key={currency}
              onClick={() => handleClick(currency)}
              className={`cursor-pointer ${selected === currency ? 'underline' : 'hover:scale-110 transition'} ml-4`}
              style={{
                color: selected === currency ? 'green' : 'black',
                fontWeight: selected === currency ? 'bold' : 'normal',
              }}
              >
             {currency} 
             </li>
          ))}
          </ul>
        </h1>

        <div className="flex flex-row">
        <h1 className="text-3xl mr-5">
          <span className="font-bold font-sans">{convertedBalance}</span>  <span>{selected}</span>
        </h1>
        <Stack spacing={2} direction="row">
          <Button variant="outlined" onClick={()=> setSubmitted(false)}> Change </Button>
        </Stack>
        </div>

      </div>

      ) : (
      
      <div className="mt-8 mb-10">
        <h2 className="text-2xl font-mono mb-6 ml-2">Enter your balance:</h2>
        <div className="flex flex-row">
            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-number"
                label="Number"
                type="number"
                value={balance}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                onChange={handleBalance}
              />
            </Box>
            <Stack className="mt-4">
                 <Button
                  variant="contained"
                  size="medium"
                  onClick={() => {
                    if (!balance || isNaN(balance) || balance <= 0) {
                      alert('you broke ass, enter a valid number for your balance 😩');
                      return;
                    }
                    setSubmitted(true);
                  }}
                >
                Submit</Button>
            </Stack>
            </div>
      </div>
      )}

      <h3 className="font-mono text-xl mb-10">Crypto Currency</h3>
      <div className="currency running-text mb-20 flex flex-row">
        {Object.entries(cryptoHistories).map(([symbol, history]) => (
          <div className="currency-item  running-text border-2 mr-7" key={symbol}>
            <h3>{symbol.replace('USDT', '')}: ${crypto[symbol.replace('USDT', '').toLowerCase()]}</h3>
            <CryptoLineGraph 
              data={history} 
              label={symbol.replace('USDT', '')} 
            />
          </div>
        ))}
      </div>

      <h3>The graph of fiat history</h3>
      <div className="currency">
        {fiat.map((currencyData)=> (
          <div className="currency-item" key = {currencyData.currency}>
            <h3>{baseCurrency} = {rates && rates[currencyData.currency] ? rates[currencyData.currency] : ""} {currencyData.currency}</h3>
            <CryptoLineGraph data={currencyData.data} label={currencyData.currency} />
          </div>
        ))}
      </div>
  
    </div>
  );
}


// // 1 - use try catch for a currency ✅  and add graph to them✅
// // 2 - add the choice of the currency to the balance and function to convert it ✅
// // 3 - add the calendar to a transaction to choose a date ✅
// // 4 - add description to a transaction ✅
// // 5 - routes LEAR THE ROUTES YOU IDIOT!!!!!✅
// // 6 - ability to create another account ❌
// // 7 - add recent transaction on the transaction page and add the link to the story pagepage✅
// // 8 - add a filter to the story pagepage✅
// // 9 - add a graph to compare the income and expenses❌
// // 10 - fix bugs in the chrome console✅
// // 11 - add time filter in story 
// // 12 - 1 add additional categories and subcategories ✅, 2 - type of payment ✅ and 3 - and search function for a category