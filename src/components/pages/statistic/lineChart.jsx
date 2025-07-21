import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useShared } from "../../parts/shared";
import LineSkeleton from "../../parts/skeletonLoading/lineSkeleton";

export default function BalanceLineChart() {
  const { transaction, balance } = useShared();

  if (transaction.length === 0) {
    // Если нет транзакций, показываем только текущий баланс
    return <LineSkeleton />;
  }

  // Сортируем транзакции по дате
  const sortedTransactions = [...transaction].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Определяем стартовый баланс (до первой транзакции)
  // Если пользователь вручную меняет баланс, предполагаем, что balance — это актуальный баланс после всех транзакций
  // Поэтому стартовый баланс = balance - сумма всех транзакций
  const totalDelta = sortedTransactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);
  const startBalance = balance - totalDelta;

  // Формируем точки для графика
  let runningBalance = startBalance;
  const dataset = [
    {
      x:
        sortedTransactions[0].date &&
        !isNaN(new Date(sortedTransactions[0].date).getTime())
          ? new Date(sortedTransactions[0].date)
          : new Date(),
      y: startBalance,
    },
    ...sortedTransactions.map((t) => {
      runningBalance =
        t.type === "income"
          ? runningBalance + t.amount
          : runningBalance - t.amount;
      const timestamp =
        t.date && !isNaN(new Date(t.date).getTime())
          ? new Date(t.date)
          : new Date();
      return { x: timestamp, y: runningBalance };
    }),
  ];

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
