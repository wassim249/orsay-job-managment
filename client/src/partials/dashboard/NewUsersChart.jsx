import React from "react";
import { BarChart01 } from "../../charts/BarChart01";

export const NewUsersChart = ({ data }) => {
  const chartData = {
    labels: data?.dates,
    datasets: [
      {
        label: "Scanners",
        data: data?.scanners,
        backgroundColor: "#f88c6c",
        hoverBackgroundColor: "#c26b51",

        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
      // Blue bars
      {
        label: "Viewers",
        data: data?.viewers,
        backgroundColor: "#b8b8b8",
        hoverBackgroundColor: "#8c8c8c",
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">New users</h2>
      </header>

      <BarChart01 data={chartData} width={595} height={248} />
    </div>
  );
};
