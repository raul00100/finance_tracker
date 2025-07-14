import React, { useState } from "react";
import { useShared } from "../../parts/shared";
import TransactionList from "./transactionList";
import TransactionTabs from "./transactionTab";
import { expenseOption, incomeOption, financeType } from "../../parts/options";

export default function Story() {
  const { balance, setBalance, transaction, setTransaction } = useShared();
  const [editId, setEditId] = useState(null);
  const [editDetails, setEditDetails] = useState({ type: "", amount: "", category: "" });
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFilteredTransactions = (tabIdx) => {
    if (tabIdx === 0) return transaction;
    if (tabIdx === 1) return transaction.filter((t) => t.type === "income");
    return transaction.filter((t) => t.type === "expense");
  };
 const handleDeleteAll = (id) => {
        const totalIncome = transaction
        .filter((t)=> t.type === 'income')
        .reduce((sum, t)=> sum + t.amount, 0);
        const totalExpense = transaction
        .filter((t)=> t.type === 'expense')
        .reduce((sum, t)=> sum + t.amount, 0);

        const newBalance = balance - totalIncome + totalExpense;
        setBalance(newBalance);
        localStorage.setItem('balance', newBalance);

        setTransaction([]);
        localStorage.removeItem('transaction');
    };

  const handleDelete = (id) => {
    const newTransaction = transaction.filter((t) => t.id !== id);
    setTransaction(newTransaction);
    localStorage.setItem("transaction", JSON.stringify(newTransaction));
    const deletedTransaction = transaction.find((t) => t.id === id);
    let newBalance = balance;
    if (deletedTransaction.type === "income") {
      newBalance -= deletedTransaction.amount;
    } else {
      newBalance += deletedTransaction.amount;
    }
    setBalance(newBalance);
    localStorage.setItem("balance", newBalance);
  };

  const handleEdit = (id) => {
    const transactionToEdit = transaction.find((t) => t.id === id);
    setEditId(id);
    setEditDetails({ ...transactionToEdit });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const originalTransaction = transaction.find((t) => t.id === editId);
    let newBalance = balance;
    if (originalTransaction.type === "income") {
      newBalance -= originalTransaction.amount;
    } else {
      newBalance += originalTransaction.amount;
    }

    if (editDetails.type === "income") {
      newBalance += Number(editDetails.amount);
    } else {
      newBalance -= Number(editDetails.amount);
    }

    const updatedTransaction = transaction.map((t) =>
      t.id === editId ? { ...t, ...editDetails, amount: Number(editDetails.amount) } : t
    );
    setTransaction(updatedTransaction);
    localStorage.setItem("transaction", JSON.stringify(updatedTransaction));

    setBalance(newBalance);
    localStorage.setItem("balance", newBalance);

    setEditId(null);
    setEditDetails({ type: "", amount: "", category: "" });
  };

  const panels = [0, 1, 2].map((tabIdx) => (
    <TransactionList
      transactions={getFilteredTransactions(tabIdx)}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleDeleteAll={handleDeleteAll}
      editId={editId}
      editDetails={editDetails}
      setEditDetails={setEditDetails}
      handleEditSubmit={handleEditSubmit}
      expenseOption={expenseOption}
      incomeOption={incomeOption}
      financeType={financeType}
      setEditId={setEditId}
    />
  ));

  return (
    <div className="">
      <h2 className="text-3xl font-mono mb-8 mt-8">Transaction Story</h2>
      <TransactionTabs
        tabValue={tabValue}
        handleTabChange={handleTabChange}
        panels={panels}
      />
    </div>
  );
}

//сделать редезайн самой страницы
//сделать краткую карточку для каждого элемента и покащзываать всю инфу при наведение или любом другом дейтсвие 
//сделать рпедупредение при удаление
// добавить все поля при редактировании
