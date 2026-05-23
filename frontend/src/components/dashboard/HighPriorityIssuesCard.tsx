import { Link } from "react-router-dom";
import { FiChevronRight, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import Card from "../ui/Card";

type Props = {
  issues: any[];
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

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function HighPriorityIssuesCard({ issues }: Props) {
  return (
    <Card className="p-6 h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">High-Priority Issues</h2>
        <Link
          to="/issues"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          View all
        </Link>
      </div>

      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto mt-4 pr-2 flex flex-col gap-4"
      >
        {issues.length === 0 ? (
          <div className="py-6 text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
            No high priority issues.
          </div>
        ) : (
          issues.map((issue) => (
            <motion.div 
              variants={itemVariants}
              key={issue._id} 
              className="group flex items-start gap-4 pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0"
            >
              <div className="shrink-0 mt-0.5">
                <FiAlertCircle className={`w-5 h-5 ${markerColor(issue.priority).split(' ')[0]}`} strokeWidth={2.5} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="truncate font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                    <span className="font-bold mr-1">!</span> {issue.title}
                  </div>
                  <FiChevronRight className="text-slate-400 shrink-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                  Requires attention immediately based on priority settings.
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${badgeColor(issue.priority)}`}>
                    {issue.priority === "High" ? "Critical" : issue.priority}
                  </span>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    {timeAgo(issue.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </Card>
  );
}