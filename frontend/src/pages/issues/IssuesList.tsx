import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import Spinner from "../../components/ui/Spinner";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";

export default function IssuesList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const showNotification = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await issuesApi.getAll({
        search: debouncedSearch,
        status,
        priority,
        page,
        limit,
      });

      setIssues(data.issues);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch issues", error);
      showNotification("Failed to load issues", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, priority]);

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, status, priority]);

  const confirmDeleteIssue = async () => {
    if (!selectedIssueId) return;

    try {
      await issuesApi.deleteIssue(selectedIssueId);
      setSelectedIssueId(null);
      showNotification("Issue deleted successfully", "success");
      fetchIssues();
    } catch (error) {
      console.error("Delete failed", error);
      showNotification("Failed to delete issue", "error");
    }
  };

  // ✅ Shared glass styles (light: blue border, dark: subtle white border)
  const glassCard =
    "rounded-2xl border bg-white/65 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm " +
    "border-blue-200/70 ring-1 ring-blue-200/60 " +
    "dark:border-white/10 dark:ring-0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Issues
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage and track all issues.
        </p>
      </div>

      {/* Filters (glassy + blue border in light) */}
      <div className={`${glassCard} p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-950/20 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table (glassy + blue border) */}
      <div className={`${glassCard} overflow-hidden`}>
        {loading ? (
          <div className="p-10">
            <Spinner />
          </div>
        ) : issues.length === 0 ? (
          <div className="p-6 text-slate-600 dark:text-slate-400 text-center">
            No issues found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm table-fixed">
                <thead className="bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                  <tr className="border-b border-blue-200/70 dark:border-white/10">
                    <th className="text-left px-4 py-3 w-[32%]">Title</th>
                    <th className="text-left px-4 py-3 w-[16%]">Created By</th>
                    <th className="text-left px-4 py-3 w-[14%]">Priority</th>
                    <th className="text-left px-4 py-3 w-[14%]">Status</th>
                    <th className="text-left px-4 py-3 w-[12%]">Created</th>
                    <th className="text-right px-4 py-3 w-[12%] min-w-[140px]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-blue-200/60 dark:divide-white/10">
                  {issues.map((issue) => (
                    <tr
                      key={issue._id}
                      className="hover:bg-blue-50/40 dark:hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        <span title={issue.title} className="clamp-2 break-words">
                          {issue.title}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300/90 font-medium">
                        {issue.createdBy?.fullName || "System"}
                      </td>

                      <td className="px-4 py-3">
                        <Badge value={issue.priority} />
                      </td>

                      <td className="px-4 py-3">
                        <Badge value={issue.status} />
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300/80 whitespace-nowrap">
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/issues/${issue._id}/edit`)}
                            className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          {issue.createdBy && (
                            typeof issue.createdBy === 'string'
                              ? issue.createdBy === user?.id
                              : issue.createdBy._id === user?.id
                          ) ? (
                            <button
                              onClick={() => setSelectedIssueId(issue._id)}
                              className="font-semibold text-rose-700 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-600 italic select-none">
                              View Only
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t border-blue-200/70 dark:border-white/10">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10"
              >
                Previous
              </button>

              <span className="text-sm text-slate-700 dark:text-slate-300">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-3 py-2 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!selectedIssueId}
        title="Delete Issue"
        onClose={() => setSelectedIssueId(null)}
        onConfirm={confirmDeleteIssue}
        confirmText="Delete"
      >
        Are you sure you want to delete this issue? This action cannot be undone.
      </Modal>

      {/* Toast */}
      <Toast message={toastMessage} type={toastType} isVisible={showToast} />
    </div>
  );
}