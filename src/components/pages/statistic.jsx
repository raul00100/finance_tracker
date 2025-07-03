import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useShared } from "../parts/shared";
import BalanceLineChart from '../statistic/lineChart';
import PieActiveArc from '../statistic/pieChart';
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Statistics() {
  const [value, setValue] = React.useState(0);
const {transaction} = useShared();

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



  return (
    <div style={{marginRight: '100px'}}>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Incomes" {...a11yProps(0)} />
          <Tab label="Expenses" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {transaction.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <div>
            <div>
              <p>
                Transaction with the biggest income:
                <br />
                <strong>Amount:</strong> ${biggestIncome.amount}
                <br />
                <strong>Category:</strong> {biggestIncome.category || 'N/A'}
                <br />
                <strong>Date:</strong>{' '}
                {biggestIncome.date && !isNaN(new Date(biggestIncome.date).getTime())
                  ? `${new Date(biggestIncome.date).toLocaleDateString()}, ${new Date(biggestIncome.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'No date available'}
              </p>
            </div>
            <div>
              <p>
                Transaction with the lowest income:
                <br />
                {lowestIncome ? (
                  <>
                    <strong>Amount:</strong> ${lowestIncome.amount}
                    <br />
                    <strong>Category:</strong> {lowestIncome.category || 'N/A'}
                    <br />
                    <strong>Date:</strong>{' '}
                    {lowestIncome.date && !isNaN(new Date(lowestIncome.date).getTime())
                      ? `${new Date(lowestIncome.date).toLocaleDateString()}, ${new Date(lowestIncome.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'No date available'}
                  </>
                ) : (
                  <strong>No data available</strong>
                )}
              </p>
            </div>
          </div>
        )}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        {transaction.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <div>
            <div>
              <p>
                Transaction with the biggest expense:
                <br />
                <strong>Amount:</strong> ${biggestExpense.amount}
                <br />
                <strong>Category:</strong> {biggestExpense.category || 'N/A'}
                <br />
                <strong>Date:</strong>{' '}
                {biggestExpense.date && !isNaN(new Date(biggestExpense.date).getTime())
                  ? `${new Date(biggestExpense.date).toLocaleDateString()}, ${new Date(biggestExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'No date available'}
              </p>
            </div>
            <div>
              <p>
                Transaction with the lowest expense:
                <br />
                {lowestExpense ? (
                  <>
                    <strong>Amount:</strong> ${lowestExpense.amount}
                    <br />
                    <strong>Category:</strong> {lowestExpense.category || 'N/A'}
                    <br />
                    <strong>Date:</strong>{' '}
                    {lowestExpense.date && !isNaN(new Date(lowestExpense.date).getTime())
                      ? `${new Date(lowestExpense.date).toLocaleDateString()}, ${new Date(lowestExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'No date available'}
                  </>
                ) : (
                  <strong>No data available</strong>
                )}
              </p>
            </div>
          </div>
        )}
      </CustomTabPanel>
      <div>     
        <h2>Change of the balance over time</h2> 
        < BalanceLineChart />
      </div>
      <div style={{ marginTop: '250px' }}>
        <h2> Category of expenses/income</h2>
        < PieActiveArc />
      </div>
    </Box>
    </div>
  );
}
