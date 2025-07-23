import * as React from "react";
import BalanceLineChart from "./lineChart";
import PieActiveArc from "./pieChart";
import MostLeast from "./mostLeat";
import generalStyle from "../../css/generalStyle";

const { indent } = generalStyle;
const label = "text-xl font-mono mb-5";

export default function Statistics() {
  return (
    <div className={indent}>
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
