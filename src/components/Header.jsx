"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch } from "react-redux";
import { initDayData, updateData } from "@/store/dayDataSlice";
import { setLatestData } from "@/store/latestDataSlice";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateColor } from "@/store/coloursSlice";

const Header = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState("nifty");
  const [isNewDate, setIsNewDate] = useState(false);
  const [latestDataTime, setLatestDataTime] = useState(null);
  const ceColorInpRef = useRef();
  const peColorInpRef = useRef();

  const theme = "dark";

  async function getLatestData(signal) {
    let url = `/api/option/${index}/latest`;
    try {
      const responce = await fetch(url, { signal });
      const responceData = await responce.json();
      if (responce.status === 200) {
        if (latestDataTime && latestDataTime !== responceData.meta.time) {
          dispatch(updateData(responceData));
        }
        dispatch(setLatestData(responceData));
      }
    } catch (error) {}
  }

  async function getDayData(signal) {
    let url = `/api/option/${index}`;

    try {
      const responce = await fetch(url, { signal });
      const responceData = await responce.json();
      if (responce.status === 200) {
        let date = new Date();
        if (date.getHours() * 60 + date.getMinutes() >= 558) {
          setIsNewDate(() => true);
        }
        setLatestDataTime(
          // TODO:: chnage putcall => meta
          responceData.meta[responceData.meta.length - 1].time
        );
        dispatch(initDayData(responceData));
      }
    } catch (error) {}
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getLatestData(signal);
    getDayData(signal);

    return () => {
      controller.abort();
    };
  }, [index]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const inervelId = setInterval(() => {
      let date = new Date();
      if (
        date.getHours() * 60 + date.getMinutes() >= 558 &&
        date.getHours() * 60 + date.getMinutes() <= 930
      ) {
        if (!isNewDate) {
          getDayData(signal);
        }
        getLatestData(signal);
      }
    }, 60000);
    return () => {
      clearInterval(inervelId);
      controller.abort();
    };
  }, [isNewDate, index]);

  useEffect(() => {
    const colors = localStorage.getItem("colors");
    if (colors) {
      dispatch(updateColor(JSON.parse(colors)));
    }

    return () => {};
  }, []);

  function handleUpdateColor() {
    let ceColor = ceColorInpRef.current.value;
    let peColor = peColorInpRef.current.value;
    localStorage.setItem(
      "colors",
      JSON.stringify({ ce: ceColor, pe: peColor })
    );
    dispatch(updateColor({ ce: ceColor, pe: peColor }));
  }

  return (
    <div className="h-12 border-b flex items-center">
      <div className="container flex justify-between items-center">
        <div className="dark:text-white text-xl font-bold">
          OPTION <span className="text-red-600">DESK</span>{" "}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={index}
            onValueChange={(v) => {
              setIndex(v);
              // setIsNewDate(false);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Index" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nifty">Nifty</SelectItem>
              <SelectItem value="banknifty">BankNifty</SelectItem>
              <SelectItem value="finnifty">FinNifty</SelectItem>
              <SelectItem value="midcapnifty">MidcapNifty</SelectItem>
            </SelectContent>
          </Select>
          <ul className="flex gap-4">
            {theme === "light" ? (
              <li
                className="cursor-pointer hover:bg-gray-400 p-2 rounded-full"
                onClick={() => changeTheme("dark")}
              >
                <Image src="/dark.svg" width={20} height={20} alt="light" />
              </li>
            ) : (
              <li
                className="cursor-pointer hover:bg-gray-400 p-2 rounded-full"
                onClick={() => changeTheme("light")}
              >
                <Image src="/light.svg" width={20} height={20} alt="dark" />
              </li>
            )}
            <li className="cursor-pointer hover:bg-gray-500/20 p-2 rounded-full">
              <Popover>
                <PopoverTrigger>
                  <Image
                    src="/settings.svg"
                    width={20}
                    height={20}
                    alt="settings"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="gird gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Colours</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the colours for the charts
                      </p>
                    </div>
                    <div className="gird gap-2">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="ce">CE</Label>
                        <Input
                          ref={ceColorInpRef}
                          type="color"
                          defaultValue="#e7515a"
                          id="ce"
                          className="h-8"
                        />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="pe">PE</Label>
                        <Input
                          ref={peColorInpRef}
                          type="color"
                          id="pe"
                          defaultValue="#2196f3"
                          className="h-8"
                        />
                      </div>
                      <Button
                        onClick={handleUpdateColor}
                        className="w-full"
                        variant="outline"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
