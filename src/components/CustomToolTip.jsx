import { Separator } from "./ui/separator";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-700 p-2 rounded-md min-w-32">
        <p className="text-md font-semibold">{label}</p>
        {/* <pre>{JSON.stringify(payload, null, 2)}</pre> */}
        <Separator className="my-1 h-[2px] bg-white" />
        {payload.map((pl, i) => (
          <div
            className="grid grid-cols-2 text-sm font-semibold"
            style={{ color: pl.color }}
            key={pl.name}
          >
            <span>~ {pl.name}</span>
            <span>
              :{" "}
              {i == 2
                ? `₹ ${pl.value}`
                : new Intl.NumberFormat("en-IN", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(pl.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
