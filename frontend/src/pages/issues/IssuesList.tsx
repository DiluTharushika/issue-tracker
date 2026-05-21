import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import { useDebounce } from "../../hooks/useDebounce";

/**
 * Professional Issues List Page
 * - Debounced search
 * - Auto filters
 * - Pagination
 * - Edit
 * - Delete modal
 * - Toast notifications
 */

export default function IssuesList() {
  const navigate = useNavigate();

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

  // ✅ Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const showNotification = (
    message: string,
    type: "success" | "error"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // ✅ Fetch issues
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

  // ✅ Auto refetch when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, priority]);

  useEffect(() => {
    fetchIssues();
  }, [page, debouncedSearch, status, priority]);

  // ✅ Confirm Delete
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Issues</h1>
        <p className="text-sm text-slate-600">
          Manage and track all issues.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-60"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-slate-600">Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="p-6 text-slate-500">No issues found.</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Priority</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Created</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {issue.title}
                    </td>

                    <td className="px-4 py-3">
                      <Badge value={issue.priority} />
                    </td>

                    <td className="px-4 py-3">
                      <Badge value={issue.status} />
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-right space-x-4">
                      <button
                        onClick={() =>
                          navigate(`/issues/${issue._id}/edit`)
                        }
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setSelectedIssueId(issue._id)
                        }
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
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
        Are you sure you want to delete this issue?
        This action cannot be undone.
      </Modal>

      {/* Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
      />
    </div>
  );
}