import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  open: number;
  inProgress: number;
  resolved: number;
};

const ITEMS = [
  { key: "Open", color: "#2563eb" },        // blue-600
  { key: "In Progress", color: "#f59e0b" }, // amber-500
  { key: "Resolved", color: "#10b981" },    // emerald-500
] as const;

export default function StatusDonut({ open, inProgress, resolved }: Props) {
  const total = open + inProgress + resolved;

  const data = [
    { name: "Open", value: open },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Distribution
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Status breakdown
          </div>
        </div>

        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {total}
          <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
            total
          </span>
        </div>
      </div>

      {/* Chart + Center label */}
      <div className="relative mt-4 h-56">
        {total === 0 ? (
          <div className="h-full grid place-items-center text-sm text-slate-600 dark:text-slate-400">
            No data yet
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry) => {
                    const color =
                      ITEMS.find((i) => i.key === entry.name)?.color || "#94a3b8";
                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Pie>

                <Tooltip
                  formatter={(value: any, name: any) => [`${value}`, name]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(148,163,184,0.25)",
                    background: "rgba(15,23,42,0.92)",
                    color: "white",
                  }}
                  itemStyle={{ color: "white" }}
                  labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {total}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Issues
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Legend (custom) */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {ITEMS.map((item) => {
          const value =
            item.key === "Open"
              ? open
              : item.key === "In Progress"
              ? inProgress
              : resolved;

          return (
            <div
              key={item.key}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-100 dark:border-slate-700 px-2 py-2"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {item.key}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}