import React, { useContext } from "react";
import { BarChart01 } from "../../charts/BarChart01";
import LangContext from "../../contexts/LangContext";
import LANG from "../../../../i18n/lang.json";

export const NewUsersChart = ({ data }) => {
  const [lang] = useContext(LangContext);

  const chartData = {
    labels: data?.dates,
    datasets: [
      {
        label: `${LANG["common"]["roles"]["scanner"][lang]}s`,
        data: data?.scanners,
        backgroundColor: "#6366f1",
        hoverBackgroundColor: "#312e81",

        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
      // Blue bars
      {
        label: `${LANG["common"]["roles"]["viewer"][lang]}s`,
        data: data?.viewers,
        backgroundColor: "#fb7185",
        hoverBackgroundColor: "#e11d48",
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">
          {LANG["home"]["New users"][lang]}
        </h2>
      </header>

      <BarChart01 data={chartData} width={595} height={248} />
    </div>
  );
};
