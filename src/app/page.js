import OiGraph from "@/components/OiGraph";
import StrickOiChart from "@/components/StrickOiChart";
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-2 md:p-4 grid grid-cols-3 items-start gap-2">
      <div className="col-span-3 md:col-span-1">
        <OiGraph />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 col-span-3 md:col-span-2">
        <StrickOiChart />
        <StrickOiChart />
        <StrickOiChart />
        <StrickOiChart />
      </div>
    </main>
  );
}
