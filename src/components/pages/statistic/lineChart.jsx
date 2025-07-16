import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useShared } from "../../parts/shared";
import LineSkeleton from "../../parts/skeletonLoading/lineSkeleton";

export default function BalanceLineChart() {
  const { transaction, balance } = useShared();

  if (transaction.length === 0 || transaction.length < 2) {
    return <LineSkeleton />;
  }

  // Sort transactions by date
  const sortedTransactions = [...transaction].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Prepare the dataset for the line chart
  const dataset = sortedTransactions.reduce(
    (acc, t) => {
      const previousBalance = acc.length > 0 ? acc[acc.length - 1].y : 0;
      const newBalance =
        t.type === "income"
          ? previousBalance + t.amount
          : previousBalance - t.amount;

      // Use timestamps for the x-axis
      const timestamp =
        t.date && !isNaN(new Date(t.date).getTime())
          ? new Date(t.date)
          : new Date(); // Fallback to the current date if t.date is invalid

      acc.push({ x: timestamp, y: newBalance });
      return acc;
    },
    [{ x: new Date(sortedTransactions[0].date), y: balance }] // Start with the initial balance at the earliest transaction date
  );

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <LineChart
        className="w-screen"
        dataset={dataset}
        xAxis={[
          {
            dataKey: "x",
            label: "Date & Time",
            scaleType: "time", // Use a time scale for the x-axis
            valueFormatter: (timestamp) => new Date(timestamp).toLocaleString(), // Format timestamps
          },
        ]}
        series={[
          {
            dataKey: "y",
            label: "$Balance",
            scaleType: "linear",
          },
        ]}
        height={600}
        grid={{ vertical: true, horizontal: true }}
      />
    </div>
  );
}
