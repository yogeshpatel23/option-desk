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

const StrickOiChart = () => {
  const oc = useSelector((store) => store.dayData.oc);
  const latestOc = useSelector((store) => store.latestData.oc);
  const colors = useSelector((store) => store.colors);

  const [strickOpt, setStrickOpt] = useState([]);
  const [selectedStrick, setSelectedStrick] = useState("");
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    setStrickOpt(() => latestOc.map((e) => e.strikePrice));

    return () => {};
  }, [latestOc]);

  useEffect(() => {
    if (selectedStrick == "") return;
    const strickData = oc.filter((cs) => cs.strikePrice == selectedStrick);
    setDataset(strickData);
    return () => {};
  }, [oc, selectedStrick]);

  return (
    <Card className="p-2">
      <Select
        value={selectedStrick}
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
      <div>
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
      </div>
    </Card>
  );
};

export default StrickOiChart;
