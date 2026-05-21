import { useEffect, useState } from "react";
import { issuesApi } from "../../api/issues.api";

/**
 * Dashboard
 * Fetches issues and calculates status counts.
 */
export default function Dashboard() {
  const [openCount, setOpenCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issuesApi.getAll();

        const issues = data.issues || data; // fallback if array directly

        // Count by status
        const open = issues.filter((i: any) => i.status === "Open").length;
        const inProgress = issues.filter((i: any) => i.status === "In Progress").length;
        const resolved = issues.filter((i: any) => i.status === "Resolved").length;

        setOpenCount(open);
        setInProgressCount(inProgress);
        setResolvedCount(resolved);
      } catch (error) {
        console.error("Failed to fetch issues", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <div className="text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-600">
          Track your issues and priorities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">Open</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            {openCount}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">In Progress</div>
          <div className="mt-2 text-2xl font-bold text-amber-600">
            {inProgressCount}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">Resolved</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            {resolvedCount}
          </div>
        </div>
      </div>
    </div>
  );
}