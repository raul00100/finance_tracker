import React, { useState, useEffect } from "react";
import { useShared } from "../../parts/shared";
import CryptoLineGraph from "./react-chart";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import generalStyle from "../../css/generalStyle";
import Loading from "../../parts/loading";
import HomeSkeleton from "../../parts/skeletonLoading/HomeSkeleton";
import "../../css/slider.css";
import { useQuery } from "@tanstack/react-query";

async function currRates(baseCurrency = "USD") {
  const response = await fetch(
    `https://open.er-api.com/v6/latest/${baseCurrency}`
  );
  if (!response.ok) {
    throw new Error(`Error fetching currency data: ${response.statusText}`);
  }
  return await response.json();
}

async function fetchFiatHistory(
  baseCurrency,
  targetCurrencies,
  startDate,
  endDate
) {
  const response = await fetch(
    `https://api.frankfurter.app/${startDate}..${endDate}?from=${baseCurrency}&to=${targetCurrencies.join(
      ","
    )}`
  );
  if (!response.ok) {
    throw new Error(`Error fetching the fiat data: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.rates) {
    throw new Error("Invalid API response: 'rates' is missing");
  }
  // Transform the rates into the desired format
  const transformedData = targetCurrencies.map((currency) => ({
    currency,
    data: Object.entries(data.rates).map(([date, rate]) => ({
      date,
      price: rate[currency],
    })),
  }));
  return transformedData;
}

//show actual crypto rates
async function cryptoRates() {
  const symbols = JSON.stringify([
    "BTCUSDT",
    "ETHUSDT",
    "XRPUSDT",
    "SOLUSDT",
    "ADAUSDT",
    "SUIUSDT",
  ]);
  const response = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(
      symbols
    )}`
  );
  if (!response.ok) {
    throw new Error(`Error fetching crypto data: ${response.statusText}`);
  }
  return await response.json();
}

// fetch crypto histories for the graph
async function fetchAllCryptoHistories(symbols) {
  // Ensure symbols is always an array
  const defaultSymbols = [
    "BTCUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "SUIUSDT",
  ];
  if (!Array.isArray(symbols)) {
    symbols = defaultSymbols;
  }
  const histories = {};

  for (const symbol of symbols) {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=30`
    );
    if (!response.ok) {
      console.error(
        `Error fetching historical data for ${symbol}: ${response.statusText}`
      );
      continue; // Skip this symbol if there's an error
    }
    const data = await response.json();
    // console.log(symbol, data); // посмотрите, что приходит
    histories[symbol] = data.map((item) => ({
      date: new Date(item[0]).toLocaleDateString(), // Convert timestamp to date
      price: parseFloat(item[4]), // Closing price
    }));
  }

  return histories; // Return an object with historical data for all symbols
}

const box = "currency-item";
const header = "font-mono text-xl mb-10 ml-10";
const rowObj = "flex flex-row";

const { buttonStyleGreen } = generalStyle;
const inputStyle =
  "border-black border-2 h-11 mr-3 pl-4 shadow-[4px_4px_0px_0px_#000] text-lg font-medium";

export default function HomePage() {
  const { balance, setBalance } = useShared("");
  const [submitted, setSubmitted] = useState(false);
  const baseCurrency = "USD";
  const [selected, setSelected] = useState("USD");

  useEffect(() => {
    const savedSub = localStorage.getItem("submitted");
    if (savedSub) {
      setSubmitted(savedSub);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("submitted", submitted);
  }, [submitted]);

  const {
    data: fiatRates,
    isLoading: fiatLoading,
    error: fiatError,
  } = useQuery({
    queryKey: ["fiatRates", baseCurrency],
    queryFn: () => currRates(baseCurrency),
  });

  const {
    data: fiatHistory,
    isLoading: fiatHistoryLoading,
    error: fiatHistoryError,
  } = useQuery({
    queryKey: ["fiatHistory", baseCurrency],
    queryFn: () =>
      fetchFiatHistory(
        baseCurrency,
        ["EUR", "GBP", "JPY"],
        "2025-04-01",
        "2025-05-31"
      ),
  });

  const {
    data: cryptoData,
    isLoading: cryptoLoading,
    error: cryptoError,
  } = useQuery({
    queryKey: ["cryptoRates"],
    queryFn: cryptoRates,
  });

  const {
    data: cryptoHistories,
    isLoading: cryptoHistoryLoading,
    error: cryptoHistoryError,
  } = useQuery({
    queryKey: ["cryptoHistory"],
    queryFn: fetchAllCryptoHistories,
  });

  const handleClick = (currency) => {
    setSelected(currency);
  };

  const handleBalance = (e) => {
    setBalance(e.target.value);
  };

  const rates = fiatRates?.rates
    ? ["USD", "EUR", "GBP", "JPY"].reduce((acc, cur) => {
        acc[cur] = fiatRates.rates[cur];
        return acc;
      }, {})
    : null;

  const crypto = cryptoData
    ? cryptoData.reduce((acc, item) => {
        acc[item.symbol.replace("USDT", "").toLowerCase()] = parseFloat(
          item.price
        ).toFixed(2);
        return acc;
      }, {})
    : {};

  const convertedBalance =
    selected === baseCurrency
      ? new Intl.NumberFormat("en-US", { useGrouping: true }).format(balance)
      : new Intl.NumberFormat("en-US", { useGrouping: true }).format(
          (balance * rates[selected]).toFixed(2)
        );

  // gather error
  const firstError =
    fiatError || fiatHistoryError || cryptoError || cryptoHistoryError;
  if (firstError) {
    return (
      <div className="error">
        Error: {firstError.message || String(firstError)}
      </div>
    );
  }

  // global loading fallback (optional)
  if (
    fiatLoading ||
    fiatHistoryLoading ||
    cryptoLoading ||
    cryptoHistoryLoading
  ) {
    return (
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loading />
      </div>
    );
  }
  if (
    fiatLoading ||
    fiatHistoryLoading ||
    cryptoLoading ||
    cryptoHistoryLoading
  ) {
    return (
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      {submitted ? (
        <div className="mb-20 ml-10">
          <h1 className={`${rowObj} font-bold text-3xl mt-7 font-mono mb-6`}>
            Balance in{" "}
            <ul className={rowObj}>
              {Object.keys(rates).map((currency) => (
                <li
                  key={currency}
                  onClick={() => handleClick(currency)}
                  className={`cursor-pointer ${
                    selected === currency
                      ? "underline"
                      : "hover:scale-110 transition"
                  } ml-4`}
                  style={{
                    color: selected === currency ? "green" : "black",
                    fontWeight: selected === currency ? "bold" : "normal",
                  }}
                >
                  {currency}
                </li>
              ))}
            </ul>
          </h1>

          <div className={rowObj}>
            <h1 className="text-3xl mr-10 mt-1">
              <span className="font-bold font-sans mr-1.5">
                {convertedBalance}
              </span>
              <span>{selected}</span>
            </h1>
            <button
              className={`${buttonStyleGreen} px-6 py-2 bg-[#3F7D58] active:bg-emerald-600`}
              onClick={() => setSubmitted(false)}
            >
              CHANGE
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 mb-21 ml-10">
          <h2 className="text-2xl font-mono mb-6">Enter your balance:</h2>
          <div className="flex flex-row">
            <div className="relative flex items-center">
              <span className="absolute left-2 text-gray-500">
                <AttachMoneyRoundedIcon className="text-lime-600" />
              </span>
              <input
                type="number"
                value={balance}
                onChange={handleBalance}
                className={`${inputStyle} pl-7.5`}
              />
            </div>
            <button
              className={`${buttonStyleGreen} h-11 bg-[#3F7D58] active:bg-emerald-600 px-3`}
              onClick={() => {
                if (!balance || isNaN(balance) || balance <= 0) {
                  alert(
                    "you broke ass, enter a valid number for your balance 😩"
                  );
                  return;
                }
                setSubmitted(true);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <h3 className={header}>Crypto Currency</h3>
      {cryptoLoading || cryptoHistoryLoading ? (
        <HomeSkeleton />
      ) : (
        <div className="currency-marquee mb-20">
          <div className="currency-track">
            {/* Первый проход */}
            {Object.entries(cryptoHistories || {}).map(([symbol, history]) => (
              <div className={box} key={`a-${symbol}`}>
                <h3>
                  {symbol.replace("USDT", "")}: $
                  {crypto[symbol.replace("USDT", "").toLowerCase()]}
                </h3>
                <CryptoLineGraph
                  data={history}
                  label={symbol.replace("USDT", "")}
                />
              </div>
            ))}

            {/* Второй (дубликат) для бесшовной прокрутки */}
            {Object.entries(cryptoHistories || {}).map(([symbol, history]) => (
              <div className={box} key={` b-${symbol} `}>
                <h3>
                  {symbol.replace("USDT", "")}: $
                  {crypto[symbol.replace("USDT", "").toLowerCase()]}
                </h3>
                <CryptoLineGraph
                  data={history}
                  label={symbol.replace("USDT", "")}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className={header}>The graph of fiat history</h3>
      {fiatLoading || fiatHistoryLoading ? (
        <HomeSkeleton />
      ) : (
        <div className="currency-marquee mb-20">
          <div className="currency-track-reverse">
            {/* Первый проход */}
            {fiatHistory.map((currencyData) => (
              <div className={box} key={currencyData.currency}>
                <h3>
                  {baseCurrency} = {rates?.[currencyData.currency] || ""}{" "}
                  {currencyData.currency}
                </h3>
                <CryptoLineGraph
                  data={currencyData.data}
                  label={currencyData.currency}
                />
              </div>
            ))}
            {/* Второй (дубликат) для бесшовной прокрутки */}
            {fiatHistory.map((currencyData) => (
              <div className={box} key={currencyData.currency}>
                <h3>
                  {baseCurrency} = {rates?.[currencyData.currency] || ""}{" "}
                  {currencyData.currency}
                </h3>
                <CryptoLineGraph
                  data={currencyData.data}
                  label={currencyData.currency}
                />
              </div>
            ))}
            {/* третий дубль */}
            {fiatHistory.map((currencyData) => (
              <div className="currency-item" key={currencyData.currency}>
                <h3>
                  {baseCurrency} = {rates?.[currencyData.currency] || ""}{" "}
                  {currencyData.currency}
                </h3>
                <CryptoLineGraph
                  data={currencyData.data}
                  label={currencyData.currency}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
