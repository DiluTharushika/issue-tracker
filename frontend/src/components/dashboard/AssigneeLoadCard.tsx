type Assignee = {
  name: string;
  percent: number; // 0 - 100
};

function initials(name: string) {
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-pink-600",
];

export default function AssigneeLoadCard({
  assignees,
}: {
  assignees: Assignee[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Assignee Load
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Team capacity
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {assignees.map((a, idx) => (
          <div key={a.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`h-8 w-8 rounded-full text-white grid place-items-center text-xs font-bold ${
                    AVATAR_COLORS[idx % AVATAR_COLORS.length]
                  }`}
                >
                  {initials(a.name)}
                </div>
                <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {a.name}
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {a.percent}%
              </div>
            </div>

            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${Math.min(100, Math.max(0, a.percent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}