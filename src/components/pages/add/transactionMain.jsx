import React, { useState } from "react";
import { useShared } from "../../parts/shared";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Link } from "react-router-dom";
import "../../css/main.css";
import generalStyle from "../../css/generalStyle";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import AnnouncementRoundedIcon from "@mui/icons-material/AnnouncementRounded";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { expenseOption, incomeOption, financeType } from "../../parts/options";
import FormSelectGroup from "../../parts/input/FormSelectGroup";
import FormInputGroup from "../../parts/input/FormInputGroup";

const formLabel = "text-3xl font-mono mb-7";
const rowType = "flex flex-row";

const { buttonStyleGreen, noTransactions, inputBox, labelStyle, indent } =
  generalStyle;

export default function Transaction() {
  const { balance, updateBalance, updateTransactions, transaction } =
    useShared();
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [payment, setPayment] = useState("");

  const handleTransaction = (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: numericAmount,
      category,
      subCategory,
      date,
      payment,
      description,
    };

    updateTransactions([...transaction, newTransaction]);

    if (type === "income") {
      updateBalance(Number(balance) + numericAmount);
    } else {
      updateBalance(Number(balance) - numericAmount);
    }

    setType("");
    setAmount("");
    setCategory(null);
    setSubCategory(null);
    setDate(null);
    setDescription("");
    setPayment(null);
  };

  return (
    <div className={indent}>
      <form onSubmit={handleTransaction} className={`${inputBox} mb-15`}>
        <div className={`${rowType} justify-center gap-40 `}>
          <div className="mb-8 ml-100">
            <h3 className={formLabel}>General</h3>

            <div className={inputBox}>
              <label className={labelStyle}>Transaction Type:</label>
              <FormSelectGroup
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={["income", "expense"]}
                required
              />
            </div>

            <div className={`${inputBox} relative items-center`}>
              <label className={`${labelStyle} mr-70`}>Amount:</label>
              <span className="absolute left-2.5 top-9 text-gray-500">
                <AttachMoneyRoundedIcon
                  sx={{ fontSize: 28 }}
                  className={
                    type === "income"
                      ? "text-green-700"
                      : type === "expense"
                      ? "text-red-600"
                      : ""
                  }
                />
              </span>
              <FormInputGroup
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                required
              />
            </div>

            <div className={inputBox}>
              <label className={labelStyle}>Category:</label>
              <FormSelectGroup
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory("");
                }}
                options={
                  type === "income"
                    ? Object.keys(incomeOption)
                    : Object.keys(expenseOption)
                }
                required
              />
            </div>

            <div className={inputBox}>
              <label className={labelStyle}>Subcategory:</label>
              <FormSelectGroup
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                options={
                  category
                    ? type === "income"
                      ? incomeOption[category] || []
                      : expenseOption[category] || []
                    : []
                }
                required
              />
            </div>

            <div className={`${inputBox} w-80`}>
              <label className={labelStyle}>Date:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={date}
                  onChange={setDate}
                  referenceDate={dayjs(Date.now())}
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
                          { borderBottom: "none" },
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
          </div>

          {/* Additional Section */}
          <div className="mb-8 mr-100">
            <h3 className={formLabel}>Additional</h3>

            <div className={inputBox}>
              <label className={labelStyle}>Description:</label>
              <FormInputGroup
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
              />
            </div>

            <div className={inputBox}>
              <label className={labelStyle}>Type of finance</label>
              <FormSelectGroup
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                options={financeType}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`${buttonStyleGreen} px-20 py-2 bg-[#3F7D58] active:bg-emerald-600`}
          >
            Submit
          </button>
        </div>
      </form>

      <hr />

      <div className="mt-10 mb-10 font-sans">
        <h3 className={`${formLabel} mb-10`}>Recent transactions: </h3>
        <ul className={rowType}>
          {transaction.length === 0 ? (
            <div className={rowType}>
              <p className={noTransactions}>No transactions yet...</p>
              <AnnouncementRoundedIcon className="animate-pulse" />
            </div>
          ) : (
            <div className={`${rowType} items-center`}>
              {transaction
                .slice(-3)
                .reverse()
                .map((t) => (
                  <li
                    key={t.id}
                    className={`border-2 border-black mb-8 p-5 w-75 h-33 ml-5 mr-5 font-mono shadow-[6px_6px_0px_black] hover:shadow-[8px_8px_0px_black]
                        hover:-translate-x-1 hover:-transalte-y-1 transition-all duration-300 ${
                          t.type === "income"
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-red-50 hover:bg-red-100"
                        }`}
                  >
                    {t.type === "income" ? (
                      <p>
                        <strong>Type:</strong> {t.type}{" "}
                        <span className="text-green-700 font-sans">
                          {" "}
                          + {t.amount}{" "}
                        </span>{" "}
                      </p>
                    ) : (
                      <p>
                        {" "}
                        <strong>Type:</strong> {t.type}{" "}
                        <span className="text-red-600 font-sans">
                          {" "}
                          - {t.amount}
                        </span>{" "}
                      </p>
                    )}
                    <p>
                      {" "}
                      <strong>Category:</strong> {t.category}{" "}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {t.date && !isNaN(new Date(t.date).getTime())
                        ? `${new Date(t.date).toLocaleDateString()}, ${new Date(
                            t.date
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "No date available"}
                    </p>
                    {t.payment && (
                      <p>
                        {" "}
                        <strong>Payment:</strong> {t.payment}{" "}
                      </p>
                    )}
                  </li>
                ))}
              <div className="mb-7">
                <KeyboardReturnIcon
                  className="rotate-[180deg] animate-pulse mb-2 mr-1"
                  sx={{ fontSize: 37 }}
                />
                <Link
                  to="/story"
                  className="animate-pulse text-2xl font-bold font-mono text-zinc-800 text-transparent hover:border-lime-700 hover:border-b-2 "
                >
                  See more...
                </Link>
              </div>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
