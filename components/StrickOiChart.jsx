import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Chart as Chartjs,
  LineElement, //
  TimeScale, // x Axis $ change to time
  LinearScale, // y Axis
  PointElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

Chartjs.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Title,
  Legend
);

const StrickOiChart = () => {
  const oc = useSelector((store) => store.dayData.oc);
  const latestoc = useSelector((store) => store.latestData.oc);
  const [strickOpt, setStrickOpt] = useState([]);
  const [selectedStrick, setSelectedStrick] = useState("");
  const [datasets, setDatasets] = useState([]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        text: `COI of ${selectedStrick}`,
        display: true,
      },
      legend: {
        position: "chartArea",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          parser: (d) => new Date(`1970-1-1 ${d}`),
          unit: "hour",
          tooltipFormat: "HH:mm",
        },
      },
      y: {
        ticks: {
          callback: (v) => `${v / 1000}K`,
        },
      },
    },
    elements: {
      point: {
        pointStyle: false,
      },
    },
    parsing: {
      xAxisKey: "time",
    },
  };
  useEffect(() => {
    setStrickOpt(() => latestoc.map((e) => e.strikePrice));
    if (selectedStrick == "") return;
    const strickData = oc.filter((cs) => cs.strikePrice == selectedStrick);
    setDatasets(strickData);
    return () => {};
  }, [oc, latestoc, selectedStrick]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md">
      <div className="flex items-center gap-2">
        <label className="hidden md:block" htmlFor="strick">
          Select Strike
        </label>
        <select
          name="strick"
          id="strick"
          value={selectedStrick}
          onChange={(e) => setSelectedStrick(e.target.value)}
          className="flex-grow px-2 py-1 rounded-md outline outline-2 outline-gray-300 dark:bg-slate-700"
        >
          {strickOpt.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: datasets,
                label: "PE",
                parsing: { yAxisKey: "PE.cOI" },
                borderColor: "#2196f3",
                backgroundColor: "#2196f3",
              },
              {
                data: datasets,
                label: "CE",
                parsing: { yAxisKey: "CE.cOI" },
                borderColor: "#e7515a",
                backgroundColor: "#e7515a",
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default StrickOiChart;
