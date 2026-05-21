import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { issuesApi } from "../../api/issues.api";
import Button from "../../components/ui/Button";

/**
 * IssueForm
 * Used for both Create and Edit
 */

export default function IssueForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch issue if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchIssue = async () => {
      try {
        const data = await issuesApi.getById(id!);
        const issue = data.issue || data;

        setTitle(issue.title);
        setDescription(issue.description);
        setPriority(issue.priority);
        setStatus(issue.status);
      } catch (error) {
        console.error("Failed to fetch issue", error);
      }
    };

    fetchIssue();
  }, [id]);

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
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        {isEditMode ? "Edit Issue" : "Create Issue"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border border-slate-200 space-y-4"
      >
        <div>
          <label className="text-sm text-slate-600">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Issue"
              : "Create Issue"}
          </Button>
        </div>
      </form>
    </div>
  );
}