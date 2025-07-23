import React, { useState } from "react";
import { useShared } from "../../parts/shared";
import TransactionList from "./transactionList";
import TransactionTabs from "./transactionTab";
import { expenseOption, incomeOption, financeType } from "../../parts/options";
import generalStyle from "../../css/generalStyle";

const { indent } = generalStyle;

export default function Story() {
  const { balance, updateBalance, transaction, updateTransactions } =
    useShared();

  const [editId, setEditId] = useState(null);
  const [editDetails, setEditDetails] = useState({
    type: "",
    amount: "",
    category: "",
    subCategory: "",
    date: null,
    payment: "",
    description: "",
  });
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFilteredTransactions = (tabIdx) => {
    if (tabIdx === 0) return transaction;
    if (tabIdx === 1) return transaction.filter((t) => t.type === "income");
    return transaction.filter((t) => t.type === "expense");
  };

  // Удалить все транзакции и откатить баланс
  const handleDeleteAll = () => {
    if (!window.confirm("Are you sure you want to delete ALL transactions?"))
      return;
    const totalIncome = transaction
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transaction
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Вернуть деньги: вычесть доходы, прибавить расходы
    const newBalance = Number(balance) - totalIncome + totalExpense;
    updateBalance(newBalance);
    updateTransactions([]);
  };

  // Удаление одной транзакции
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    const txToDelete = transaction.find((t) => t.id === id);
    if (!txToDelete) return;

    const remaining = transaction.filter((t) => t.id !== id);
    updateTransactions(remaining);

    let newBalance = Number(balance);
    if (txToDelete.type === "income") {
      newBalance -= Number(txToDelete.amount);
    } else {
      newBalance += Number(txToDelete.amount);
    }
    updateBalance(newBalance);
  };

  // Начать редактирование
  const handleEdit = (id) => {
    const tx = transaction.find((t) => t.id === id);
    if (!tx) return;
    setEditId(id);
    setEditDetails({ ...tx });
  };

  // Submit редактирования
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editId == null) return;

    const original = transaction.find((t) => t.id === editId);
    if (!original) return;

    // Пересчитать баланс: убрать старую транзакцию, добавить новую
    let newBalance = Number(balance);
    if (original.type === "income") {
      newBalance -= Number(original.amount);
    } else {
      newBalance += Number(original.amount);
    }

    const editedAmount = Number(editDetails.amount);
    if (editDetails.type === "income") {
      newBalance += editedAmount;
    } else {
      newBalance -= editedAmount;
    }

    const updated = transaction.map((t) =>
      t.id === editId
        ? {
            ...t,
            ...editDetails,
            amount: editedAmount,
            // date уже timestamp или null (TransactionList нормализует)
          }
        : t
    );

    updateTransactions(updated);
    updateBalance(newBalance);

    // Сброс состояния редактирования
    setEditId(null);
    setEditDetails({
      type: "",
      amount: "",
      category: "",
      subCategory: "",
      date: null,
      payment: "",
      description: "",
    });
  };

  const panels = [0, 1, 2].map((tabIdx) => (
    <TransactionList
      key={tabIdx}
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
    <div className={indent}>
      <TransactionTabs
        tabValue={tabValue}
        handleTabChange={handleTabChange}
        panels={panels}
      />
    </div>
  );
}
