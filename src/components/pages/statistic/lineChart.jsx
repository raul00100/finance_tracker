import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useShared } from '../../parts/shared';

const box = "border-2 p-5";
  // for a skeleton loading animation
function GraphSkeleton() {
  return (
    <div className={box} style={{ width: '100%'}}>
      <div className="animate-pulse flex flex-col justify-end">
        {/* X-axis label */}
        <div className="h-4 bg-gray-300 rounded w-1/3 h-6 mx-auto">
        <p className='font-semibold text-center'>Not enough data to come up with statistic</p>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/5 h-6 mb-10 mt-5 mx-auto"></div>
        {/* Chart area */}
        <div className="flex-1 flex items-end">
          <div className="w-full h-110 bg-gray-200 rounded relative overflow-hidden">
            {/* Simulated line */}
            <div className="absolute left-0 bottom-20 w-full h-1/2">
              <svg width="100%" height="100%">
                <polyline
                  points="0,110 80,5 160,190 240,110 320,130 400,0 480,100 560,20 640,80 720,0 800,220 880,50 960,170 1040,100 1120,180 1200,10"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BalanceLineChart() {
  const { transaction, balance  } = useShared();

  if (transaction.length === 0) {
    return <GraphSkeleton />;
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
    <div style={{ width: '100%', height: '600px' }}>
      { transaction.length < 2 ? (
        < GraphSkeleton />
      ) : (
      <LineChart className='w-screen'
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
        height={600}
        grid={{ vertical: true, horizontal: true }}
      />
      )}
    </div>
  );
}