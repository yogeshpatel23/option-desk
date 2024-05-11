"use client";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CustomTooltip from "./CustomToolTip";
import { format } from "date-fns";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const StrickOiChart = ({ itm }) => {
  const oc = useSelector((store) => store.dayData.oc);
  const latestData = useSelector((store) => store.latestData);
  const index = useSelector((store) => store.selectedIndex);
  const colors = useSelector((store) => store.colors);
  const settings = useSelector((store) => store.settings);

  const [strickOpt, setStrickOpt] = useState([]);
  const [selectedStrick, setSelectedStrick] = useState("");
  const [dataset, setDataset] = useState([]);
  const [autoStrick, setAutoStrick] = useState(true);

  useEffect(() => {
    setStrickOpt(() => latestData.oc.map((e) => e.strikePrice));
    if (autoStrick) {
      let ltp = latestData.meta.price;
      let spread = 0;
      switch (index) {
        case "nifty":
        case "finnifty":
          spread = 50;
          break;
        case "banknifty":
          spread = 100;
          break;
        case "midcapnifty":
          spread = 25;
          break;

        default:
          break;
      }
      setSelectedStrick(Math.floor(ltp / spread) * spread + itm * spread);
    }
    return () => {};
  }, [latestData]);

  useEffect(() => {
    if (selectedStrick == "") return;
    const strickData = oc.filter((cs) => cs.strikePrice == selectedStrick);
    setDataset(strickData);
    return () => {};
  }, [oc, selectedStrick]);

  return (
    <Card className={`p-2 ${settings.showVol ? "col-span-2" : ""}`}>
      <div className="flex gap-2 items-center">
        <Select
          value={selectedStrick}
          disabled={autoStrick}
          onValueChange={(v) => {
            setSelectedStrick(v);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Strick" />
          </SelectTrigger>
          <SelectContent>
            {strickOpt.map((so) => (
              <SelectItem key={so} value={so}>
                {so}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Checkbox
          checked={autoStrick}
          onCheckedChange={() => setAutoStrick((prev) => !prev)}
          id={`autostrick${itm}`}
        />
        <Label htmlFor={`autostrick${itm}`}>Auto Select</Label>
      </div>
      <div className="flex">
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            data={dataset}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <XAxis
              dataKey="time"
              tickFormatter={(val) =>
                format(new Date(`1970-1-1 ${val}`), "HH:mm")
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: "Change in OI",
                angle: -90,
                position: "insideLeft",
              }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="CE.cOI"
              stroke={colors.ce}
              dot={false}
              name="CE"
            />
            <Line
              type="monotone"
              dataKey="PE.cOI"
              stroke={colors.pe}
              dot={false}
              name="PE"
            />
          </LineChart>
        </ResponsiveContainer>
        {settings.showVol && (
          <ResponsiveContainer width="100%" aspect={2}>
            <LineChart
              data={dataset}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <XAxis
                dataKey="time"
                tickFormatter={(val) =>
                  format(new Date(`1970-1-1 ${val}`), "HH:mm")
                }
              />
              <YAxis
                label={{
                  value: "Volume",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-IN", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="CE.vol"
                stroke={colors.ce}
                dot={false}
                name="CE"
              />
              <Line
                type="monotone"
                dataKey="PE.vol"
                stroke={colors.pe}
                dot={false}
                name="PE"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default StrickOiChart;
