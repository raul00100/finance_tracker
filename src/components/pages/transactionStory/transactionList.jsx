import React, { useState } from "react";
import AnnouncementRoundedIcon from "@mui/icons-material/AnnouncementRounded";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import generalStyle from "../../css/generalStyle";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import InputAdornment from "@mui/material/InputAdornment";
import PropTypes from "prop-types";

import FormSelectGroup from "../../parts/input/FormSelectGroup";
import FormInputGroup from "../../parts/input/FormInputGroup";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const {
  buttonStyleGreen,
  buttonStyleOrange,
  noTransactions,
  inputBox,
  labelStyle,
} = generalStyle;

const spanStyle = "font-semibold";
const buttonStyleDelete =
  "text-white ml-3 border-black bg-red-600 px-3 h-11 active:bg-red-400 font-bold shadow-[4px_4px_0px_0px_#000] bg-[#EC5228] active:bg-orange-400 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 cursor-pointer border-2";
const buttonStyleAdd =
  "text-white m-2 border-black bg-zinc-400 hover:bg-[#3F7D58] active:bg-emerald-600 px-3 mb-2 font-bold shadow-[4px_4px_0px_0px_#000] bg-[#EC5228] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 cursor-pointer border-2";

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleDeleteAll: PropTypes.func.isRequired,
  editId: PropTypes.any,
  editDetails: PropTypes.object,
  setEditDetails: PropTypes.func,
  handleEditSubmit: PropTypes.func,
  expenseOption: PropTypes.object,
  incomeOption: PropTypes.object,
  financeType: PropTypes.array,
  setEditId: PropTypes.func,
};

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
  setEditId,
}) {
  const [hovered, setHovered] = useState(null);
  const [more, setMore] = useState(null);
  const [addDescription, setAddDescription] = useState(null);
  const [addFinanceType, setAddFinanceType] = useState(null);

  const handleShowMore = (id) => {
    setMore(id);
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-row">
        <p className={noTransactions}>No transactions yet...</p>
        <AnnouncementRoundedIcon className="animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <ul>
        {transactions
          .slice()
          .reverse()
          .map((t) => (
            <li
              key={t.id}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {editId === t.id ? (
                <form onSubmit={handleEditSubmit} className="mb-3 border-b-2">
                  <div className={inputBox}>
                    <label className={labelStyle}>Transaction Type:</label>
                    <FormSelectGroup
                      label="Transaction Type"
                      value={editDetails.type}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          type: e.target.value,
                          category: "",
                          subCategory: "",
                        })
                      }
                      options={["income", "expense"]}
                    />
                  </div>

                  <div className={`${inputBox}`}>
                    <label className={labelStyle}>Amount:</label>
                    <FormInputGroup
                      value={editDetails.amount}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          amount: e.target.value,
                        })
                      }
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              marginTop: "0px",
                              marginBottom: 1.2,
                              marginLeft: "-33px",
                            }}
                          >
                            <AttachMoneyRoundedIcon
                              sx={{
                                fontSize: 25,
                                color:
                                  editDetails.type === "income"
                                    ? "#3F7D58"
                                    : editDetails.type === "expense"
                                    ? "#EC5228"
                                    : undefined,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                  <div className={inputBox}>
                    <label className={labelStyle}>Category:</label>
                    <FormSelectGroup
                      value={editDetails.category}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          category: e.target.value,
                          subCategory: "",
                        })
                      }
                      options={
                        editDetails.type === "income"
                          ? Object.keys(incomeOption)
                          : Object.keys(expenseOption)
                      }
                    />
                  </div>

                  <div className={inputBox}>
                    <label className={labelStyle}>Subcategory:</label>
                    <FormSelectGroup
                      value={editDetails.subCategory}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          subCategory: e.target.value,
                        })
                      }
                      options={
                        editDetails.category
                          ? editDetails.type === "income"
                            ? incomeOption[editDetails.category] || []
                            : expenseOption[editDetails.category] || []
                          : []
                      }
                    />
                  </div>

                  <div className={inputBox}>
                    <label className={labelStyle}>Date:</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={
                          editDetails.date
                            ? dayjs(Number(editDetails.date))
                            : null
                        }
                        onChange={(newValue) => {
                          setEditDetails((prev) => ({
                            ...prev,
                            date: newValue ? newValue.valueOf() : null,
                          }));
                        }}
                        referenceDate={dayjs()}
                        required
                        slotProps={{
                          textField: {
                            variant: "standard",
                            sx: {
                              width: 327,
                              height: "44px",
                              border: "2px solid black",
                              borderRadius: 0,
                              boxShadow: "4px 4px 0px 0px #000",
                              fontSize: "1.125rem",
                              fontWeight: 500,
                              marginLeft: 1,
                              pl: 2,
                              pt: 0.5,
                              pr: 1,
                              "& .MuiInput-underline:before, & .MuiInput-underline:after":
                                {
                                  borderBottom: "none",
                                },
                              "& .Mui-focused": {
                                boxShadow: "none",
                                borderColor: "black",
                              },
                              "&:hover": {
                                boxShadow: "4px 4px 0px 0px #000",
                                borderColor: "black",
                              },
                              "& input": {
                                boxShadow: "none !important",
                                borderRadius: 0,
                                backgroundColor: "white !important",
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                  {t.description ? (
                    <div className={inputBox}>
                      <label className={labelStyle}>Description:</label>
                      <FormInputGroup
                        value={editDetails.description}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            description: e.target.value,
                          })
                        }
                        type="text"
                      />
                    </div>
                  ) : addDescription === t.id ? (
                    <div className={inputBox}>
                      <label className={labelStyle}>Description:</label>
                      <div className="flex flex-row">
                        <FormInputGroup
                          value={editDetails.description}
                          onChange={(e) =>
                            setEditDetails({
                              ...editDetails,
                              description: e.target.value,
                            })
                          }
                          type="text"
                        />
                        <button
                          className={`${buttonStyleDelete}`}
                          onClick={() => setAddDescription(null)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={buttonStyleAdd}
                      onClick={() => setAddDescription(t.id)}
                    >
                      Add description
                    </button>
                  )}

                  {t.payment ? (
                    <div className={`${inputBox} mt-2`}>
                      <label className={labelStyle}>Type of transaction</label>
                      <FormSelectGroup
                        value={editDetails.payment}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            payment: e.target.value,
                          })
                        }
                        options={financeType}
                      />
                    </div>
                  ) : addFinanceType === t.id ? (
                    <div className={`${inputBox} mt-2 `}>
                      <label className={labelStyle}>Type of transaction</label>
                      <div className="flex flex-row">
                        <FormSelectGroup
                          value={editDetails.payment}
                          onChange={(e) =>
                            setEditDetails({
                              ...editDetails,
                              payment: e.target.value,
                            })
                          }
                          options={financeType}
                        />
                        <button
                          className={`${buttonStyleDelete} ml-3`}
                          onClick={() => setAddFinanceType(null)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={buttonStyleAdd}
                      onClick={() => setAddFinanceType(t.id)}
                    >
                      Add transaction type
                    </button>
                  )}

                  <div className="mb-5 mt-8">
                    <button
                      type="submit"
                      className={`${buttonStyleGreen} mr-4 px-3`}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className={`${buttonStyleOrange} px-3`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                //default view
                <div>
                  {more === t.id ? (
                    <div className="border-b-2 transition-all">
                      <div className="mt-2 flex flex-col gap-1">
                        <p>
                          {" "}
                          <span className={spanStyle}>Type:</span> {t.type}{" "}
                        </p>
                        <p>
                          {" "}
                          <span className={spanStyle}>Amount:</span> ${t.amount}{" "}
                        </p>
                        <p>
                          {" "}
                          <span className={spanStyle}> Category:</span>{" "}
                          {t.category}{" "}
                        </p>
                        <p>
                          {" "}
                          <span className={spanStyle}> Subcategory:</span>{" "}
                          {t.subCategory}{" "}
                        </p>
                        <p>
                          {" "}
                          <span className={spanStyle}> Date:</span>{" "}
                          {new Date(t.date).toLocaleDateString()},{" "}
                          {new Date(t.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                        </p>
                        {t.payment ? (
                          <p>
                            {" "}
                            <span className={spanStyle}>
                              Transaction type:{" "}
                            </span>{" "}
                            {t.payment}{" "}
                          </p>
                        ) : null}
                        {t.description ? (
                          <p>
                            {" "}
                            <span className={spanStyle}>
                              Description:{" "}
                            </span>{" "}
                            {t.description}{" "}
                          </p>
                        ) : null}
                      </div>
                      <div className="mb-3 mt-3">
                        <button
                          className={`${buttonStyleGreen} bg-[#3F7D58] active:bg-emerald-600 mr-4 px-3 `}
                          onClick={() => handleEdit(t.id)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${buttonStyleOrange} bg-[#EC5228] active:bg-orange-400 px-3`}
                          onClick={() => setMore(null)}
                        >
                          Hide
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-row border-b-2 items-center py-1 hover:py-4 transition-all duration-300`}
                    >
                      <div className="mt-2 flex flex-row gap-5 flex-1">
                        <p className="mb-2.5 mt-1">
                          <span
                            className={`${
                              t.type === "income"
                                ? "text-[#3F7D58]"
                                : "text-[#EC5228]"
                            } font-medium`}
                          >
                            <span className="relative top-0.5">
                              {" "}
                              {t.type === "income" ? "+" : "-"}{" "}
                            </span>
                            <AttachMoneyIcon className="!ml-0 -mr-1 align-middle" />
                            <span className="relative top-0.5">{t.amount}</span>
                          </span>
                          <span className="underline font-medium ml-2 relative top-0.5">
                            - {t.category} -
                          </span>
                          <span className="font-medium relative ml-1 relative top-0.5">
                            {" "}
                            on the {new Date(t.date).toLocaleDateString()},{" "}
                            {new Date(t.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                          </span>
                        </p>
                      </div>
                      <div className="mb-2 mr-2">
                        <button
                          className={`${
                            hovered === t.id ? "opacity-100" : "opacity-0"
                          } ${buttonStyleGreen} mr-4 px-3 py-0.5`}
                          onClick={() => handleShowMore(t.id)}
                        >
                          Show more
                        </button>
                        <button
                          className={`${
                            hovered === t.id ? "opacity-100" : "opacity-0"
                          } ${buttonStyleOrange} px-3 py-0.5`}
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
      </ul>
      {transactions.length === 0 ? (
        ""
      ) : (
        <button
          onClick={handleDeleteAll}
          className={`${buttonStyleOrange} px-5 py-1 mt-5`}
        >
          Delete All
        </button>
      )}
    </div>
  );
}
