import React from "react";

const CustomLegend = ({ payload, ceVol, peVol }) => {
  return (
    <ul className="flex justify-center gap-4 text-xs">
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          className="flex"
          style={{ color: entry.color }}
        >
          <svg
            class="recharts-surface"
            width="14"
            height="14"
            viewBox="0 0 32 32"
            style={{
              display: "inline - block",
              verticalAlign: "middle",
              marginRight: "4px",
            }}
          >
            <title></title>
            <desc></desc>
            <path
              stroke-width="4"
              fill="none"
              stroke={entry.color}
              d="M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
              class="recharts-legend-icon"
            ></path>
          </svg>

          {entry.value}
        </li>
      ))}
      <li style={{ color: payload[0].color }}>
        CE Vol:{" "}
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
        }).format(ceVol)}
      </li>
      <li style={{ color: payload[1].color }}>
        PE Vol:{" "}
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
        }).format(peVol)}
      </li>
    </ul>
  );
};

export default CustomLegend;
