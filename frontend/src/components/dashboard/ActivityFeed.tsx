import Badge from "../ui/Badge";

type ActivityItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
  time: string;
  action: "Created" | "Updated";
};

type Props = {
  items: ActivityItem[];
};

/**
 * ActivityFeed
 * Shows recent activity based on issues (created/updated).
 */
export default function ActivityFeed({ items }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Live Team Activity
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Latest updates
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            No activity yet.
          </div>
        ) : (
          items.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 dark:border-slate-700 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      a.action === "Created"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {a.action}
                  </span>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {a.time}
                  </span>
                </div>

                <div className="mt-2 truncate font-medium text-slate-900 dark:text-slate-100">
                  {a.title}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge value={a.priority} />
                <Badge value={a.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}