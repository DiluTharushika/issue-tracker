import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { FiHash, FiCircle, FiClock, FiCheckCircle } from "react-icons/fi";

import StatCard from "../../components/dashboard/StatCard";
import StatusDonut from "../../components/dashboard/StatusDonut";
import HighPriorityIssuesCard from "../../components/dashboard/HighPriorityIssuesCard";
import LiveTeamActivityRow from "../../components/dashboard/LiveTeamActivityRow";
import IssueDetailsModal from "../../components/ui/IssueDetailsModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingIssueId, setViewingIssueId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issuesApi.getAll({ limit: 100 });
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
    const completion =
      total === 0 ? 0 : Math.round((resolved / total) * 100);
    return { total, open, inProgress, resolved, completion };
  }, [issues]);

  const highPriority = useMemo(() => {
    return issues
      .filter((i) => i.priority === "High")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [issues]);

  const compactActivity = useMemo(() => {
    const sorted = [...issues].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return sorted.slice(0, 6).map((issue) => {
      const createdAt = new Date(issue.createdAt).getTime();
      const updatedAt = new Date(issue.updatedAt).getTime();
      const action: "Created" | "Updated" =
        Math.abs(updatedAt - createdAt) < 1000 ? "Created" : "Updated";
      return {
        id: issue._id,
        title: issue.title,
        action,
        time: new Date(issue.updatedAt).toLocaleDateString(),
        creatorName: issue.createdBy?.fullName || "System",
      };
    });
  }, [issues]);

  return (
    <motion.div
      className="h-full min-h-0 flex flex-col gap-4 relative pb-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-50 dark:bg-transparent" />
      <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/50 via-white/50 to-white dark:from-blue-500/10 dark:via-transparent dark:to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent blur-2xl" />

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-start justify-between gap-4 relative z-10"
      >
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.fullName || "Developer"} 👋
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
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 relative z-10"
      >
        <StatCard
          label="Total Issues"
          value={counts.total}
          accent="blue"
          icon={<FiHash />}
          trendText="+12% vs last mo"
          trendUp={true}
          onClick={() => navigate("/issues")}
        />
        <StatCard
          label="Open"
          value={counts.open}
          accent="red"
          icon={<FiCircle />}
          trendText="-5% vs last mo"
          trendUp={false}
          onClick={() => navigate("/issues?status=Open")}
        />
        <StatCard
          label="In Progress"
          value={counts.inProgress}
          accent="amber"
          icon={<FiClock />}
          trendText="+2% vs last mo"
          trendUp={true}
          onClick={() => navigate("/issues?status=In Progress")}
        />
        <StatCard
          label="Resolved"
          value={counts.resolved}
          accent="emerald"
          icon={<FiCheckCircle />}
          trendText="+8% vs last mo"
          trendUp={true}
          onClick={() => navigate("/issues?status=Resolved")}
        />
        <StatCard
          label="Completion Rate"
          value={`${counts.completion}%`}
          accent="solid-blue"
          onClick={() => navigate("/analytics")}
        />
      </motion.div>

      {/* Main content row — Distribution | High Priority | Live Activity */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 lg:grid-cols-12 flex-1 min-h-0 relative z-10"
      >
        {/* Distribution donut — left */}
        <div className="lg:col-span-3 min-h-0 flex flex-col">
          {loading ? (
            <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 p-5 text-sm text-slate-600 dark:text-slate-400">
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

        {/* High Priority — center */}
        <div className="lg:col-span-6 min-h-0 flex flex-col">
          {loading ? (
            <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 p-5 text-sm text-slate-600 dark:text-slate-400">
              Loading high priority…
            </div>
          ) : (
            <HighPriorityIssuesCard
              issues={highPriority}
              onIssueClick={setViewingIssueId}
            />
          )}
        </div>

        {/* Live Team Activity — right corner */}
        <div className="lg:col-span-3 min-h-0 flex flex-col">
          {loading ? (
            <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 p-5 text-sm text-slate-600 dark:text-slate-400">
              Loading activity…
            </div>
          ) : (
            <LiveTeamActivityRow
              items={compactActivity}
              onIssueClick={setViewingIssueId}
            />
          )}
        </div>
      </motion.div>

      {/* Details modal */}
      <IssueDetailsModal
        issueId={viewingIssueId}
        isOpen={!!viewingIssueId}
        onClose={() => setViewingIssueId(null)}
        onEdit={(id) => {
          setViewingIssueId(null);
          navigate(`/issues/${id}/edit`);
        }}
      />
    </motion.div>
  );
}