"use client";

import { setTheme } from "@/store/themeSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((store) => store.theme.theme);
  useEffect(() => {
    // dispatch(initTheme(true));
    const sTheme = localStorage.getItem("theme");
    if (sTheme) {
      let ht = document.querySelector("html");
      ht.classList.remove("light", "dark");
      ht.classList.add(sTheme);
      dispatch(setTheme(sTheme));
    }
  }, []);

  const changeTheme = (mode) => {
    dispatch(setTheme(mode));
    let ht = document.querySelector("html");
    ht.classList.remove("light", "dark");
    ht.classList.add(mode);
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
