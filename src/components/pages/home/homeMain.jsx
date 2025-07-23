import React, { useState, useEffect } from "react";
import { useShared } from "../../parts/shared";
import CryptoLineGraph from "./react-chart";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import generalStyle from "../../css/generalStyle";
import Loading from "../../parts/loading";
import HomeSkeleton from "../../parts/skeletonLoading/HomeSkeleton";
// import "../../css/slider.css";
import { useQuery } from "@tanstack/react-query";
import { InfiniteSlider } from "../../motion-primitives/infinite-slider";

async function currRates(baseCurrency = "USD") {
  const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
  if (!res.ok)
    throw new Error(`Error fetching currency data: ${res.statusText}`);
  return res.json();
}

async function fetchFiatHistory(
  baseCurrency,
  targetCurrencies,
  startDate,
  endDate
) {
  const res = await fetch(
    `https://api.frankfurter.app/${startDate}..${endDate}?from=${baseCurrency}&to=${targetCurrencies.join(
      ","
    )}`
  );
  if (!res.ok)
    throw new Error(`Error fetching the fiat data: ${res.statusText}`);
  const data = await res.json();
  if (!data.rates) throw new Error("Invalid API response: 'rates' is missing");
  return targetCurrencies.map((currency) => ({
    currency,
    data: Object.entries(data.rates).map(([date, rate]) => ({
      date,
      price: rate[currency],
    })),
  }));
}

async function cryptoRates() {
  const symbols = JSON.stringify([
    "BTCUSDT",
    "ETHUSDT",
    "XRPUSDT",
    "SOLUSDT",
    "ADAUSDT",
    "SUIUSDT",
  ]);
  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(
      symbols
    )}`
  );
  if (!res.ok) throw new Error(`Error fetching crypto data: ${res.statusText}`);
  return res.json();
}

async function fetchAllCryptoHistories(symbols) {
  const defaults = [
    "BTCUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "SUIUSDT",
  ];
  if (!Array.isArray(symbols)) symbols = defaults;
  const out = {};
  for (const symbol of symbols) {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=30`
    );
    if (!res.ok) {
      console.error(
        `Error fetching historical data for ${symbol}: ${res.statusText}`
      );
      continue;
    }
    const data = await res.json();
    out[symbol] = data.map((item) => ({
      date: new Date(item[0]).toLocaleDateString(),
      price: parseFloat(item[4]),
    }));
  }
  return out;
}

const box =
  "border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col p-4 hover:shadow-[8px_8px_0px_black] hover:-translate-x-1 hover:-transalte-y-1 transition-all bg-zinc-100 hover:bg-white";
const sliderStyle = "p-3 mb-20";
const header = "font-mono text-2xl mb-7 font-mdeium ml-10";
const rowObj = "flex flex-row transition-all ";
const { buttonStyleGreen } = generalStyle;
const inputStyle =
  "border-black border-2 h-11 mr-3 pl-4 shadow-[4px_4px_0px_0px_#000] text-lg font-medium";
const graphHeader = "font-mono text-lg";
const price = "font-sans";

// const dayn = true;

export default function HomePage() {
  const { balance, updateBalance } = useShared();
  const [submitted, setSubmitted] = useState(() => {
    const saved = localStorage.getItem("submitted");
    if (saved !== null) return saved === "true";
    return Number(balance) > 0;
  });
  const baseCurrency = "USD";
  const [selected, setSelected] = useState("USD");
  // локальное состояние для input
  const [inputBalance, setInputBalance] = useState(balance);

  useEffect(() => {
    localStorage.setItem("submitted", String(submitted));
  }, [submitted]);

  useEffect(() => {
    if (Number(balance) > 0 && !submitted) setSubmitted(true);
    if (Number(balance) === 0 && submitted) setSubmitted(false);
  }, [balance]);

  // queries
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

  const handleClick = (currency) => setSelected(currency);

  // теперь просто обновляет локальное состояние
  const handleBalance = (e) => {
    setInputBalance(e.target.value);
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
    rates && selected !== baseCurrency
      ? new Intl.NumberFormat("en-US", { useGrouping: true }).format(
          (balance * rates[selected]).toFixed(2)
        )
      : new Intl.NumberFormat("en-US", { useGrouping: true }).format(balance);

  const firstError =
    fiatError || fiatHistoryError || cryptoError || cryptoHistoryError;
  if (firstError) {
    return (
      <div className="error">
        Error: {firstError.message || String(firstError)}
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

  // if (dayn) {
  //   return (
  //     <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div>
      {submitted ? (
        <div className="mb-20 ml-10">
          <h1 className={`${rowObj} font-bold text-3xl mt-7 font-mono mb-6`}>
            Balance in{" "}
            <ul className={rowObj}>
              {rates &&
                Object.keys(rates).map((currency) => (
                  <li
                    key={currency}
                    onClick={() => handleClick(currency)}
                    className={`cursor-pointer font-mono ${
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
          <h2 className="text-3xl font-mono font-semibold mb-6">
            Enter your balance:
          </h2>
          <div className="flex flex-row">
            <div className="relative flex items-center">
              <span className="absolute left-0 text-gray-500">
                <AttachMoneyRoundedIcon
                  className="text-green-700"
                  sx={{ fontSize: 30 }}
                />
              </span>
              <input
                type="number"
                value={inputBalance}
                onChange={handleBalance}
                className={`${inputStyle} pl-6`}
              />
            </div>
            <button
              className={`${buttonStyleGreen} h-11 bg-[#3F7D58] active:bg-emerald-600 px-3`}
              onClick={() => {
                const n = Number(inputBalance);
                if (!Number.isFinite(n) || n < 0) {
                  alert("enter a valid number for your balance");
                  return;
                }
                updateBalance(n);
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
        <InfiniteSlider className={sliderStyle} gap={30} speedOnHover={10}>
          {Object.entries(cryptoHistories || {}).map(([symbol, history]) => (
            <div className={box} key={`a-${symbol}`}>
              <h3 className={graphHeader}>
                {symbol.replace("USDT", "")} = $
                <span className={price}>
                  {" "}
                  {crypto[symbol.replace("USDT", "").toLowerCase()]}{" "}
                </span>
              </h3>
              <CryptoLineGraph
                data={history}
                label={symbol.replace("USDT", "")}
              />
            </div>
          ))}
          {Object.entries(cryptoHistories || {}).map(([symbol, history]) => (
            <div className={box} key={` b-${symbol} `}>
              <h3 className={graphHeader}>
                {symbol.replace("USDT", "")} = $
                <span className={price}>
                  {crypto[symbol.replace("USDT", "").toLowerCase()]}
                </span>
              </h3>
              <CryptoLineGraph
                data={history}
                label={symbol.replace("USDT", "")}
              />
            </div>
          ))}
        </InfiniteSlider>
      )}

      <h3 className={header}>The graph of fiat history</h3>
      {fiatLoading || fiatHistoryLoading ? (
        <HomeSkeleton />
      ) : (
        <InfiniteSlider
          reverse
          className={sliderStyle}
          gap={30}
          speedOnHover={10}
        >
          {fiatHistory.map((currencyData) => (
            <div className={box} key={currencyData.currency}>
              <h3 className={graphHeader}>
                {baseCurrency} ={" "}
                <span className={price}>
                  {" "}
                  {rates?.[currencyData.currency] || ""}{" "}
                </span>
                {currencyData.currency}
              </h3>
              <CryptoLineGraph
                data={currencyData.data}
                label={currencyData.currency}
              />
            </div>
          ))}
          {fiatHistory.map((currencyData) => (
            <div className={box} key={`dup1-${currencyData.currency}`}>
              <h3 className={graphHeader}>
                {baseCurrency} ={" "}
                <span className={price}>
                  {" "}
                  {rates?.[currencyData.currency] || ""}{" "}
                </span>
                {currencyData.currency}
              </h3>
              <CryptoLineGraph
                data={currencyData.data}
                label={currencyData.currency}
              />
            </div>
          ))}
          {fiatHistory.map((currencyData) => (
            <div className={box} key={`dup2-${currencyData.currency}`}>
              <h3 className={graphHeader}>
                {baseCurrency} ={" "}
                <span className={price}>
                  {" "}
                  {rates?.[currencyData.currency] || ""}{" "}
                </span>
                {currencyData.currency}
              </h3>
              <CryptoLineGraph
                data={currencyData.data}
                label={currencyData.currency}
              />
            </div>
          ))}
        </InfiniteSlider>
      )}
    </div>
  );
}
