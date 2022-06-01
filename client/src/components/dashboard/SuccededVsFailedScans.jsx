import React, { useContext } from "react";
import { BarChart } from "../../charts/BarChart";
import { tailwindConfig } from "../../utils/Utils";
import LANG from "../../../../i18n/lang.json";
import LangContext from "../../contexts/LangContext";

export const SuccededVsFailedScans = ({ data, className }) => {
  const [lang] = useContext(LangContext);

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: LANG['common']['succeed'][lang],
        data: data.succeded,
        borderColor: "#f88c6c",
        fill: false,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.blue[400],
      },

      {
        label: LANG['common']['failed'][lang],
        data: data.failed,
        borderColor: "black",
        fill: false,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
      },
    ],
  };

  return (
    <div
      className={`flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 ${className}`}
    >
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <h2 className="font-semibold text-slate-800">
          {LANG['home']['Succeded scans vs failed scans (over time)'][lang]}
        </h2>
      </header>
      <BarChart data={chartData} width={595} height={248} />
    </div>
  );
};
