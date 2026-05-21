import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";

import StatCard from "../../components/dashboard/StatCard";
import StatusDonut from "../../components/dashboard/StatusDonut";
import HighPriorityIssuesCard from "../../components/dashboard/HighPriorityIssuesCard";

export default function Dashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issuesApi.getAll();
        setIssues(data.issues || data);
      } catch (e) {
        console.error(e);
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
    const total = issues.length;
    const completion = total === 0 ? 0 : Math.round((resolved / total) * 100);
    return { total, open, inProgress, resolved, completion };
  }, [issues]);

  const highPriority = useMemo(() => {
    return issues
      .filter((i) => i.priority === "High")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  }, [issues]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Track performance and issue progress.
          </p>
        </div>

        <Link
          to="/issues/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + New Issue
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Issues" value={counts.total} accent="violet" />
        <StatCard label="Open" value={counts.open} accent="blue" />
        <StatCard label="In Progress" value={counts.inProgress} accent="amber" />
        <StatCard label="Resolved" value={counts.resolved} accent="emerald" />
        <StatCard
          label="Completion"
          value={`${counts.completion}%`}
          subText="Resolved rate"
          accent="violet"
        />
      </div>

      {/* Grid like screenshot */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-sm text-slate-600 dark:text-slate-400">
              Loading distribution…
            </div>
          ) : (
            <StatusDonut
              open={counts.open}
              inProgress={counts.inProgress}
              resolved={counts.resolved}
            />
          )}
        </div>

        <div className="lg:col-span-8">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-sm text-slate-600 dark:text-slate-400">
              Loading high priority…
            </div>
          ) : (
            <HighPriorityIssuesCard issues={highPriority} />
          )}
        </div>
      </div>
    </div>
  );
}