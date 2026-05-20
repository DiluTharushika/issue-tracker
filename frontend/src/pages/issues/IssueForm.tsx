
export default function IssueForm({ mode }: { mode: "create" | "edit" }) {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold text-slate-900">
        {mode === "create" ? "Create Issue" : "Edit Issue"}
      </h1>
      <p className="text-sm text-slate-600">Form goes here.</p>
    </div>
  );
}