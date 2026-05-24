import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import Spinner from "../../components/ui/Spinner";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { FiDownload, FiChevronDown, FiFileText, FiDatabase } from "react-icons/fi";
import IssueDetailsModal from "../../components/ui/IssueDetailsModal";


export default function IssuesList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "";
  const priorityParam = searchParams.get("priority") || "";

  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState(statusParam);
  const [priority, setPriority] = useState(priorityParam);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [viewingIssueId, setViewingIssueId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Sync from URL to local state (e.g. when typing in topbar or clicking stat card)
  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setStatus(statusParam);
  }, [statusParam]);

  useEffect(() => {
    setPriority(priorityParam);
  }, [priorityParam]);

  // Sync from local state to URL search params
  useEffect(() => {
    const params: any = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, status, priority, setSearchParams]);


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

  useEffect(() => {
    if (!showExportDropdown) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#export-dropdown-container")) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showExportDropdown]);

  const handleExport = async (format: "csv" | "json", scope: "all" | "current") => {
    setExporting(true);
    try {
      let exportData: any[] = [];
      if (scope === "current") {
        exportData = issues;
      } else {
        const data = await issuesApi.getAll({
          search: debouncedSearch,
          status,
          priority,
          page: 1,
          limit: 10000,
        });
        exportData = data.issues || [];
      }

      if (format === "json") {
        const cleanData = exportData.map((issue) => ({
          id: issue._id,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          status: issue.status,
          createdBy: issue.createdBy?.fullName || "System",
          creatorEmail: issue.createdBy?.email || "",
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        }));

        const jsonString = JSON.stringify(cleanData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `issues_export_${scope}_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification("JSON Export downloaded successfully", "success");
      } else {
        const escapeCSV = (val: any) => {
          if (val === null || val === undefined) return "";
          let stringVal = String(val);
          stringVal = stringVal.replace(/"/g, '""');
          if (stringVal.includes(",") || stringVal.includes("\n") || stringVal.includes("\r") || stringVal.includes('"')) {
            return `"${stringVal}"`;
          }
          return stringVal;
        };

        const headers = [
          "Issue ID",
          "Title",
          "Description",
          "Priority",
          "Status",
          "Created By",
          "Creator Email",
          "Created At",
          "Updated At",
        ];

        const rows = exportData.map((issue) => [
          issue._id,
          issue.title,
          issue.description,
          issue.priority,
          issue.status,
          issue.createdBy?.fullName || "System",
          issue.createdBy?.email || "",
          issue.createdAt ? new Date(issue.createdAt).toISOString() : "",
          issue.updatedAt ? new Date(issue.updatedAt).toISOString() : "",
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map((row) => row.map(escapeCSV).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `issues_export_${scope}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification("CSV Export downloaded successfully", "success");
      }
    } catch (error) {
      console.error("Export failed", error);
      showNotification("Failed to export issues", "error");
    } finally {
      setExporting(false);
      setShowExportDropdown(false);
    }
  };


  // ✅ Shared glass styles (light: blue border, dark: subtle white border)
  const glassCard =
    "rounded-2xl border bg-white/65 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm " +
    "border-blue-200/70 ring-1 ring-blue-200/60 " +
    "dark:border-white/10 dark:ring-0";

  return (
    <div className="h-full min-h-0 overflow-y-auto glassy-scrollbar pr-2 pb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Issues
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage and track all issues.
          </p>
        </div>

        {/* Export Actions */}
        <div className="relative" id="export-dropdown-container">
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            disabled={exporting}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-blue-200/70 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/80 transition font-semibold text-sm cursor-pointer shadow-sm disabled:opacity-50"
          >
            <FiDownload className={`text-base ${exporting ? "animate-bounce" : ""}`} />
            <span>{exporting ? "Export" : "Export"}</span>
            <FiChevronDown className={`text-xs transition-transform duration-200 ${showExportDropdown ? "rotate-180" : ""}`} />
          </button>

          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-blue-200/70 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg ring-1 ring-black/5 z-50 py-1 divide-y divide-slate-100 dark:divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="py-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Export All Filtered
                </div>
                <button
                  onClick={() => handleExport("csv", "all")}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FiFileText className="text-emerald-600 dark:text-emerald-400" />
                  <span>CSV Spreadsheet</span>
                </button>
                <button
                  onClick={() => handleExport("json", "all")}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FiDatabase className="text-blue-600 dark:text-blue-400" />
                  <span>JSON File</span>
                </button>
              </div>

              <div className="py-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Export Current Page
                </div>
                <button
                  onClick={() => handleExport("csv", "current")}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FiFileText className="text-emerald-500/80" />
                  <span>CSV (Page {page})</span>
                </button>
                <button
                  onClick={() => handleExport("json", "current")}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FiDatabase className="text-blue-500/80" />
                  <span>JSON (Page {page})</span>
                </button>
              </div>
            </div>
          )}
        </div>
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
                        <span
                          onClick={() => setViewingIssueId(issue._id)}
                          title="Click to view details"
                          className="clamp-2 break-words cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
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
                        <div className="flex justify-end gap-3 whitespace-nowrap">
                          <button
                            onClick={() => setViewingIssueId(issue._id)}
                            className="font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                          >
                            View
                          </button>
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

      {/* Issue Details Modal */}
      <IssueDetailsModal
        issueId={viewingIssueId}
        isOpen={!!viewingIssueId}
        onClose={() => setViewingIssueId(null)}
        onEdit={(id) => {
          setViewingIssueId(null);
          navigate(`/issues/${id}/edit`);
        }}
      />

      {/* Toast */}
      <Toast message={toastMessage} type={toastType} isVisible={showToast} />
    </div>
  );
}