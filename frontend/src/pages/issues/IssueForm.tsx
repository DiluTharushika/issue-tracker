import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";
import Button from "../../components/ui/Button";

/**
 * IssueForm - Professional Create & Edit Form
 * Modern SaaS-style design with dark mode support
 */
export default function IssueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [status, setStatus] = useState<"Open" | "In Progress" | "Resolved">("Open");
  const [loading, setLoading] = useState(false);

  // Fetch issue data when editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchIssue = async () => {
      try {
        const data = await issuesApi.getById(id!);
        const issue = data.issue || data;

        setTitle(issue.title || "");
        setDescription(issue.description || "");
        setPriority(issue.priority || "Medium");
        setStatus(issue.status || "Open");
      } catch (error) {
        console.error("Failed to fetch issue", error);
      }
    };

    fetchIssue();
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { title, description, priority, status };

      if (isEditMode) {
        await issuesApi.updateIssue(id!, payload);
      } else {
        await issuesApi.createIssue(payload);
      }

      navigate("/issues");
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {isEditMode ? "Edit Issue" : "Create New Issue"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {isEditMode
            ? "Update the details of this issue"
            : "Fill in the details below to create a new issue"}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Issue Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="e.g. Login button not working"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-y transition-all"
              placeholder="Describe the issue in detail..."
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Open" | "In Progress" | "Resolved")}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="px-8 py-3 text-base">
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Issue"
                : "Create Issue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}