import React, { useState, useEffect } from "react";
import { useShared } from "../../parts/shared";
import CryptoLineGraph from "./react-chart";
import SideAnimation from "./sideAnimation";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import generalStyle from "../../css/generalStyle";
import Loading from "../../parts/loading";
import HomeSkeleton from "../../parts/skeletonLoading/HomeSkeleton";

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
    `https://api.frankfurter.app/${startDate}..${endDate}?from=${baseCurrency}&to=${targetCurrencies.join(",")}`
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
    `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbols)}`
  );
  if (!response.ok) {
    throw new Error(`Error fetching crypto data: ${response.statusText}`);
  }
  return await response.json();
}

// fetch crypto histories for the graph
async function fetchAllCryptoHistories(
  symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "SUIUSDT"]
) {
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
    histories[symbol] = data.map((item) => ({
      date: new Date(item[0]).toLocaleDateString(), // Convert timestamp to date
      price: parseFloat(item[4]), // Closing price
    }));
  }

  return histories; // Return an object with historical data for all symbols
}

const headerThird = "font-mono text-xl mb-10";
const box = "border-3 border-dashed p-5 w-[380px]";
const rowObj = "flex flex-row";

const { buttonStyleGreen, inputStyle } = generalStyle;

export default function HomePage() {
  const { balance, setBalance } = useShared("");
  const [submitted, setSubmitted] = useState(false);
  const [crypto, setCrypto] = useState({});
  const baseCurrency = "USD";
  const [selected, setSelected] = useState("USD");
  const [rates, setRates] = useState(null);
  const [error, setError] = useState(null);
  const [cryptoHistories, setCryptoHistories] = useState({});
  const [fiat, setFiat] = useState([]);

  // Separate loading states for crypto and history
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [cryptoHistoryLoading, setCryptoHistoryLoading] = useState(true);
  // Separate loading states for fiat and history
  const [fiatLoading, setFiatLoading] = useState(true);
  const [fiatHistoryLoading, setFiatHistoryLoading] = useState(true);

  const [cryptoIndex, setCryptoIndex] = useState(0);
  const cryptoSymbols = Object.keys(cryptoHistories);
  const currentSymbol = cryptoSymbols[cryptoIndex];
  const currentHistory = cryptoHistories[currentSymbol];
  const [direction, setDirection] = useState(1);

  const [fiatIndex, setFiatIndex] = useState(0);
  const [fiatDirection, setFiatDirection] = useState(1);
  const currentFiat = fiat[fiatIndex];

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
      setFiatLoading(true);
      try {
        const data = await currRates(baseCurrency);
        const displayCurrencies = ["USD", "EUR", "GBP", "JPY"];

        const filteredRates = {};
        displayCurrencies.forEach((currency) => {
          if (data.rates[currency]) {
            filteredRates[currency] = data.rates[currency];
          }
        });
        setRates(filteredRates);
      } catch (err) {
        setError(err.message);
        console.error("Fetch failed:", err);
      } finally {
        setFiatLoading(false);
      }
    };

    loadCurrencyData();
  }, [baseCurrency]);

  useEffect(() => {
    const targetCurrencies = ["EUR", "GBP", "JPY"];
    setFiatHistoryLoading(true);
    const loadFiat = async () => {
      try {
        const data = await fetchFiatHistory(
          "USD",
          targetCurrencies,
          "2023-01-01",
          "2023-01-31"
        );
        setFiat(data);
      } catch (err) {
        setError(err);
        console.error("error fetching fiat history", err);
      } finally {
        setFiatHistoryLoading(false);
      }
    };
    loadFiat();
  }, []);

  useEffect(() => {
    const loadCryptoData = async () => {
      setCryptoLoading(true);
      try {
        const data = await cryptoRates();
        const formattedPrices = {};
        data.forEach((item) => {
          const coin = item.symbol.replace("USDT", "").toLowerCase();
          formattedPrices[coin] = parseFloat(item.price).toFixed(2);
        });
        setCrypto(formattedPrices);
      } catch (err) {
        setError(err.message);
        console.error("Fetch failed:", err);
      } finally {
        setCryptoLoading(false);
      }
    };
    loadCryptoData();
  }, []);

  useEffect(() => {
    const loadAllCryptoHistories = async () => {
      setCryptoHistoryLoading(true);
      try {
        const data = await fetchAllCryptoHistories();
        setCryptoHistories(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching crypto histories:", err);
      } finally {
        setCryptoHistoryLoading(false);
      }
    };
    loadAllCryptoHistories();
  }, []);

  const handleClick = (currency) => {
    setSelected(currency);
  };

  const convertedBalance =
    selected === baseCurrency
      ? new Intl.NumberFormat("en-US", { useGrouping: true }).format(balance)
      : new Intl.NumberFormat("en-US", { useGrouping: true }).format(
          (balance * rates[selected]).toFixed(2)
        );

  if (error) return <div className="error">Error: {error}</div>;
  if (!rates)
    return (
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loading />
      </div>
    );

  return (
    <div className="">
      {submitted ? (
        <div className="mb-20">
          <h1 className={`${rowObj} font-bold text-3xl mt-8 font-mono mb-6`}>
            Balance in{" "}
            <ul className={rowObj}>
              {Object.keys(rates).map((currency) => (
                <li
                  key={currency}
                  onClick={() => handleClick(currency)}
                  className={`cursor-pointer ${selected === currency ? "underline" : "hover:scale-110 transition"} ml-4`}
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
        <div className="mt-8 mb-21">
          <h2 className="text-2xl font-mono mb-6">Enter your balance:</h2>
          <div className="flex flex-row">
            <div className="relative flex items-center">
              <span className="absolute left-1 text-gray-500">
                <AttachMoneyRoundedIcon className="text-lime-600" />
              </span>
              <input
                type="number"
                value={balance}
                onChange={handleBalance}
                className={`${inputStyle} pl-6`}
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

      <div className={`${rowObj} justify-center gap-40 mr-10`}>
        <div className="flex flex-col">
          <h3 className={headerThird}>Crypto Currency:</h3>
          <SideAnimation
            onPrev={() => {
              setDirection(-1);
              setCryptoIndex(
                (prev) =>
                  (prev - 1 + cryptoSymbols.length) % cryptoSymbols.length
              );
            }}
            onNext={() => {
              setDirection(1);
              setCryptoIndex((prev) => (prev + 1) % cryptoSymbols.length);
            }}
            direction={direction}
            selectedKey={currentSymbol}
          >
            {cryptoLoading || cryptoHistoryLoading ? (
              <HomeSkeleton />
            ) : currentSymbol && currentHistory ? (
              <div className={box} key={currentSymbol}>
                <h3>
                  {currentSymbol.replace("USDT", "")}: $
                  {crypto[currentSymbol.replace("USDT", "").toLowerCase()]}
                </h3>
                <CryptoLineGraph
                  data={currentHistory}
                  label={currentSymbol.replace("USDT", "")}
                />
              </div>
            ) : null}
          </SideAnimation>
        </div>

        <div className="flex flex-col">
          <h3 className={headerThird}>The graph of fiat history:</h3>
          <SideAnimation
            onPrev={() => {
              setFiatDirection(-1);
              setFiatIndex((prev) => (prev - 1 + fiat.length) % fiat.length);
            }}
            onNext={() => {
              setFiatDirection(1);
              setFiatIndex((prev) => (prev + 1) % fiat.length);
            }}
            direction={fiatDirection}
            selectedKey={currentFiat ? currentFiat.currency : "fiat"}
          >
            {fiatLoading || fiatHistoryLoading ? (
              <HomeSkeleton />
            ) : (
              <div>
                {currentFiat && (
                  <div className={box} key={currentFiat.currency}>
                    <h3>
                      {baseCurrency} ={" "}
                      {rates && rates[currentFiat.currency]
                        ? rates[currentFiat.currency]
                        : ""}{" "}
                      {currentFiat.currency}
                    </h3>
                    <CryptoLineGraph
                      data={currentFiat.data}
                      label={currentFiat.currency}
                    />
                  </div>
                )}
              </div>
            )}
          </SideAnimation>
        </div>
      </div>
    </div>
  );
}

//hello gitHub
