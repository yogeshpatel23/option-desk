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
import CustomTooltip from "./CustomToolTip";
import { format } from "date-fns";

const CompairChart = ({ strick, prevStrick, nextStrick }) => {
  const oc = useSelector((store) => store.dayData.oc);
  const colors = useSelector((store) => store.colors);
  const [dataset, setDataset] = useState([]);

  const [opacity, setOpacity] = React.useState({
    [`${strick}.CE`]: false,
    [`${strick}.PE`]: false,
    [`${prevStrick}.CE`]: false,
    [`${prevStrick}.PE`]: false,
    [`${nextStrick}.PE`]: false,
    [`${nextStrick}.PE`]: false,
  });

  const handleMouseClick = (o) => {
    const { dataKey } = o;

    if (o.payload.hide) {
      setOpacity((op) => ({ ...op, [dataKey]: false }));
    } else {
      setOpacity((op) => ({ ...op, [dataKey]: true }));
    }
  };

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;

    return (
      <span
        style={{
          color,
          opacity: entry.payload.hide ? "0.5" : "1",
          fontSize: "0.75rem",
        }}
      >
        {value}
      </span>
    );
  };

  useEffect(() => {
    const strickData = oc.filter(
      (cs) =>
        cs.strikePrice == strick ||
        cs.strikePrice == prevStrick ||
        cs.strikePrice == nextStrick
    );
    let tdata = [];
    strickData.forEach((ele) => {
      let td = tdata.find((t) => t.time == ele.time);
      if (td) {
        td[ele.strikePrice] = { CE: ele.CE.cOI, PE: ele.PE.cOI };
      } else {
        tdata.push({
          time: ele.time,
          [ele.strikePrice]: { CE: ele.CE.cOI, PE: ele.PE.cOI },
        });
      }
    });
    setDataset(tdata);
    return () => {};
  }, [oc]);
  return (
    <div className="">
      <Card>
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            data={dataset}
            // syncId="anyId"
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <XAxis
              dataKey="time"
              allowDuplicatedCategory={false}
              tickFormatter={(val) =>
                format(new Date(`1970-1-1 ${val}`), "HH:mm")
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: "Chng OI",
                angle: -90,
                position: "insideLeft",
                fontSize: "12",
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
            <Legend
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={handleMouseLeave}
              onClick={handleMouseClick}
              formatter={renderColorfulLegendText}
            />
            {prevStrick && (
              <Line
                type="monotone"
                dataKey={`${prevStrick}.CE`}
                stroke={colors.ce}
                strokeDasharray="5 5"
                // strokeOpacity={opacity[`${prevStrick}.CE`]}
                hide={opacity[`${prevStrick}.CE`]}
                dot={false}
                name={`${prevStrick}-CE`}
              />
            )}
            <Line
              type="monotone"
              dataKey={`${strick}.CE`}
              stroke={colors.ce}
              // strokeOpacity={opacity[`${strick}.CE`]}
              hide={opacity[`${strick}.CE`]}
              dot={false}
              name={`${strick}-CE`}
            />
            {nextStrick && (
              <Line
                type="monotone"
                dataKey={`${nextStrick}.CE`}
                stroke={colors.ce}
                strokeDasharray="5 5"
                // strokeOpacity={opacity[`${nextStrick}.CE`]}
                hide={opacity[`${nextStrick}.CE`]}
                dot={false}
                name={`${nextStrick}-CE`}
              />
            )}
            {/* 
            //////////////////////////////////////////////////////////////////////
              PE
            /////////////////////////////////////////////////////////////////////              
            */}
            {prevStrick && (
              <Line
                type="monotone"
                dataKey={`${prevStrick}.PE`}
                stroke={colors.pe}
                strokeDasharray="5 5"
                // strokeOpacity={opacity[`${prevStrick}.PE`]}
                hide={opacity[`${prevStrick}.PE`]}
                dot={false}
                name={`${prevStrick}-PE`}
              />
            )}
            <Line
              type="monotone"
              dataKey={`${strick}.PE`}
              stroke={colors.pe}
              hide={opacity[`${strick}.PE`]}
              dot={false}
              name={`${strick}-PE`}
            />
            {nextStrick && (
              <Line
                type="monotone"
                dataKey={`${nextStrick}.PE`}
                stroke={colors.pe}
                strokeDasharray="5 5"
                // strokeOpacity={opacity[`${nextStrick}.PE`]}
                hide={opacity[`${nextStrick}.PE`]}
                dot={false}
                name={`${nextStrick}-PE`}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default CompairChart;
