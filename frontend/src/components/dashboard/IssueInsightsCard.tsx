type Props = {
  avgResolveHours: number;     // average hours between createdAt and updatedAt for resolved issues
  resolvedThisWeek: number;    // resolved issues updated in last 7 days
  highPriorityCount: number;   // number of high priority issues
};

function formatHoursToText(hours: number) {
  if (!isFinite(hours) || hours <= 0) return "—";
  if (hours < 24) return `${Math.round(hours)} hrs`;
  const days = hours / 24;
  return `${days.toFixed(1)} days`;
}

export default function IssueInsightsCard({
  avgResolveHours,
  resolvedThisWeek,
  highPriorityCount,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Issue Insights
      </div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Performance snapshot
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Avg time to resolve
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatHoursToText(avgResolveHours)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Based on resolved issues
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Resolved (7 days)
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              {resolvedThisWeek}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30" />
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              High priority
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              {highPriorityCount}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30" />
        </div>
      </div>
    </div>
  );
}