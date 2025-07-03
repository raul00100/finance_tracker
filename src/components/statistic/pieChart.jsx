import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useShared } from '../parts/shared';

export default function PieActiveArc() {
    const { transaction } = useShared();

    if (transaction.length === 0) {
        return <p>No transactions available to display on the chart.</p>;
    }

    const expenseData = transaction
    .filter((t) => t.type === 'expense')
    .reduce((acc, t)=> {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});

    const datasetExpense = Object.entries(expenseData).map(([category, amount]) => ({
        id: category,
        value: amount,
        label: category,
    }));

    const incomeData = transaction
    .filter((t)=> t.type === 'income')
    .reduce((acc, t)=> {
        acc[t.category] = (acc[t.category]|| 0) + t.amount;
        return acc;
    }, {});
    
    const daatasetIncome = Object.entries(incomeData).map(([category, amount])=> ({
        id: category,
        value: amount,
        label: category,
    }));
    
  return (
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
