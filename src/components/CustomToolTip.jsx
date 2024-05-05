const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-700 p-2 rounded-md">
        <p className="text-lg font-semibold">{label}</p>
        {payload.map((pl) => (
          <p className="text-sm" key={pl.name}>
            {pl.name} : {pl.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
