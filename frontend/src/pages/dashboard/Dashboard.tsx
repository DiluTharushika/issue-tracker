import { useEffect, useState } from "react";
import { issuesApi } from "../../api/issues.api";
import { Link } from "react-router-dom";
import StatusCard from "../../components/ui/StatusCard";
import Badge from "../../components/ui/Badge";

/**
 * Dashboard Page
 * - Shows issue status counts
 * - Shows latest 5 issues
 */
export default function Dashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issuesApi.getAll();
        const issueList = data.issues || data;
        setIssues(issueList);
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

  const openCount = issues.filter(i => i.status === "Open").length;
  const inProgressCount = issues.filter(i => i.status === "In Progress").length;
  const resolvedCount = issues.filter(i => i.status === "Resolved").length;

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-600">
          Track your issues and priorities.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatusCard title="Open" count={openCount} color="text-blue-600" />
        <StatusCard title="In Progress" count={inProgressCount} color="text-amber-600" />
        <StatusCard title="Resolved" count={resolvedCount} color="text-emerald-600" />
      </div>

      {/* Recent Issues */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Issues
          </h2>

          <Link
            to="/issues"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <p className="text-sm text-slate-500">
            No issues found.
          </p>
        ) : (
          <div className="space-y-4">
            {recentIssues.map(issue => (
              <div
                key={issue._id}
                className="flex items-center justify-between border-b pb-3 last:border-none"
              >
                <div>
                  <div className="font-medium text-slate-800">
                    {issue.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
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