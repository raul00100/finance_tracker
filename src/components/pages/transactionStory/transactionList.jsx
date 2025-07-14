import React, { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';
// import { useShared } from "../../parts/shared";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import generalStyle from "../../css/generalStyle";
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import FormSelect from "../addTransactions/categories";
import InputAdornment from '@mui/material/InputAdornment';




const labelStyle = "font-medium font-sans underline mb-1";
const spanStyle = "font-semibold";
const buttonStyle =  "text-white border-black font-bold shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 cursor-pointer border-2";
const inputBox = "flex flex-col mb-4";

const {inputStyle} = generalStyle;


export default function TransactionList({
  transactions,
  handleEdit,
  handleDelete,
  handleDeleteAll,
  editId,
  editDetails,
  setEditDetails,
  handleEditSubmit,
  expenseOption,
  incomeOption,
  financeType,
  // transactionType,
  setEditId,
}) {
  
  // const {transaction} = useShared();
   const [hovered, setHovered] = useState(null);
   const [more, setMore] = useState(null);
   const [addDescription, setAddDescription] = useState(null);
   const [addFinanceType, setAddFinanceType] = useState(null);


  const handleShowMore = (id) => {
    setMore(id);
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl font-medium underline">No transactions yet...</p>
        <AnnouncementRoundedIcon className="animate-pulse" />
      </div>
    );
  }


  return (
    <div>
        <ul>
          {transactions.slice().reverse().map((t) => (
            <li key={t.id}
            onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
              {editId === t.id ? (
                <form onSubmit={handleEditSubmit} className="mb-3 border-b-2">

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
                          value={editDetails.type}
                          label="Type"
                          onChange={(e) => setEditDetails({ ...editDetails, type: e.target.value, category: '', subCategory: '' })}
                          required
                      >
                          <MenuItem value="income">Income</MenuItem>
                          <MenuItem value="expense">Expense</MenuItem>
                      </Select>
                      </FormControl>
                  </div>

                  <div className={`${inputBox}`}>
                    <label className={`${labelStyle} mr-70`}>Amount:</label>
                      <TextField
                        type="number"
                        value={editDetails.amount}
                        onChange={(e) => setEditDetails({ ...editDetails, amount: e.target.value })}
                        // className={`${inputStyle} ml-2 w-82`}
                        required
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
                            '& .MuiInputBase-input': {
                              paddingTop: '8px',      // поднимает текст вверх
                              fontSize: '18px',     // увеличивает размер текста
                              fontWeight: 500,         // делает текст жирнее
                              marginLeft: '-12px', // сдвигает иконку максимально влево
                            },
                        }}
                        InputProps={{
                          startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              marginTop: '0px', // поднимает или опускает иконку
                              // marginLeft: '0px', // сдвигает иконку вправо/влево
                              marginBottom: 1.2,
                              marginLeft: '-16px', // сдвигает иконку максимально влево
                              // можно добавить другие параметры
                            }}
                          >
                            <AttachMoneyRoundedIcon
                              sx={{
                                fontSize: 25, // размер иконки
                                color: editDetails.type === 'income' ? '#3F7D58' : editDetails.type === 'expense' ? '#EC5228' : undefined,
                              }}
                            />
                          </InputAdornment>
                          ),
                        }}
                      />
                  </div> 

                  <div className={inputBox}>
                      <label className={labelStyle}>Category:</label>
                      <FormSelect
                      label="Category"
                      value={editDetails.category}
                      onChange={(e) => setEditDetails({ ...editDetails, category: e.target.value, subCategory: '' })}
                      options={editDetails.type === 'income' ? Object.keys(incomeOption) : Object.keys(expenseOption)}
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
                      value={editDetails.subCategory}
                      onChange={(e) => setEditDetails({ ...editDetails, subCategory: e.target.value })}
                      options={
                          editDetails.category
                          ? editDetails.type === 'income'
                              ? incomeOption[editDetails.category] || []
                              : expenseOption[editDetails.category] || []
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

                  {t.description ? (
                  <div className={inputBox}>
                    <label className={labelStyle}>Description:</label>
                    <input
                        type="text"
                        value={editDetails.description}
                        onChange={(e) => setEditDetails({...editDetails, description: e.target.value })}
                        className= {`${inputStyle} ml-2 w-82`}
                    />
                  </div>
                  ) : ( 
                  addDescription === t.id ? (
                  <div className={inputBox}>
                    <label className={labelStyle}>Description:</label>
                    <input
                        type="text"
                        value={editDetails.description}
                        onChange={(e) => setEditDetails({...editDetails, description: e.target.value })}
                        className= {`${inputStyle} ml-2 w-82`}
                    />
                  </div>
                  ) : (                     
                  <button className={`${buttonStyle} bg-[#3F7D58] active:bg-emerald-600 px-3 mb-2`} onClick={()=> setAddDescription(t.id)}>Add description</button>
                  )
                  )}

                  {t.payment ? (
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
                          value={editDetails.payment}
                          onChange={(e) => setEditDetails({ ...editDetails, payment: e.target.value })}
                      >
                          <MenuItem value="">
                          <em>None</em>
                          </MenuItem>
                          {financeType.map((pay) => (
                          <MenuItem key={pay} value={pay}>
                              {pay}
                          </MenuItem>
                          ))}
                      </Select>
                      </FormControl>
                  </div>
                  ) : ( 
                  addFinanceType === t.id ? (
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
                        value={editDetails.payment}
                        onChange={(e) => setEditDetails({ ...editDetails, payment: e.target.value })}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        {financeType.map((pay) => (
                        <MenuItem key={pay} value={pay}>
                            {pay}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                  </div>
                  ) : (                     
                  <button className={`${buttonStyle} bg-[#3F7D58] active:bg-emerald-600 px-3 mb-2`} onClick={()=> setAddFinanceType(t.id)}>Add transaction type</button>
                  )
                  )}


                <div className="mb-5 mt-5">
                  <button type="submit" className={`${buttonStyle} bg-[#3F7D58] active:bg-emerald-600 mr-4 px-3`}>Save</button>
                  <button type="button" onClick={() => setEditId(null)} className={`${buttonStyle}  bg-[#EC5228] active:bg-orange-400 px-3`}>Cancel</button>
                </div>

              </form>

              ) : (
                //default view
                <div>
                  {more === t.id ? (
                <div className="border-b-2 transition-all">
                  <div className="mt-2 flex flex-col gap-1">
                    <p > <span className={spanStyle}>Type:</span> {t.type} </p>
                    <p> <span className={spanStyle}>Amount:</span> ${t.amount} </p>
                    <p> <span className={spanStyle}> Category:</span> {t.category} </p>
                    <p> <span className={spanStyle}> Subcategory:</span> {t.subCategory} </p>
                    <p> <span className={spanStyle}> Date:</span> {new Date(t.date).toLocaleDateString()}, {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </p>
                    {t.payment ? (
                      <p> <span className={spanStyle}>Transaction type: </span> {t.payment} </p>
                    ) : null}
                    {t.description ? (
                      <p> <span className={spanStyle}>Description: </span> {t.description} </p>
                    ) : null}
                  </div>
                  <div className="mb-3 mt-3">
                    <button className={`${buttonStyle} bg-[#3F7D58] active:bg-emerald-600 mr-4 px-3 `} onClick={()=> handleEdit(t.id)}>Edit</button>
                    <button className={`${buttonStyle} bg-[#EC5228] active:bg-orange-400 px-3`} onClick={()=> setMore(null)}>Hide</button>
                  </div>
                </div>
                ) : (
                <div className="flex flex-row border-b-2 items-center mt-1">
                  <div className="mt-2 flex flex-row gap-5 flex-1">
                    <p className="mb-2.5 mt-1"> 
                      <span className={`${t.type === 'income' ? "text-[#3F7D58]" : "text-[#EC5228]"} font-medium`}>
                        <span className="relative top-0.5"> {t.type === 'income' ? '+' : '-'} </span>
                        <AttachMoneyIcon className="!ml-0 -mr-1 align-middle" /> 
                        <span className="relative top-0.5">{t.amount}</span>
                      </span>
                      <span className="underline font-medium ml-2 relative top-0.5">- {t.category} -</span>
                      <span className="font-medium relative ml-1 relative top-0.5"> on the {new Date(t.date).toLocaleDateString()}, {new Date(t.date).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit" })} </span>
                    </p>
                  </div>
                  <div className="mb-2 mr-2">
                    <button className={`${hovered === t.id ? "opacity-100" : "opacity-0"} ${buttonStyle} bg-[#3F7D58] active:bg-emerald-600 mr-4 px-3 py-0.5`}
                    onClick={()=>handleShowMore(t.id)}>Show more</button>
                    <button className={`${hovered === t.id ? "opacity-100" : "opacity-0"} ${buttonStyle} bg-[#EC5228] active:bg-orange-400 px-3 py-0.5`}
                    onClick={()=> handleDelete(t.id)}>Delete</button>
                  </div>
                </div>
                )}
                </div>
              )}
            </li>
          ))}
        </ul>
      {transactions.length === 0 ? '' : (
        <button onClick={handleDeleteAll} className={`${buttonStyle} bg-[#EC5228] hover:bg-orange-400 px-5 py-1 mt-5`}>Delete All</button>
      )}

    </div>
  );
}
