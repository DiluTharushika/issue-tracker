import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";
import StatusCard from "../../components/ui/StatusCard";
import Badge from "../../components/ui/Badge";

export default function Dashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issuesApi.getAll();
        setIssues(data.issues || data);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const counts = useMemo(() => {
    const open = issues.filter((i) => i.status === "Open").length;
    const inProgress = issues.filter((i) => i.status === "In Progress").length;
    const resolved = issues.filter((i) => i.status === "Resolved").length;
    return { open, inProgress, resolved };
  }, [issues]);

  const recentIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [issues]);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Track your issues and priorities.
          </p>
        </div>

        <Link
          to="/issues/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          + New Issue
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard title="Open" count={counts.open} color="text-blue-600" />
        <StatusCard title="In Progress" count={counts.inProgress} color="text-amber-600" />
        <StatusCard title="Resolved" count={counts.resolved} color="text-emerald-600" />
      </div>

      {/* Recent issues */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Recent Issues
          </h2>
          <Link to="/issues" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="text-sm text-slate-600 dark:text-slate-400">Loading…</div>
        ) : recentIssues.length === 0 ? (
          <div className="text-sm text-slate-600 dark:text-slate-400">No issues found.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentIssues.map((issue) => (
              <div key={issue._id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                    {issue.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(issue.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <Badge value={issue.priority} />
                  <Badge value={issue.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}