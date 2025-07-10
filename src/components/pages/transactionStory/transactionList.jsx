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


  const butt = " px-4 rounded text-white mt-2 mr-2";
  const labelStyle ="mr-3 font-medium";
  const spanStyle = "font-semibold";

export default function TransactionList({
  transactions,
  handleEdit,
  handleDelete,
  handleDeleteAll,
  editId,
  editDetails,
  setEditDetails,
  handleEditSubmit,
  categoryOptions,
  setEditId,
}) {
  
  // const {transaction} = useShared();
   const [hovered, setHovered] = useState(null);
   const [more, setMore] = useState(null);

  return (
    <div>
        {transactions.length === 0 ? (
        <div className="flex flex-row">
          <p className="text-xl font-medium underline">No transactions yet...</p>
          <AnnouncementRoundedIcon className="animate-pulse"/>
        </div>
        ) : ( 
          // editing mode
          transactions.slice().reverse().map((t) => (
          <ul onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
            <li key={t.id}>
              {editId === t.id ? (
                <form onSubmit={handleEditSubmit} className="mb-3">

                  <div className="">
                    <label className={labelStyle}>Transaction Type:</label>
                    <FormControl size="small" className="w-40">
                    <InputLabel id="demo-select-small-label">Select: </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={editDetails.type}
                        // label="Type"
                        onChange={(e) => setEditDetails({ ...editDetails, type: e.target.value })}
                        required
                    >
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                    </FormControl>
                </div>

                <div className="mb-2 flex flex-row mt-1">
                    <label className={`${labelStyle} mt-4`}>Amount:</label>
                    <Box
                        component="form"
                        sx={{ '& > :not(style)': { m: 1, width: 150 } }}
                        noValidate
                        autoComplete="off"
                    >
                    <TextField
                    id="standard-basic"
                    variant="standard"
                    value={editDetails.amount}
                    onChange={(e) => setEditDetails({ ...editDetails, amount: e.target.value })}
                    required
                    slotProps={{
                        input: { style: { paddingLeft: 10 } } // ← добавляет отступ слева в 10px
                    }}
                    />
                    </Box>
                </div>

                <div className="mt-5">
                    <label className={labelStyle}>Category: </label>
                    <FormControl size="small" className="w-40">
                    <InputLabel id="demo-select-small-label">Select: </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={editDetails.category}
                        // label="Type"
                        onChange={(e) => setEditDetails({ ...editDetails, category: e.target.value })}
                        required
                    >
                        {categoryOptions[editDetails.type]?.map((cat, index) => (
                        <MenuItem key={index} value={cat}>
                          {cat}
                        </MenuItem> 
                        ))}
                    </Select>
                    </FormControl>
                </div>

                  <div className="mb-3 mt-3">
                    <button type="submit" className={`${butt} bg-blue-500`}>Save</button>
                    <button type="button" onClick={() => setEditId(null)} className={`${butt} bg-red-500`}>Cancel</button>
                  </div>
                  <hr/>
                </form>
              ) : (
                //default view
                <div>
                  {more === t.id ? (
                <div className="border-b-2">
                  <div className="mt-2 flex flex-col gap-1">
                    <p > <span className={spanStyle}>Type:</span> {t.type} </p>
                    <p> <span className={spanStyle}>Amount:</span> ${t.amount} </p>
                    <p> <span className={spanStyle}> Category:</span> {t.category} - {t.subCategory} </p>
                    <p> <span className={spanStyle}> Date:</span> {new Date(t.date).toLocaleDateString()}, {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </p>
                  </div>
                  <div className="mb-3">
                    <button className={`bg-blue-600 cursor-pointer${butt}`} onClick={()=> handleEdit(t.id)}>Edit</button>
                    <button className={`bg-red-600 cursor-pointer${butt}`} onClick={()=> setMore(null)}>Cancel</button>
                  </div>
                </div>
                ) : (
                <div className="flex flex-row border-b-2 items-center">
                  <div className="mt-2 flex flex-row gap-5 flex-1">
                    {/* <p > <span className={spanStyle}>Type:</span> {t.type} </p>
                    <p> <span className={spanStyle}>Amount:</span> ${t.amount} </p>
                    <p> <span className={spanStyle}> Category:</span> {t.category} - {t.subCategory} </p>
                    <p> <span className={spanStyle}> Date:</span> {new Date(t.date).toLocaleDateString()}, {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </p> */}
                    <p className="mb-2.5"> 
                      <span className={`${t.type === 'income' ? "text-lime-600" : "text-red-600"} font-medium`}>
                        <span className="relative top-0.5"> {t.type === 'income' ? '+' : '-'} </span>
                        <AttachMoneyIcon className="!ml-0 -mr-1 align-middle" /> 
                        <span className="relative top-0.5">{t.amount}</span>
                      </span>
                      <span className="underline font-medium ml-2 relative top-0.5">- {t.category} -</span>
                      <span className="font-medium relative ml-1 relative top-0.5"> on the {new Date(t.date).toLocaleDateString()}, {new Date(t.date).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit" })} </span>
                      </p>
                  </div>
                  <div className="mb-2">
                    <button className={`${hovered === t.id ? "opacity-100" : "opacity-0" } bg-blue-600 py-0.5 transition-all duration-300 cursor-pointer ${butt}`}
                    onClick={()=> setMore(t.id)}>Show more</button>
                    <button className={`${hovered === t.id ? "opacity-100" : "opacity-0" } bg-red-600 py-0.5 transition-all duration-300 cursor-pointer ${butt}`}
                    onClick={()=> handleDelete(t.id)}>Delete</button>
                  </div>
                </div>
                )}
                </div>
              )}
            </li>
          </ul>
          ))
        )}
      {transactions.length === 0 ? '' : (
        <button onClick={handleDeleteAll} className={`bg-red-500 ${butt} py-1 px-10`}>Delete All</button>
      )}
    </div>
  );
}


//добавить изменение таких параметров как дата, описание и тип платежа (если есть)
//возможно сделать первичный показ всех данных по транзакции и потом при наведение показывать весь список

                // <div className={spanBox}>
                //   <p > <span className={spanStyle}>Type:</span> {t.type} </p>
                //   <p> <span className={spanStyle}>Amount:</span> ${t.amount} </p>
                //   <p> <span className={spanStyle}> Category:</span> {t.category} - {t.subCategory} </p>
                //   <p> <span className={spanStyle}> Date:</span> {new Date(t.date).toLocaleDateString()}, {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </p>
                //   <div className="mb-3">
                //     <button className={`bg-blue-600 ${butt}`} onClick={() => handleEdit(t.id)}>Edit</button>
                //     <button className={`bg-red-500 ${butt}`} onClick={() => handleDelete(t.id)}>Delete</button>
                //   </div>
                // </div>
