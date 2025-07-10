import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for shared variables
const SharedContext = createContext();

// Provider component to wrap the app
export function SharedProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    try {
      return savedBalance ? JSON.parse(savedBalance) : 0;
    } catch (error) {
      console.error('Error parsing balance from localStorage:', error);
      return 0; // Default value
    }
  });

  useEffect(() => {
    localStorage.setItem('balance', JSON.stringify(balance));
  }, [balance]);

  const [transaction, setTransaction] = useState(() => {
    const savedTransaction = localStorage.getItem('transaction');
    try {
      return savedTransaction ? JSON.parse(savedTransaction) : [];
    } catch (error) {
      console.error('Error parsing transaction from localStorage:', error);
      return []; // Default value
    }
  });

  const allExpense = transaction.length > 0 && transaction.every(t => t.type === 'expense');
  const allIncome = transaction.length > 0 && transaction.every(t => t.type === 'income');

  useEffect(() => {
    localStorage.setItem('transaction', JSON.stringify(transaction));
  }, [transaction]);

  return (
    <SharedContext.Provider
      value={{
        balance,
        setBalance,
        transaction,
        setTransaction,
        allExpense,
        allIncome,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
}

// Custom hook to use shared variables
export function useShared() {
  return useContext(SharedContext);
}
