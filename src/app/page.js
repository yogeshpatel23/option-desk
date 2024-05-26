"use client";
import OiGraph from "@/components/OiGraph";
import StrickOiChart from "@/components/StrickOiChart";
import { useSelector } from "react-redux";

export default function Home() {
  const settings = useSelector((store) => store.settings);
  const selectedSticks = useSelector((store) => store.selectedStricks);

  return (
    <main
      className={`p-2 md:p-4 grid items-start gap-2 ${
        settings.showOiGraph ? "grid-cols-3" : "grid-cols-2"
      }`}
    >
      {settings.showOiGraph && (
        <div className="col-span-3 md:col-span-1">
          <OiGraph />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 col-span-3 md:col-span-2">
        {selectedSticks.map((st) => (
          <StrickOiChart key={st} strick={st} />
        ))}
      </div>
    </main>
  );
}
