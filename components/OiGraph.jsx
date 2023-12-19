import React, { useEffect, useState } from "react";
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

Chartjs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OiGraph = () => {
  const [dataSet, setDataSet] = useState({});
  const symbolData = useSelector((store) => store.latestData);
  const theme = useSelector((store) => store.theme.theme);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index'
    },
    plugins: {
      legend: {
        labels: {
          color: theme == "light" ? "#000" : "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme == "light" ? "#000" : "#fff",
        },
        grid: {
          color: "#80808030",
          z: -100,
        },
      },
      y: {
        ticks: {
          color: theme == "light" ? "#000" : "#fff",
          callback: (v) => `${v / 1000}K`,
        },
        grid: {
          color: "#80808030",
          z: -100,
        },
      },
    },
  };

  useEffect(() => {
    const labels = [];
    const ceOi = [];
    const peOi = [];
    symbolData.oc.forEach((e) => {
      if (
        e.strikePrice > symbolData.symbol.price - 250 &&
        e.strikePrice < symbolData.symbol.price + 250
      ) {
        labels.push(e.strikePrice);
        ceOi.push(e.CE.cOI);
        peOi.push(e.PE.cOI);
      }
    });

    setDataSet(() => ({
      labels,
      z: 10,
      datasets: [
        {
          label: "CE",
          data: ceOi,
          backgroundColor: "#e7515a",
        },
        {
          label: "PE",
          data: peOi,
          backgroundColor: "#2196f3",
        },
      ],
    }));
    return () => {};
  }, [symbolData]);

  if (!("labels" in dataSet)) return <h2>Loading ...</h2>;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md">
      <Bar options={options} data={dataSet} />
    </div>
  );
};

export default OiGraph;
