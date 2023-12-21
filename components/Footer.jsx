"use client";
import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const symbol = useSelector((store) => store.latestData.symbol);
  return (
    <div className="fixed bottom-0 w-full bg-slate-900 text-white">
      <div className="flex justify-between w-11/12 h-12 m-auto items-center">
        <span></span>
        <span>&copy; VY Stock</span>
        <span>Last Update On : {symbol?.time} </span>
      </div>
    </div>
  );
};

export default Footer;
