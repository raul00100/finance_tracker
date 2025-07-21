// import React, { createContext, useState, useContext, useEffect } from "react";
// import PropTypes from "prop-types";

// // Create a context for shared variables
// const SharedContext = createContext();

// SharedProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };
// // Provider component to wrap the app
// export function SharedProvider({ children }) {
//   const [balance, setBalance] = useState(() => {
//     const savedBalance = localStorage.getItem("balance");
//     try {
//       return savedBalance ? JSON.parse(savedBalance) : 0;
//     } catch (error) {
//       console.error("Error parsing balance from localStorage:", error);
//       return 0; // Default value
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem("balance", JSON.stringify(balance));
//   }, [balance]);

//   const [transaction, setTransaction] = useState(() => {
//     const savedTransaction = localStorage.getItem("transaction");
//     try {
//       return savedTransaction ? JSON.parse(savedTransaction) : [];
//     } catch (error) {
//       console.error("Error parsing transaction from localStorage:", error);
//       return []; // Default value
//     }
//   });

//   const allExpense =
//     transaction.length > 0 && transaction.every((t) => t.type === "expense");
//   const allIncome =
//     transaction.length > 0 && transaction.every((t) => t.type === "income");

//   useEffect(() => {
//     localStorage.setItem("transaction", JSON.stringify(transaction));
//   }, [transaction]);

//   return (
//     <SharedContext.Provider
//       value={{
//         balance,
//         setBalance,
//         transaction,
//         setTransaction,
//         allExpense,
//         allIncome,
//       }}
//     >
//       {children}
//     </SharedContext.Provider>
//   );
// }
// // Custom hook to use shared variables
// export function useShared() {
//   return useContext(SharedContext);
// }

import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const SharedContext = createContext(null);

const STORAGE_KEY = "financeTracker:v1";

// Загружаем данные из localStorage
function loadDataFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (err) {
      console.error("Ошибка чтения данных из localStorage:", err);
    }
  }

  // Попытка взять старые ключи, если они остались
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

  // Записываем всё в один ключ
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(financeData));
  }, [financeData]);

  // Удаляем старые ключи
  useEffect(() => {
    localStorage.removeItem("balance");
    localStorage.removeItem("transaction");
  }, []);

  // Устанавливаем баланс (с новым значением)
  function updateBalance(newBalance) {
    setFinanceData((prev) => ({
      ...prev,
      balance: Number(newBalance) || 0,
    }));
  }

  // Устанавливаем транзакции (с новым массивом)
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
