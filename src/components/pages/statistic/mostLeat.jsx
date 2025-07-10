import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useShared } from "../../parts/shared";

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const box = "border-3 p-3 w-[360px]";

function GraphSkeleton() {
  return (
    <div className={box}>
      <div className="animate-pulse flex flex-col space-y-4">
        <div className="w-[219px] mb-1 font-semibold"> 
            <p>No transactions yet, add one</p>
        </div>
        <div className="h-2 bg-gray-300 rounded w-1/3 mb-2 mt-1"></div>
        <div className="h-2 bg-gray-300 rounded w-1/3 mb-2 mt-1"></div>
        <div className="h-2 bg-gray-300 rounded w-1/2 mb-2 mt-1 mb-4"></div>
        <div className="border-b-3"></div>
        <div className="h-3 bg-gray-300 rounded w-[200px] mt-1"></div>
        <div className="h-2 bg-gray-300 rounded w-1/3 mt-1"></div>
      </div>
    </div>
  );
}

const text = 'font-semibold';
const header = 'font-semibold underline mb-2'
const spanBox = 'mb-2 border-b-2 w-75';
const textStyle = "mb-1.5"

export default function MostLeast() {
  const [value, setValue] = React.useState(0);
  const {transaction, allExpense, allIncome} = useShared();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const incomeTransactions = transaction.filter((t) => t.type === 'income');
  const expenseTransactions = transaction.filter((t) => t.type === 'expense');
  
  const biggestIncome = incomeTransactions.reduce((max, t) => (t.amount > max.amount ? t : max), { amount: 0 });
  const lowestIncome =
    incomeTransactions.length > 1
      ? incomeTransactions.reduce((min, t) => (t.amount < min.amount ? t : min), { amount: Infinity })
      : ''; // Set to null if there is only one income transaction
  
  const biggestExpense = expenseTransactions.reduce((max, t) => (t.amount > max.amount ? t : max), { amount: 0 });
  const lowestExpense =
    expenseTransactions.length > 1
      ? expenseTransactions.reduce((min, t) => (t.amount < min.amount ? t : min), { amount: Infinity })
      : ''; // Set to null if there is only one expense transaction


if (transaction.length === 0) {
  return (
    <Box sx={{ width: '100%' }}>
         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
         sx={{
            '& .MuiTab-root': {
              fontWeight: 600, // Make all tab labels thicker
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#6366f1', // Tailwind indigo-500 hex
              fontWeight: 700, // Even bolder for selected tab
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6366f1', // indicator color
            },
          }} className='mt-5'>
          <Tab label="Incomes" {...a11yProps(0)} />
          <Tab label="Expenses" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GraphSkeleton />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GraphSkeleton />
      </CustomTabPanel>
    </Box>
  );
}
if (allExpense) {
  return (
    <Box sx={{ width: '100%' }}>
         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Incomes" {...a11yProps(0)} />
          <Tab label="Expenses" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GraphSkeleton />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div>
          <div className={spanBox}>
            <p className={header}>Transaction with the biggest expense:</p>
            <p className={textStyle}> <span className={text}>Amount: </span>$ {biggestExpense.amount}</p>
            <p className={textStyle}> <span className={text}>Category: </span> {biggestExpense.category || 'N/A'}</p>
            <p className="mb-2"> <span className={text}>Date: </span>{' '}
              {biggestExpense.date && !isNaN(new Date(biggestExpense.date).getTime())
                ? `${new Date(biggestExpense.date).toLocaleDateString()}, ${new Date(biggestExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'No date available'}
            </p>
          </div>
          <div>
            <p className={header}>Transaction with the lowest expense:</p>
            {lowestExpense ? (
              <div>
                <p className={textStyle}> <span className={text}>Amount: </span> ${lowestExpense.amount}</p>
                <p className={textStyle}> <span className={text}>Category: </span> {lowestExpense.category || 'N/A'}</p>
                <p className={textStyle}> <span className={text}>Date: </span>{' '}
                  {lowestExpense.date && !isNaN(new Date(lowestExpense.date).getTime())
                    ? `${new Date(lowestExpense.date).toLocaleDateString()}, ${new Date(lowestExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'No date available'}
                </p>
              </div>
            ) : (
              <strong>No data available</strong>
            )}
          </div>
        </div>
      </CustomTabPanel>
    </Box>
  );
}
if (allIncome) {
  return (
    <Box sx={{ width: '100%' }}>
         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Incomes" {...a11yProps(0)} />
          <Tab label="Expenses" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div>
          <div className={spanBox}>
            <p className={header}>Transaction with the biggest income:</p>
            <p className={textStyle}> <span className={text}>Amount: </span>$ {biggestIncome.amount}</p>
            <p className={textStyle}> <span className={text}>Category: </span> {biggestIncome.category}</p>
            <p className='mb-2'> <span className={text}>Date: </span> {' '}
              {biggestIncome.date && !isNaN(new Date(biggestIncome.date).getTime())
                ? `${new Date(biggestIncome.date).toLocaleDateString()}, ${new Date(biggestIncome.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'No date available'} </p>
          </div>
          <div>
            <p className={header}>Transaction with the lowest income:</p>
            {lowestIncome ? (
              <div>
                <p className={textStyle}> <span className={text}> Amount: </span> ${lowestIncome.amount}</p>
                <p className={textStyle}> <span className={text}>Category: </span> {lowestIncome.category}</p>
                <p className={textStyle}> <span className={text}>Date: </span>{' '}
                  {lowestIncome.date && !isNaN(new Date(lowestIncome.date).getTime())
                    ? `${new Date(lowestIncome.date).toLocaleDateString()}, ${new Date(lowestIncome.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'No date available'} </p>
              </div>
            ) : (
              <strong>No data available</strong>
            )}
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GraphSkeleton />
      </CustomTabPanel>
    </Box>
  );
}

  return (
    <div className='mb-20 mr-15'>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Incomes" {...a11yProps(0)} />
          <Tab label="Expenses" {...a11yProps(1)} />
        </Tabs>
      </Box>

    {/* INCOME PART */}
      <CustomTabPanel value={value} index={0}>
          <div>
            <div className={spanBox}>
              <p className={header}>Transaction with the biggest income:</p>
              <p className={textStyle}> <span className={text}>Amount: </span>$ {biggestIncome.amount}</p>
              <p className={textStyle}> <span className={text}>Category: </span> {biggestIncome.category}</p> 
              <p className='mb-2'> <span className={text}>Date: </span> {' '}
              {biggestIncome.date && !isNaN(new Date(biggestIncome.date).getTime())
                ? `${new Date(biggestIncome.date).toLocaleDateString()}, ${new Date(biggestIncome.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'No date available'} </p>
            </div>

            <div>
                <p className={header}>Transaction with the lowest income:</p>
                {lowestIncome ? (
                  <div>
                    <p className={textStyle}> <span className={text}> Amount: </span> ${lowestIncome.amount}</p> 
                    <p className={textStyle}> <span className={text}>Category: </span> {lowestIncome.category}</p>
                    <p className={textStyle}> <span className={text}>Date: </span>{' '}
                    {lowestIncome.date && !isNaN(new Date(lowestIncome.date).getTime())
                      ? `${new Date(lowestIncome.date).toLocaleDateString()}, ${new Date(lowestIncome.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'No date available'} </p>
                  </div>
                ) : (
                  <strong>No data available</strong>
                )}
            </div>
          </div>
      </CustomTabPanel>

      {/* EXPENSE PART  */}

      <CustomTabPanel value={value} index={1}>
          <div>
            <div className={spanBox}>
              <p className={header}>Transaction with the biggest expense:</p>
              <p className={textStyle}> <span className={text}>Amount: </span>$ {biggestExpense.amount}</p>
              <p className={textStyle}> <span className={text}>Category: </span> {biggestExpense.category || 'N/A'}</p>
              <p className="mb-2"> <span className={text}>Date: </span>{' '}
                {biggestExpense.date && !isNaN(new Date(biggestExpense.date).getTime())
                  ? `${new Date(biggestExpense.date).toLocaleDateString()}, ${new Date(biggestExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'No date available'}
              </p>
            </div>
            <div>
              <p className={header}>Transaction with the lowest expense:</p>
              {lowestExpense ? (
                <div>
                  <p className={textStyle}> <span className={text}>Amount: </span> ${lowestExpense.amount}</p>
                  <p className={textStyle}> <span className={text}>Category: </span> {lowestExpense.category || 'N/A'}</p>
                  <p className={textStyle}> <span className={text}>Date: </span>{' '}
                    {lowestExpense.date && !isNaN(new Date(lowestExpense.date).getTime())
                      ? `${new Date(lowestExpense.date).toLocaleDateString()}, ${new Date(lowestExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'No date available'}
                  </p>
                </div>
              ) : (
                <strong>No data available</strong>
              )}
            </div>
          </div>
      </CustomTabPanel>

    </Box>
    </div>
  );
}