import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  subText?: string;
  accent?: "blue" | "amber" | "emerald" | "violet";
  icon?: ReactNode;
  trendText?: string; // e.g. "+12% vs last week"
};

const accentMap = {
  blue: "bg-blue-600",
  amber: "bg-amber-500",
  emerald: "bg-emerald-600",
  violet: "bg-violet-600",
};

export default function StatCard({
  label,
  value,
  subText,
  accent = "blue",
  icon,
  trendText,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </div>

          {subText && (
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {subText}
            </div>
          )}

          {trendText && (
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {trendText}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className={`h-9 w-1.5 rounded-full ${accentMap[accent]}`} />
          {icon && (
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-700 grid place-items-center text-slate-700 dark:text-slate-200">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}