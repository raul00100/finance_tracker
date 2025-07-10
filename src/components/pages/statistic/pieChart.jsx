import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useShared } from '../../parts/shared';


const box = "border-2 p-5 rounded-full bg-zinc-300 animate-pulse"

export default function PieActiveArc() {

  // Simple pie skeleton
  function PieSkeleton({ label }) {
    const angles = [1, 2.5, 4];
    return (
      <svg width="350" height="350" viewBox="0 0 350 350">
        <circle cx="175" cy="175" r="175" fill="#d4d4d8" />
        {angles.map((angle, i) => {
          const r = 195;
          const cx = 175;
          const cy = 175;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#a1a1aa" strokeWidth="6" />;
        })}
        <text x="175" y="175" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold">{label}</text>
      </svg>
    );
  }
    const { transaction, allExpense, allIncome } = useShared();
    // const allExpense = transaction.length > 0 && transaction.every(t => t.type === 'expense');

    const expenseData = transaction
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const datasetExpense = Object.entries(expenseData).map(([category, amount]) => ({
      id: category,
      value: amount,
      label: category,
    }));

    const incomeData = transaction
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const daatasetIncome = Object.entries(incomeData).map(([category, amount]) => ({
      id: category,
      value: amount,
      label: category,
    }));

  // Show skeleton if no transactions
  if (transaction.length === 0) {

    return (
      <div className='flex flex-row justify-center gap-40'>
        <div className={box} style={{ minWidth: 400, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
        <div className={box} style={{ minWidth: 400, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
      </div>
    );
  }

  // Show one pie and one skeleton if all are expense or all are income
  // const allIncome = transaction.length > 0 && transaction.every(t => t.type === 'income');

  if (allExpense) {
    return (
      <div className='flex flex-row justify-center gap-40'>
        <div>
        <PieChart
          series={[
            {
              data: datasetExpense,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={400}
          width={400}
        />
        </div>
        <div className={box} style={{ minWidth: 400, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
      </div>
    );
  }

  if (allIncome) {
    return (
      <div className="flex flex-row justify-center gap-40">
        <div
          className={box} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
        <div>
          <PieChart
            series={[
              {
                data: daatasetIncome,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
            ]}
            height={395}
            width={395}
          />
        </div>
      </div>
    );
  }

  // Otherwise show both charts
  return (
    <div className='flex flex-row space-between justify-center items-center gap-0'>
      <PieChart
        series={[
          {
            data: datasetExpense,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={400}
        width={400}
      />
      <PieChart
        series={[
          {
            data: daatasetIncome,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={400}
        width={400}
      />
    </div>
  );
}
