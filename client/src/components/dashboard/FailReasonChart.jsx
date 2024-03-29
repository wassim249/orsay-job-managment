import React, { useContext, useEffect, useState } from "react";
import { BarChart03 } from "../../charts/BarChart03";
import { generateColors } from "../../utils/Utils";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";

export const FailReasonChart = ({ data ,className }) => {
  const [lang] = useContext(LangContext);

  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    const colors = generateColors(data?.reasons.length);
    setChartData({
      labels: ["Reasons"],
      datasets: data.reasons.map((reason, index) => ({
        label: reason.reason,
        data: [reason.count],
        backgroundColor: colors[index].primary,
        hoverBackgroundColor: colors[index].dark,
        barPercentage: 1,
        categoryPercentage: 1,
      })),
    });
  }, []);

  return (
    <div className={`col-span-full xl:col-span-6 bg-white shadow-lg rounded-lg border border-slate-200 ${className}`}>
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">
          {LANG["home"]["Reason for Failed scans"][lang]}
        </h2>
      </header>

      <div className="grow">
        {chartData && <BarChart03 data={chartData} width={595} height={48} />}
      </div>
    </div>
  );
};
