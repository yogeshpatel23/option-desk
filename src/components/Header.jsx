"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { initDayData, updateData } from "@/store/dayDataSlice";
import { setLatestData } from "@/store/latestDataSlice";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateColor } from "@/store/coloursSlice";
import { setIndex } from "@/store/selectedIndexSlice";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { updateSettings } from "@/store/settingsSlice";
import Loading from "./Loading";
import StrickSelector from "./StrickSelector";
import { setStricks } from "@/store/selectedStrickSlice";

const Header = () => {
  const dispatch = useDispatch();
  const index = useSelector((store) => store.selectedIndex);
  const settings = useSelector((store) => store.settings);
  const [isNewDate, setIsNewDate] = useState(false);
  const [latestDataTime, setLatestDataTime] = useState(null);
  const [showVol, setShowVol] = useState(settings.showVol);
  const [showOiGraph, setShowOiGraph] = useState(settings.showOiGraph);
  const [isloading, setIsloading] = useState(true);
  const ceColorInpRef = useRef();
  const peColorInpRef = useRef();
  const nocInpRef = useRef();

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
        setLatestDataTime(responceData.meta[responceData.meta.length - 1].time);
        dispatch(initDayData(responceData));
      }
    } catch (error) {}
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    Promise.allSettled([getLatestData(signal), getDayData(signal)]).then(
      (v) => {
        setIsloading(false);
      }
    );

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

    const losettings = localStorage.getItem("settings");
    if (losettings) {
      let ld = JSON.parse(losettings);
      setShowOiGraph(ld.showOiGraph);
      setShowVol(ld.showVol);
      dispatch(updateSettings(ld));
    }

    return () => {};
  }, []);

  function handleUpdateColor() {
    let ceColor = ceColorInpRef.current.value;
    let peColor = peColorInpRef.current.value;
    let noc = nocInpRef.current.value;
    if (noc < 1 || noc > 5) {
      alert("No of Chart must be between 1 - 5");
      return;
    }
    localStorage.setItem(
      "colors",
      JSON.stringify({ ce: ceColor, pe: peColor })
    );
    localStorage.setItem(
      "settings",
      JSON.stringify({ showOiGraph, showVol, noc })
    );
    dispatch(updateColor({ ce: ceColor, pe: peColor }));
    dispatch(updateSettings({ showOiGraph, showVol, noc }));
  }
  if (isloading) {
    return <Loading />;
  }
  return (
    <div className="h-12 border-b flex items-center">
      <div className="container flex justify-between items-center">
        <div className="dark:text-white hidden md:block text-xl font-bold">
          OPTION <span className="text-red-600">DESK</span>{" "}
        </div>
        <div className="dark:text-white block md:hidden text-xl font-bold">
          O<span className="text-red-600">d</span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={index}
            onValueChange={(v) => {
              dispatch(setIndex(v));
              dispatch(setStricks([]));
              // setIsNewDate(false);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Index" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nifty">Nifty</SelectItem>
              <SelectItem value="banknifty">BankNifty</SelectItem>
              <SelectItem value="finnifty">FinNifty</SelectItem>
              <SelectItem value="midcapnifty">MidcapNifty</SelectItem>
              <SelectSeparator />
              <SelectItem value="sensex">Sensex</SelectItem>
              <SelectItem value="bankex">Bankex</SelectItem>
            </SelectContent>
          </Select>
          <StrickSelector />
          <ul className="flex gap-4">
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
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the colours for the charts
                    </p>
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
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">Set UI</p>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={showVol}
                          onCheckedChange={() => setShowVol((prev) => !prev)}
                          id="volume"
                        />
                        <label
                          htmlFor="volume"
                          className="text-sm font-medium opacity-70"
                        >
                          Show Volume chart
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={showOiGraph}
                          onCheckedChange={() =>
                            setShowOiGraph((prev) => !prev)
                          }
                          id="oig"
                        />
                        <label
                          htmlFor="oig"
                          className="text-sm font-medium opacity-70"
                        >
                          Show Oi Graph {showOiGraph}
                        </label>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="noc" className="text-xs col-span-2">
                          No. of ITM/OTM Chart
                        </Label>
                        <Input
                          ref={nocInpRef}
                          type="number"
                          defaultValue={settings.noc}
                          min="1"
                          max="5"
                          setp="1"
                          id="noc"
                          className="h-6 w-12 p-2 "
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleUpdateColor}
                      className="w-full"
                      variant="outline"
                    >
                      Save
                    </Button>
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
