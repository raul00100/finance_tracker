import React, { useState } from "react";
import { useShared } from "../../parts/shared";
import FormSelect from "./categories";
import dayjs from 'dayjs';
// import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Link } from "react-router-dom";
import '../../css/main.css'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import generalStyle from "../../css/generalStyle";
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';
// import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';




const inputBox = "flex flex-col mb-4";
const labelStyle = "font-medium font-sans underline mb-1";
const formLabel = "text-2xl font-mono mb-4";

const {inputStyle, buttonStyle} = generalStyle;

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
            setBalance(Number(balance) - numericAmount);
        }
        setType('');
        setAmount('');
        setCategory(null);
        setSubCategory(null);
        setDate(null);
        setDescription('');
        setPayment(null);
    };



    return (
        <div className="">

            {/* INPUT DIV */}
            <h2 className="text-3xl font-mono mt-8 mb-6">ADD DETAILS</h2>

            <form onSubmit={handleTransaction} className="flex flex-col mb-15">

            {/* Form Content */}
            <div className="flex flex-row justify-center gap-40 ">

                {/* General Section */}
                <div className="mb-8 ml-100">

                    <h3 className={formLabel}>General</h3>

                    <div className={inputBox}>
                        <label className={labelStyle}>Transaction Type:</label>
                        <FormControl   
                        sx={{
                            border: '2px solid black',
                            height: '44px',
                            width: 327,
                            marginLeft: 1,
                            boxShadow: '4px 4px 0px 0px #000',
                            fontSize: '1.125rem',
                            fontWeight: 500,
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                            },
                            '& .Mui-focused': {
                            boxShadow: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                            },
                        }}
                        size="small" className="w-80">
                         <InputLabel
                            id="demo-select-small-label"
                            sx={{
                            // Add top margin when label is shrunk (floating)
                            '&.MuiInputLabel-shrink': {
                                top: 1, // adjust this value for more/less gap
                            },
                            // Optionally, adjust default position too
                            top: 1,
                            background: '#f1f2f6', // optional, for better contrast
                            px: 0.5, // optional, horizontal padding
                            }}>Select: </InputLabel>
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

                    <div className={`${inputBox} relative items-center`}>
                    <label className={`${labelStyle} mr-70`}>Amount:</label>
                        <span className="absolute left-2 top-9 text-gray-500">
                            <AttachMoneyRoundedIcon
                            className={type === 'income' ? 'text-lime-600' : type === 'expense' ? 'text-rose-500' : ''}/>
                        </span>
                        <input
                            type="number"
                            value={amount}
                            onChange={e=> setAmount(e.target.value)}
                            className={`${inputStyle} ml-2 w-82 pl-4.5`}
                            required
                        />
                    </div> 

                    <div>
                        <div className={inputBox}>
                            <label className={labelStyle}>Category:</label>
                            <FormSelect
                            label="Category"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setSubCategory('');
                            }}
                            options={type === 'income' ? Object.keys(incomeOption) : Object.keys(expenseOption)}
                            sx={{
                                border: '2px solid black',
                                height: '44px',
                                width: 330,
                                marginLeft: 1,
                                boxShadow: '4px 4px 0px 0px #000',
                                fontSize: '1.125rem',
                                fontWeight: 500,
                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                },
                                '& .Mui-focused': {
                                boxShadow: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                },
                            }}
                            />
                        </div>
                        
                        <div className={inputBox}>
                            <label className={labelStyle}>Subcategory:</label>
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
                            sx={{
                                border: '2px solid black',
                                height: '44px',
                                width: 330,
                                marginLeft: 1,
                                boxShadow: '4px 4px 0px 0px #000',
                                fontSize: '1.125rem',
                                fontWeight: 500,
                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                },
                                '& .Mui-focused': {
                                boxShadow: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                },
                            }}
                            className="w-80" />
                        </div>
                    </div>

                    <div className={`${inputBox} w-80`}>
                    <label className={labelStyle}>Date:</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                       <DateTimePicker
                        value={date}
                        onChange={setDate}
                        referenceDate={dayjs(Date.now())}
                        required
                        // Use standard variant to avoid double border
                        slotProps={{
                            textField: {
                            variant: 'standard',
                            sx: {
                                width: 330,
                                height: "44px",
                                border: '2px solid black',
                                borderRadius: 0,
                                boxShadow: '4px 4px 0px 0px #000',
                                fontSize: '1.125rem',
                                fontWeight: 500,
                                marginLeft: 1,
                                pl: 2,
                                pt: 0.5,
                                pr: 1,
                                // Remove underline for standard variant
                                '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                                borderBottom: 'none',
                                },
                                // Remove focus highlight
                                '& .Mui-focused': {
                                boxShadow: 'none',
                                borderColor: 'black',
                                },
                                // Remove hover highlight
                                '&:hover': {
                                boxShadow: '4px 4px 0px 0px #000',
                                borderColor: 'black',
                                },
                                // Remove autofill background
                                '& input': {
                                boxShadow: 'none !important',
                                borderRadius: 0,
                                backgroundColor: 'white !important',
                                },
                            },
                            },
                        }}
                        />
                    </LocalizationProvider>
                    </div>

                </div>

                {/* Additional Section */}
                <div className="mb-8 mr-100">
                <h3 className={formLabel}>Additional</h3>

                <div className={inputBox}>
                    <label className={labelStyle}>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className= {`${inputStyle} ml-2 w-82`}

                    />
                </div>

                <div className={inputBox}>
                    <label className={labelStyle}>Type of transaction</label>
                    <FormControl   
                    sx={{
                        border: '2px solid black',
                        height: '44px',
                        width: 327,
                        marginLeft: 1,
                        boxShadow: '4px 4px 0px 0px #000',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                        },
                        '& .Mui-focused': {
                        boxShadow: 'none',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                        },
                    }}
                    className="w-80" size="small">
                     <InputLabel
                        id="demo-select-small-label"
                        sx={{
                        // Add top margin when label is shrunk
                        '&.MuiInputLabel-shrink': {
                            top: 1, // value for more/less gap
                        },
                        // Optionally, adjust default position too
                        top: 1,
                        background: '#f1f2f6', //for better contrast
                        px: 0.5, // horizontal padding
                    }}>Select: </InputLabel>
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

            <div className="flex justify-center mt-10">
                <button type="submit" className={`${buttonStyle} px-15 py-2`}>Submit</button>
            </div>
        </form>

        <hr />

        <div className="mt-10 mb-10 font-sans">
            <h3 className={`${formLabel} mb-10`}>Recent transactions: </h3>
            <ul className="flex flex-row">
                {transaction.length === 0 ? (
                <div className="flex flex-row">
                <p className="text-xl font-medium underline">No transactions yet...</p>
                <AnnouncementRoundedIcon className="animate-pulse"/>
                </div>
                ) : (
                    <div className="flex flex-row items-center">
                    {transaction.slice(-3).reverse().map((t) => (
                        <li key={t.id} className="mb-8 p-5 w-67 ml-5 mr-5 rounded-2xl bg-[#f1f2f6] shadow-[6px_6px_16px_#bebebe,-10px_-10px_16px_#ffffff]">

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
                    ))}
                    <div className="mb-7">
                        {/* < KeyboardTabIcon className="animate-pulse mb-2 mr-1" sx={{fontSize: 35}}/> */}
                        <KeyboardReturnIcon className="rotate-[180deg] animate-pulse mb-2 mr-1" sx={{fontSize: 37}} />
                        <Link to='/story'  className="animate-pulse text-2xl font-bold bg-gradient-to-r from-indigo-500 to-gray-900 bg-clip-text text-transparent hover:border-blue-700 hover:border-b-2 transition-all duration-50">See more...</Link>
                    </div>
                    </div>
                )}
            </ul>
        </div>
    </div>
    );
}

// менять цвент иконы в зависимости от типа транзкации ✅
// поменять дизайн сообщение no transactions yet
// сделать небольшую анимацию для полей ввода как у кнопки (пиздец как долго)
// возмодно поменять стиль самого контейнера с инфой чтобы не различался дизайн
// сделать контейнер с инфой фикисрованного размера