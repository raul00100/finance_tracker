import React, { useState } from "react";
import { useShared } from "../parts/shared";
import FormSelect from "../parts/categories";

import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { Link } from "react-router-dom";

import '../css/main.css'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export default function Transaction() {
    const { balance, setBalance, setTransaction, transaction } = useShared();
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [payment, setPayment] = useState('');
    

  const expenseOption = {
    food: ['groceries', 'restaurant', 'fast food', 'bar'],
    shopping: ['clothes', 'jewelry', 'gifts', 'electronics', 'healthcare', 'for home'],
    housing: ['rent', 'mortgage', 'bill', 'repair'],
    transport: ['public transport', 'taxi', 'flights'],
    car: ['gas', 'parking', 'maintenance', 'rent', 'insurance'],
    leisure: ['sport club', 'holidays', 'traveling', 'subscription', 'hobby', 'education', 'games', 'internet'],
    payments: ['taxes', 'fines', 'fees'],
    investments: ['real estate', 'savings', 'crypto', 'stocks']
  };

  const incomeOption = {
    salary: ['job salary', 'freelance', 'tips'],
    investments: ['profit %', 'dividends'], 
    other: ['sale', 'rent', 'refund', 'gift']
  };

  const paymentType = ['cash', 'debit card', 'credit card', 'transfer', 'online payment']

    const handleTransaction = (e) => {
        e.preventDefault();

        const numericAmount = Number(amount); // Convert amount to a number

        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const newTransaction = {
            id: Date.now(),
            type,
            amount: numericAmount, // Use the numeric value
            category,
            subCategory,
            date, 
            payment,
            description,
        };

        setTransaction((prev) => [...prev, newTransaction]);

        if (type === 'income') {
            setBalance(Number(balance) + numericAmount); // Convert balance to a number
        } else {
            setBalance(Number(balance) - numericAmount); // Convert balance to a number
        }
        setType('');
        setAmount('');
        setCategory(null); // Reset category to null
        setSubCategory(null);
        setDate(null);
        setDescription('');
        setPayment(null);
    };



    return (
        <div className="w-full">

            {/* INPUT DIV */}
            <h2 className="text-3xl font-mono mb-8 mt-8">ADD DETAILS</h2>

            <form onSubmit={handleTransaction} className="flex flex-col h-full mb-15">

            {/* Form Content */}
            <div className="flex flex-row justify-between flex-grow">

                {/* General Section */}
                <div className="mb-8 ml-60">

                <h3 className="text-2xl font-mono mb-4">General</h3>

                <div className="flex flex-col mb-3">
                    <label className="font-medium font-sans underline">Transaction Type:</label>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className="w-80">
                    <InputLabel id="demo-select-small-label">Select: </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                    </FormControl>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="font-medium font-sans underline">Amount:</label>
                    <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                    noValidate
                    autoComplete="off"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    >
                    <TextField id="standard-basic" label="Type.." variant="standard" />
                    </Box>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="font-medium font-sans underline">Category:</label>
                    <FormSelect
                    label="Category"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setSubCategory('');
                    }}
                    options={type === 'income' ? Object.keys(incomeOption) : Object.keys(expenseOption)}
                    />

                    <label className="font-medium font-sans underline">Subcategory:</label>
                    <FormSelect
                    label="SubCategory"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    options={
                        category
                        ? type === 'income'
                            ? incomeOption[category] || []
                            : expenseOption[category] || []
                        : []
                    }
                    />
                </div>

                <div className="w-80">
                    <label className="font-medium font-sans underline">Date:</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ minWidth: 305 }}>
                        <DateTimePicker
                        value={date}
                        onChange={setDate}
                        referenceDate={dayjs(Date.now())}
                        required
                        />
                    </Stack>
                    </LocalizationProvider>
                </div>
                </div>

                {/* Additional Section */}
                <div className="mb-8 mr-60">
                <h3 className="font-mono text-2xl mb-4">Additional</h3>
                <div className="flex flex-col mb-3">
                    <label className="font-medium font-sans underline">Description:</label>
                    <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                    noValidate
                    autoComplete="off"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    >
                    <TextField id="standard-basic" label="Enter description" variant="standard" />
                    </Box>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="font-medium font-sans underline">Type of payment</label>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className="w-80">
                    <InputLabel id="demo-select-small-label">Select: </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        label="Type"
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        {paymentType.map((pay) => (
                        <MenuItem key={pay} value={pay}>
                            {pay}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <Stack spacing={2} direction="row">
                    <Button type="submit" variant="contained" className="w-50">
                        Submit
                    </Button>
                </Stack>
            </div>
            </form>

            <hr />

            <div className="mt-10 mb-1 font-sans">
                <h3 className="font-mono text-2xl mb-10">Recent transactions: </h3>
                <ul className="flex flex-row">
                    {transaction.length === 0 ? (
                        <p>No transactions yet </p>
                    ) : (
                        transaction.slice(-4).reverse().map((t) => (
                            <li key={t.id} className="border-1 mb-8 p-5 w-67 mr-10 rounded-lg shadow-none hover:shadow-xl hover:scale-110 transition-transform">

                                {t.type === 'income' ? (
                                    <p>
                                        <strong>Type:</strong> {t.type} <span className="text-green-600 italic"> + {t.amount}</span>
                                    </p>
                                    ) : (
                                    <p>
                                        <strong>Type:</strong> {t.type} <span className="text-red-600 italic"> - {t.amount}</span>
                                    </p>
                                )}
                                <p>
                                    <strong>Category:</strong> {t.category} - {t.subCategory}
                                </p>

                                <p>
                                    <strong>Date:</strong>{' '}
                                    {t.date && !isNaN(new Date(t.date).getTime())
                                        ? `${new Date(t.date).toLocaleDateString()}, ${new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        : 'No date available'}
                                </p>
                                {t.description && (
                                    <p>
                                        <strong>Description:</strong> {t.description}
                                    </p>
                                )}
                                {t.payment && (
                                    <p>
                                        <strong>Payment:</strong> {t.payment}
                                    </p>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <div className="mb-20">
                <Link to='/story' className="no-underline hover:underline text-blue-600 text-xl">See more...</Link>
            </div>
        </div>
    );
}