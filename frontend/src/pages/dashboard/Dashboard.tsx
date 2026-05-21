import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";

import { FiHash, FiCircle, FiClock, FiCheckCircle } from "react-icons/fi";

import StatCard from "../../components/dashboard/StatCard";
import StatusDonut from "../../components/dashboard/StatusDonut";
import HighPriorityIssuesCard from "../../components/dashboard/HighPriorityIssuesCard";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import IssueInsightsCard from "../../components/dashboard/IssueInsightsCard";
import AssigneeLoadCard from "../../components/dashboard/AssigneeLoadCard";

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

  const activityItems = useMemo(() => {
    const sorted = [...issues].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return sorted.slice(0, 4).map((issue) => {
      const createdAt = new Date(issue.createdAt).getTime();
      const updatedAt = new Date(issue.updatedAt).getTime();

      const action: "Created" | "Updated" =
        Math.abs(updatedAt - createdAt) < 1000 ? "Created" : "Updated";

      return {
        id: issue._id,
        title: issue.title,
        status: issue.status,
        priority: issue.priority,
        action,
        time: new Date(issue.updatedAt).toLocaleString(),
      };
    });
  }, [issues]);

  const insights = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const resolvedIssues = issues.filter((i) => i.status === "Resolved");

    const resolveHours = resolvedIssues
      .map(
        (i) =>
          (new Date(i.updatedAt).getTime() - new Date(i.createdAt).getTime()) /
          (1000 * 60 * 60)
      )
      .filter((h) => isFinite(h) && h >= 0);

    const avgResolveHours =
      resolveHours.length === 0
        ? 0
        : resolveHours.reduce((a, b) => a + b, 0) / resolveHours.length;

    const resolvedThisWeek = resolvedIssues.filter(
      (i) => new Date(i.updatedAt).getTime() >= weekAgo
    ).length;

    const highPriorityCount = issues.filter((i) => i.priority === "High").length;

    return { avgResolveHours, resolvedThisWeek, highPriorityCount };
  }, [issues]);

  const assignees = useMemo(() => {
    return [
      { name: "Alex Rivera", percent: 72 },
      { name: "Sarah L.", percent: 45 },
      { name: "Elena R.", percent: 30 },
    ];
  }, []);

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

      {/* Stats row (with icons) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Issues"
          value={counts.total}
          accent="violet"
          icon={<FiHash />}
        />
        <StatCard
          label="Open"
          value={counts.open}
          accent="blue"
          icon={<FiCircle />}
        />
        <StatCard
          label="In Progress"
          value={counts.inProgress}
          accent="amber"
          icon={<FiClock />}
        />
        <StatCard
          label="Resolved"
          value={counts.resolved}
          accent="emerald"
          icon={<FiCheckCircle />}
        />
        <StatCard
          label="Completion"
          value={`${counts.completion}%`}
          subText="Resolved rate"
          accent="violet"
          icon={<FiCheckCircle />}
        />
      </div>

      {/* Donut + High Priority */}
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

      {/* Activity + Insights + Assignee Load */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-sm text-slate-600 dark:text-slate-400">
              Loading activity…
            </div>
          ) : (
            <ActivityFeed items={activityItems} />
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-sm text-slate-600 dark:text-slate-400">
              Loading insights…
            </div>
          ) : (
            <>
              <IssueInsightsCard
                avgResolveHours={insights.avgResolveHours}
                resolvedThisWeek={insights.resolvedThisWeek}
                highPriorityCount={insights.highPriorityCount}
              />
              <AssigneeLoadCard assignees={assignees} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}