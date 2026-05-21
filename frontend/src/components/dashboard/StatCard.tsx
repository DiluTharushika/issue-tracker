type StatCardProps = {
  label: string;
  value: string | number;
  subText?: string;
  accent?: "blue" | "amber" | "emerald" | "violet";
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
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
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
        </div>

        <div className={`h-9 w-1.5 rounded-full ${accentMap[accent]}`} />
      </div>
    </div>
  );
}