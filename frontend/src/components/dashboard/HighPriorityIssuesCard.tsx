import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { FiChevronRight } from "react-icons/fi";

type Props = {
  issues: any[];
};

function markerColor(priority: string) {
  if (priority === "High") return "bg-red-500";
  if (priority === "Medium") return "bg-amber-500";
  return "bg-emerald-500";
}

export default function HighPriorityIssuesCard({ issues }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            High-Priority Issues
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Items that need attention
          </div>
        </div>

        <Link
          to="/issues"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          View all <FiChevronRight />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
        {issues.length === 0 ? (
          <div className="py-6 text-sm text-slate-600 dark:text-slate-400">
            No high priority issues.
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue._id}
              className="py-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Left marker */}
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${markerColor(
                    issue.priority
                  )}`}
                />

                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                    {issue.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(issue.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge value={issue.priority} />
                <Badge value={issue.status} />
                <FiChevronRight className="text-slate-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}