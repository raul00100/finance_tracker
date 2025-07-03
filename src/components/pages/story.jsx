import React, { useState } from "react";
import { useShared } from "../parts/shared";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import '../css/main.css'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


//------------------------------------------------------------------------------------------------------------------------


export default function Story() {
  const { balance, setBalance, transaction, setTransaction } = useShared();
  const [editId, setEditId] = useState(null);
  const [editDetails, setEditDetails] = useState({ type: "", amount: "", category: "" });
  const [tabValue, setTabValue] = useState(0); // State for selected tab

  const categoryOptions = {
    income: ["Salary", "Freelance", "Investments", "Gifts", "Other Income"],
    expense: ["Food", "Transport", "Housing", "Entertainment", "Healthcare", "Other Expenses"],
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter transactions based on selected tab
  const filteredTransactions =
    tabValue === 0 ? transaction : tabValue === 1
      ? transaction.filter((t) => t.type === "income")
      : transaction.filter((t) => t.type === "expense"); 

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


//------------------------------------------------------------------------------------------------------------------------


  return (
    <div className="base">
      <h2>Transaction Story</h2>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="transaction tabs">
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="Income" {...a11yProps(1)} />
            <Tab label="Expenses" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
        <TransactionList
            transactions={filteredTransactions}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDeleteAll={handleDeleteAll}
            editId={editId}
            editDetails={editDetails}
            setEditDetails={setEditDetails}
            handleEditSubmit={handleEditSubmit}
            categoryOptions={categoryOptions}
            setEditId={setEditId} // Pass setEditId as a prop
        />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
        <TransactionList
            transactions={filteredTransactions}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDeleteAll={handleDeleteAll}
            editId={editId}
            editDetails={editDetails}
            setEditDetails={setEditDetails}
            handleEditSubmit={handleEditSubmit}
            categoryOptions={categoryOptions}
            setEditId={setEditId} // Pass setEditId as a prop
        />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
        <TransactionList
            transactions={filteredTransactions}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDeleteAll={handleDeleteAll}
            editId={editId}
            editDetails={editDetails}
            setEditDetails={setEditDetails}
            handleEditSubmit={handleEditSubmit}
            categoryOptions={categoryOptions}
            setEditId={setEditId} // Pass setEditId as a prop
        />
        </CustomTabPanel>
      </Box>
    </div>
  );
}


//------------------------------------------------------------------------------------------------------------------------


function TransactionList({
  transactions,
  handleEdit,
  handleDelete,
  handleDeleteAll,
  editId,
  editDetails,
  setEditDetails,
  handleEditSubmit,
  categoryOptions,
}) {


  return (
    <div>
    <ul>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.slice().reverse().map((t) => (
          <li key={t.id}>
            {editId === t.id ? (
              <form onSubmit={handleEditSubmit}>
                <div>
                  <label>Type:</label>
                  <select
                    value={editDetails.type}
                    onChange={(e) => setEditDetails({ ...editDetails, type: e.target.value })}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={editDetails.amount}
                    onChange={(e) => setEditDetails({ ...editDetails, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Category:</label>
                  <select
                    value={editDetails.category || ""}
                    onChange={(e) => setEditDetails({ ...editDetails, category: e.target.value })}
                    required
                  >
                    {categoryOptions[editDetails.type]?.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit">Save changes</button>
                <button type="button" onClick={() => editId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p>
                  <strong>Type:</strong> {t.type}
                </p>
                <p>
                  <strong>Amount:</strong> ${t.amount}
                </p>
                <p>
                  <strong>Category:</strong> {t.category} - {t.subCategory}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(t.date).toLocaleDateString()}, {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <button onClick={() => handleEdit(t.id)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
                <hr />
              </>
            )}
          </li>
        ))
      )}
    </ul>
    {transactions.length === 0 ? '' : (
        <button onClick={handleDeleteAll}>Delete All</button>
    )}
  </div>
  );
}