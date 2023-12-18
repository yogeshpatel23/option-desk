"use client";
import OiGraph from "@/components/OiGraph";
import OptionChain from "@/components/OptionChain";
import StrickOiChart from "@/components/StrickOiChart";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Home() {
  // const theme = useSelector((store) => store.theme);
  return (
    <main className="grid md:grid-cols-3 gap-2 min-h-screen py-16 px-2 md:px-4 lg:px-8">
      <OiGraph />
      <OptionChain />
      <StrickOiChart />
      <StrickOiChart />
      <StrickOiChart />
    </main>
  );
}
