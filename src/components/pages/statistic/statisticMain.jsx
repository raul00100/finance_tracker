import * as React from "react";
import BalanceLineChart from "./lineChart";
import PieActiveArc from "./pieChart";
import MostLeast from "./mostLeat";

const label = "text-xl italic mb-5";

export default function Statistics() {
  return (
    <div className="mb-20 mr-15 mt-5">
      <MostLeast />
      <div className="flex flex-col">
        <div>
          <h2 className={`${label} mt-10`}>Change of the balance over time</h2>
          <BalanceLineChart />
        </div>
        <div className="mt-20">
          <h2 className={label}> Category of expenses/income</h2>
          <PieActiveArc />
        </div>
      </div>
    </div>
  );
}
