import { Link } from "react-router-dom";
import Badge from "../ui/Badge";

type Props = {
  issues: any[];
};

export default function HighPriorityIssuesCard({ issues }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          High-Priority Issues
        </div>
        <Link
          to="/issues"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {issues.length === 0 ? (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            No high priority issues.
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue._id}
              className="rounded-xl border border-slate-100 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                    {issue.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(issue.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge value={issue.priority} />
                  <Badge value={issue.status} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}