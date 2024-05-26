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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomTooltip from "./CustomToolTip";
import { format } from "date-fns";
import { Button } from "./ui/button";
import CompairChart from "./CompairChart";
import CustomLegend from "./CustomLegend";

const StrickOiChart = ({ strick }) => {
  const oc = useSelector((store) => store.dayData.oc);
  const latestData = useSelector((store) => store.latestData);
  const colors = useSelector((store) => store.colors);
  const settings = useSelector((store) => store.settings);

  const strics = latestData.oc.map((e) => e.strikePrice);
  const currentStrickIndex = strics.indexOf(strick);
  const thisStrick = latestData.oc[currentStrickIndex];
  const prevStrick =
    currentStrickIndex !== 0 && latestData.oc[currentStrickIndex - 1];
  const nextStrick =
    currentStrickIndex !== strics.length - 1 &&
    latestData.oc[currentStrickIndex + 1];

  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    if (strick == "") return;
    const strickData = oc.filter((cs) => cs.strikePrice == strick);
    setDataset(strickData);
    return () => {};
  }, [oc]);

  return (
    <Card className={`p-2 ${settings.showVol ? "col-span-2" : ""}`}>
      <div className="flex items-center gap-4">
        <p className="text-xs">{strick}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="p-2 h-6 text-xs">
              Compair
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4 text-sm">
                <div>
                  <span>Compair</span>
                  <span className="text-red-500 mx-2">{strick}</span>
                  <span>With</span>
                  <span className="text-red-500 mx-2">
                    {prevStrick.strikePrice}
                  </span>
                  <span>&</span>
                  <span className="text-red-500 mx-2">
                    {nextStrick.strikePrice}
                  </span>
                </div>
              </DialogTitle>
              {/* <DialogDescription> */}
              <CompairChart
                strick={strick}
                prevStrick={prevStrick.strikePrice}
                nextStrick={nextStrick.strikePrice}
              />
              {/* </DialogDescription> */}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex">
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            data={dataset}
            syncId="anyId"
            margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
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
                value: "Chng OI",
                angle: -90,
                fontSize: 12,
                position: "insideLeft",
              }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={
                <CustomLegend
                  ceVol={thisStrick.CE.vol}
                  peVol={thisStrick.PE.vol}
                />
              }
            />
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
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: "Volume",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-US", {
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
