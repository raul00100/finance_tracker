import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useShared } from "../../parts/shared";
import PieSkeleton from "../../parts/skeletonLoading/pieSkeleton";

const box = "border-2 p-5 rounded-full animate-pulse";

export default function PieActiveArc() {
  const { allExpense, allIncome, transaction } = useShared();

  const expenseData = transaction
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const datasetExpense = Object.entries(expenseData).map(
    ([category, amount]) => ({
      id: category,
      value: amount,
      label: category,
    })
  );

  const incomeData = transaction
    .filter((t) => t.type === "income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const daatasetIncome = Object.entries(incomeData).map(
    ([category, amount]) => ({
      id: category,
      value: amount,
      label: category,
    })
  );

  // Show skeleton if no transactions
  if (transaction.length === 0) {
    return (
      <div className="flex flex-row justify-center gap-40">
        <div
          className={box}
          style={{
            minWidth: 400,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ebeceeff",
          }}
        >
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
        <div
          className={box}
          style={{
            minWidth: 400,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ebeceeff",
          }}
        >
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
      </div>
    );
  }

  if (allExpense) {
    return (
      <div className="flex flex-row justify-center gap-40">
        <div>
          <PieChart
            series={[
              {
                data: datasetExpense,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={400}
            width={400}
          />
        </div>
        <div
          className={box}
          style={{
            minWidth: 400,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ebeceeff",
          }}
        >
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
      </div>
    );
  }

  if (allIncome) {
    return (
      <div className="flex flex-row justify-center gap-40">
        <div
          className={box}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ebeceeff",
          }}
        >
          <PieSkeleton label="Not enough data to come up with statistic" />
        </div>
        <div>
          <PieChart
            series={[
              {
                data: daatasetIncome,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={395}
            width={395}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row space-between justify-center items-center gap-0">
      <PieChart
        series={[
          {
            data: datasetExpense,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        height={400}
        width={400}
      />
      <PieChart
        series={[
          {
            data: daatasetIncome,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        height={400}
        width={400}
      />
    </div>
  );
}
