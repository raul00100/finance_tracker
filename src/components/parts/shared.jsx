import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const SharedContext = createContext(null);

const STORAGE_KEY = "financeTracker:v1";

function loadDataFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (err) {
      console.error("Ошибка чтения данных из localStorage:", err);
    }
  }

  let balance = 0;
  let transaction = [];
  try {
    balance = JSON.parse(localStorage.getItem("balance")) || 0;
  } catch {
    /* ignore */
  }
  try {
    transaction = JSON.parse(localStorage.getItem("transaction")) || [];
  } catch {
    /* ignore */
  }

  return { balance, transaction };
}

export function SharedProvider({ children }) {
  const [financeData, setFinanceData] = useState(loadDataFromStorage);
  const { balance, transaction } = financeData;
 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(financeData));
  }, [financeData]);

  useEffect(() => {
    localStorage.removeItem("balance");
    localStorage.removeItem("transaction");
  }, []);

  function updateBalance(newBalance) {
    setFinanceData((prev) => ({
      ...prev,
      balance: Number(newBalance) || 0,
    }));
  }

  function updateTransactions(newTransactions) {
    setFinanceData((prev) => ({
      ...prev,
      transaction: Array.isArray(newTransactions)
        ? newTransactions
        : prev.transaction,
    }));
  }

  // Флаги
  const allExpense =
    transaction.length > 0 && transaction.every((t) => t.type === "expense");
  const allIncome =
    transaction.length > 0 && transaction.every((t) => t.type === "income");

  return (
    <SharedContext.Provider
      value={{
        balance,
        updateBalance,
        transaction,
        updateTransactions,
        allExpense,
        allIncome,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
}

SharedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useShared() {
  return useContext(SharedContext);
}
