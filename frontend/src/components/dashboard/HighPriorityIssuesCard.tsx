import { Link } from "react-router-dom";
import { FiChevronRight, FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import Card from "../ui/Card";

type Props = {
  issues: any[];
  onIssueClick?: (id: string) => void;
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

function markerColor(priority: string) {
  if (priority === "High") return "text-red-500 bg-red-50 dark:bg-red-500/10";
  if (priority === "Medium") return "text-amber-500 bg-amber-50 dark:bg-amber-500/10";
  return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
}

function badgeColor(priority: string) {
  if (priority === "High") return "text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400";
  if (priority === "Medium") return "text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400";
  return "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400";
}

function statusBadge(status: string) {
  if (status === "Open") return "text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400";
  if (status === "In Progress") return "text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400";
  return "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400";
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function HighPriorityIssuesCard({ issues, onIssueClick }: Props) {
  return (
    <Card className="p-0 h-full flex flex-col bg-transparent overflow-hidden">
      {/* Red accent glow bar at top */}
      <div className="h-[2px] bg-gradient-to-r from-red-500 via-orange-400 to-red-500 opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/* Pulsing alert icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-red-500/20 dark:bg-red-500/10 animate-ping" />
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <FiAlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              High-Priority Issues
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Requires immediate attention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Count badge */}
          {issues.length > 0 && (
            <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-bold">
              {issues.length}
            </span>
          )}
          <Link
            to="/issues"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all
          </Link>
        </div>
      </div>

      {/* Scrollable issue list with glassy scrollbar */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1 glassy-scrollbar"
      >
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              All clear!
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              No high priority issues right now.
            </div>
          </div>
        ) : (
          issues.map((issue) => (
            <motion.div
              variants={itemVariants}
              key={issue._id}
              onClick={() => onIssueClick?.(issue._id)}
              className="group flex items-start gap-3.5 p-3 rounded-xl border border-transparent hover:border-red-100 dark:hover:border-red-500/10 hover:bg-red-50/50 dark:hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
            >
              {/* Priority indicator line + icon */}
              <div className="shrink-0 mt-0.5 flex flex-col items-center gap-1">
                <div className={`p-1.5 rounded-lg ${markerColor(issue.priority).split(' ').slice(1).join(' ')}`}>
                  <FiAlertCircle
                    className={`w-4 h-4 ${markerColor(issue.priority).split(' ')[0]}`}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {/* Issue details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="truncate font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {issue.title}
                  </div>
                  <FiChevronRight className="text-slate-300 dark:text-slate-600 shrink-0 w-4 h-4 mt-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {issue.description || "Requires attention immediately based on priority settings."}
                </div>

                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${badgeColor(issue.priority)}`}>
                    {issue.priority === "High" ? "Critical" : issue.priority}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${statusBadge(issue.status || "Open")}`}>
                    {issue.status || "Open"}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    {timeAgo(issue.createdAt)}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    by {issue.createdBy?.fullName || "System"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Footer status bar */}
      {issues.length > 0 && (
        <div className="shrink-0 px-6 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[11px] font-semibold text-red-500 dark:text-red-400">
              {issues.length} issue{issues.length !== 1 ? "s" : ""} need attention
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Sorted by newest
          </span>
        </div>
      )}
    </Card>
  );
}