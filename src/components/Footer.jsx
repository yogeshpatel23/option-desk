"use client";
import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const meta = useSelector((store) => store.latestData.meta);
  return (
    <div className="fixed bottom-0 w-full bg-slate-900 text-white">
      <div className="flex justify-between items-center container py-1">
        <span></span>
        <span>&copy; VY Stock</span>
        <span>Last Update On : {meta?.time} </span>
      </div>
    </div>
  );
};

export default Footer;
