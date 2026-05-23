import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../ui/Card";

type Props = {
  open: number;
  inProgress: number;
  resolved: number;
};

const ITEMS = [
  { key: "Resolved", color: "#2563eb" }, // Blue
  { key: "Open", color: "#ef4444" }, // Red
  { key: "In Progress", color: "#f59e0b" }, // Amber
] as const;

export default function StatusDonut({ open, inProgress, resolved }: Props) {
  const total = open + inProgress + resolved;

  const data = [
    { name: "Resolved", value: resolved },
    { name: "Open", value: open },
    { name: "In Progress", value: inProgress },
  ];

  return (
    <Card className="p-6 h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Distribution</h2>
      </div>

      <div className="relative mt-2 h-[200px] w-full shrink-0">
        {total === 0 ? (
          <div className="h-full grid place-items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            No data yet
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                  {data.map((entry) => {
                    const color =
                      ITEMS.find((i) => i.key === entry.name)?.color || "#94a3b8";
                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value}`, name]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontWeight: 500 }}
                  cursor={{ fill: 'transparent' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Issues
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {ITEMS.map((item) => {
          const value =
            item.key === "Open" ? open : item.key === "In Progress" ? inProgress : resolved;
          const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

          return (
            <div key={item.key} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {item.key}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}