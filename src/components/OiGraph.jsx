"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomToolTip";

const OiGraph = () => {
  const symbolData = useSelector((store) => store.latestData);
  const colors = useSelector((store) => store.colors);
  const [dataset, setDataset] = useState([]);
  const [metadata, setMetadata] = useState([]);
  useEffect(() => {
    let fData = symbolData.oc.filter(
      (sp) =>
        sp.strikePrice > symbolData.meta.price - 250 &&
        sp.strikePrice < symbolData.meta.price + 250
    );
    setDataset(fData.reverse());
    setMetadata([
      {
        name: "CE",
        cecoi: symbolData.meta.totalCEOI,
        pecoi: symbolData.meta.totalPEOI,
      },
      // { name: "PE", },
    ]);
    return () => {};
  }, [symbolData]);

  return (
    <div className="space-y-2">
      <Card>
        <ResponsiveContainer width="100%" aspect={1.2}>
          <BarChart
            //   width={500}
            //   height={300}
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
            <Bar dataKey="CE.cOI" stackId="a" name="CE-COI" fill={colors.ce} />
            {/* <Bar dataKey="CE.OI" stackId="a" name="CE-OI" fill="#e7515a99" /> */}
            <Bar dataKey="PE.cOI" stackId="b" name="PE-COI" fill={colors.pe} />
            {/* <Bar dataKey="PE.OI" stackId="b" name="PE-OI" fill="#2196f399" /> */}
            <ReferenceLine
              y={Math.floor(symbolData.meta.price / 50) * 50}
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
      <p>Total Change In OI </p>
      <Card className="px-2">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart
            data={metadata}
            layout="vertical"
            desc="Total Chaneg in OI"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
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
            <YAxis width={10} type="category" dataKey="1" />
            <Tooltip content={<CustomTooltip />} />
            <Legend align="center" verticalAlign="top" />
            <Bar dataKey="cecoi" name="CE" stackId="a" fill={colors.ce} />

            <Bar dataKey="pecoi" name="PE" stackId="b" fill={colors.pe} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default OiGraph;
