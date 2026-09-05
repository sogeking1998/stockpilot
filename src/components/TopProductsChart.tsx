"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function TopProductsChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Units moved",
        data: values,
        backgroundColor: ["#45684e", "#789362", "#93a77b", "#afbf99", "#c7d3b7"],
        hoverBackgroundColor: "#294f3d",
        borderRadius: 6,
        maxBarThickness: 56,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.x} units moved`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#eef1e8" },
        ticks: { color: "#9aa68e", precision: 0, font: { size: 10 } },
      },
      y: {
        border: { display: false },
        ticks: { color: "#7d8c70", font: { size: 10 }, callback: function(value) {
          const label = this.getLabelForValue(Number(value));
          return label.length > 23 ? `${label.slice(0, 21)}…` : label;
        } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-72">
      <Bar data={data} options={options} role="img" aria-label="Top products by total units moved" />
      <ul className="sr-only">{labels.map((label, index) => <li key={`${label}-${index}`}>{label}: {values[index]} units moved</li>)}</ul>
    </div>
  );
}
