"use client";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Home() {
  // const theme = useSelector((store) => store.theme);
  console.log(`home`);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Option desk</h1>
      {/* {JSON.stringify(theme)} */}
    </main>
  );
}
