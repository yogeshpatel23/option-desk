"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomToolTip";
import { format } from "date-fns";

const OiGraph = () => {
  const symbolData = useSelector((store) => store.latestData);
  const dayData = useSelector((store) => store.dayData);
  const colors = useSelector((store) => store.colors);
  const index = useSelector((store) => store.selectedIndex);
  const [dataset, setDataset] = useState([]);
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    let ue = 0;
    switch (index) {
      case "nifty":
      case "finnifty":
        ue = 50;
        setSpread(50);
        break;
      case "banknifty":
        ue = 100;
        setSpread(100);
        break;
      case "midcapnifty":
        ue = 25;
        setSpread(25);
        break;

      default:
        break;
    }
    let fData = symbolData.oc.filter(
      (sp) =>
        sp.strikePrice > symbolData.meta.price - ue * 5 &&
        sp.strikePrice < symbolData.meta.price + ue * 5
    );
    setDataset(fData.reverse());

    return () => {};
  }, [symbolData]);

  return (
    <div className="space-y-2">
      <Card>
        <ResponsiveContainer width="100%" aspect={1.2}>
          <BarChart
            data={dataset}
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <XAxis
              type="number"
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <YAxis type="category" dataKey="strikePrice" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" />
            <Bar dataKey="CE.cOI" stackId="a" name="CE" fill={colors.ce} />
            {/* <Bar dataKey="CE.OI" stackId="a" name="CE-OI" fill="#e7515a99" /> */}
            <Bar dataKey="PE.cOI" stackId="b" name="PE" fill={colors.pe} />
            {/* <Bar dataKey="PE.OI" stackId="b" name="PE-OI" fill="#2196f399" /> */}
            <ReferenceLine
              y={Math.floor(symbolData.meta.price / spread) * spread}
              label={{
                value: `LTP : ${symbolData.meta.price}`,
                position: "insideBottomRight",
              }}
              stroke="red"
              strokeDasharray="3 3"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <p>Change In OI & Price </p>
      {/* <pre>{JSON.stringify(dataset, null, 2)}</pre> */}
      <Card className="px-2">
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            data={dayData.meta}
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
              yAxisId="coi"
              label={{
                value: "Change in OI",
                angle: -90,
                position: "insideBottom",
                offset: 100,
              }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={["dataMin - 100", "dataMax + 100"]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="coi"
              type="monotone"
              dataKey="totalCEchageOI"
              stroke={colors.ce}
              dot={false}
              name="CE"
            />
            <Line
              yAxisId="coi"
              type="monotone"
              dataKey="totalPEchageOI"
              stroke={colors.pe}
              dot={false}
              name="PE"
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#fff"
              strokeDasharray="3 4 5 2"
              dot={false}
              name={index.toUpperCase()}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default OiGraph;
