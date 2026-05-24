import { useEffect, useState } from "react";
import { FiX, FiCalendar, FiUser, FiClock, FiAlertCircle, FiEdit2 } from "react-icons/fi";
import { issuesApi } from "../../api/issues.api";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "./Badge";
import Spinner from "./Spinner";

type IssueDetailsModalProps = {
  issueId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
};

export default function IssueDetailsModal({
  issueId,
  isOpen,
  onClose,
  onEdit,
}: IssueDetailsModalProps) {
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && issueId) {
      const fetchIssue = async () => {
        setLoading(true);
        try {
          const data = await issuesApi.getById(issueId);
          setIssue(data.issue || data);
        } catch (error) {
          console.error("Failed to fetch issue details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIssue();
    } else {
      setIssue(null);
    }
  }, [isOpen, issueId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Issue Details</span>
                {issue && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">#{issue._id.substring(issue._id.length - 6)}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                {loading ? "Loading..." : issue?.title || "Issue Details"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto glassy-scrollbar pr-1">
            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <Spinner />
              </div>
            ) : !issue ? (
              <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                Failed to load issue details.
              </div>
            ) : (
              <>
                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Description</h3>
                  <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed">
                    {issue.description || "No description provided."}
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="bg-slate-50/40 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30 p-3 rounded-xl">
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Status</span>
                    <Badge value={issue.status} />
                  </div>

                  {/* Priority */}
                  <div className="bg-slate-50/40 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30 p-3 rounded-xl">
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Priority</span>
                    <Badge value={issue.priority} />
                  </div>
                </div>

                {/* Details list */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FiUser className="w-3.5 h-3.5 text-slate-400" />
                      Created By
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {issue.createdBy?.fullName || "System"} ({issue.createdBy?.email || "N/A"})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                      Created At
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(issue.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5 text-slate-400" />
                      Last Updated
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(issue.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!loading && issue && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(issue._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition cursor-pointer"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                  <span>Edit Issue</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
