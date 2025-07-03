import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useShared } from '../parts/shared';

export default function BalanceLineChart() {
  const { transaction, balance  } = useShared();

  if (transaction.length === 0) {
    return <p>No transactions available to display on the chart.</p>;
  }

  // Sort transactions by date
  const sortedTransactions = [...transaction].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Prepare the dataset for the line chart
  const dataset = sortedTransactions.reduce((acc, t) => {
    const previousBalance = acc.length > 0 ? acc[acc.length - 1].y : 0;
    const newBalance =
      t.type === 'income'
        ? previousBalance + t.amount
        : previousBalance - t.amount ;

    // Use timestamps for the x-axis
    const timestamp = t.date && !isNaN(new Date(t.date).getTime()) 
        ? new Date(t.date) 
        : new Date(); // Fallback to the current date if t.date is invalid

    acc.push({ x: timestamp, y: newBalance });
    return acc;
  }, 
  [{ x: new Date(sortedTransactions[0].date), y: balance }], // Start with the initial balance at the earliest transaction date
  );
  // // Debugging logs
  // console.log('Transaction array:', transaction);
  // console.log('Sorted Transactions:', sortedTransactions);
  // console.log('Dataset for chart:', dataset);
  
  return (
    <div style={{ width: '1100px', height: '300px' }}>
      { transaction.length < 4 ? (
        <p>Not enough information to come up with statistic..</p>
      ) : (
      <LineChart
        dataset={dataset}
        xAxis={[
          {
            dataKey: 'x',
            label: 'Date & Time',
            scaleType: 'time', // Use a time scale for the x-axis
            valueFormatter: (timestamp) => new Date(timestamp).toLocaleString(), // Format timestamps
          },
        ]}
        series={[
          {
            dataKey: 'y',
            label: '$Balance',
            scaleType: 'linear',
          },
        ]}
        height={500}
        grid={{ vertical: true, horizontal: true }}
      />
      )}
    </div>
  );
}