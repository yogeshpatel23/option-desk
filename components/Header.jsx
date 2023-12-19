"use client";

import { setLatestData } from "@/store/LatestDataSlice";
import { setTheme } from "@/store/themeSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chart as Chartjs } from "chart.js";
import { initDayData } from "@/store/DayDataSlice";

Chartjs.defaults.borderColor = "#80808030";
Chartjs.defaults.interaction.mode = "index";
Chartjs.defaults.responsive = true;

export default function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((store) => store.theme.theme);
  useEffect(() => {
    const sTheme = localStorage.getItem("theme");
    if (sTheme) {
      let ht = document.querySelector("html");
      ht.classList.remove("light", "dark");
      ht.classList.add(sTheme);
      if (sTheme === "light") {
        Chartjs.defaults.color = "#0e1726";
      } else {
        Chartjs.defaults.color = "#fff";
      }
      dispatch(setTheme(sTheme));
    }
  }, []);

  const getLatestData = async (signal) => {
    try {
      const responce = await fetch("/api/option/nifty/latest", { signal });
      const responceData = await responce.json();
      if (responce.status === 200) {
        // console.log(responceData);
        dispatch(setLatestData(responceData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDaytData = async (signal) => {
    try {
      const responce = await fetch("/api/option/nifty", { signal });
      const responceData = await responce.json();
      if (responce.status === 200) {
        console.log(responceData);
        dispatch(initDayData(responceData));
        // dispatch(setLatestData(responceData));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getLatestData(signal);
    getDaytData(signal);
    const inervelId = setInterval(() => {
      // TODO: time controll
      getLatestData(signal);
    }, 60000);
    return () => {
      clearInterval(inervelId);
      controller.abort();
      console.log("ingerval cersr");
    };
  }, []);

  const changeTheme = (mode) => {
    dispatch(setTheme(mode));
    let ht = document.querySelector("html");
    ht.classList.remove("light", "dark");
    ht.classList.add(mode);
    if (mode === "light") {
      Chartjs.defaults.color = "#0e1726";
    } else {
      Chartjs.defaults.color = "#fff";
    }
    localStorage.setItem("theme", mode);
  };

  return (
    <div className="fixed w-full shadow-md bg-white dark:bg-slate-900 dark:shadow-white/5">
      <div className="flex h-12 justify-between items-center w-11/12 m-auto py-2">
        <div className="">Option Desk</div>
        <nav>
          <ul className="flex gap-4">
            {theme === "light" ? (
              <li
                className="cursor-pointer uppercase"
                onClick={() => changeTheme("dark")}
              >
                {theme}
              </li>
            ) : (
              <li
                className="cursor-pointer uppercase"
                onClick={() => changeTheme("light")}
              >
                {theme}
              </li>
            )}
            <li>Set</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
