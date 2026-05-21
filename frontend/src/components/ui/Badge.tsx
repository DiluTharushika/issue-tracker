/**
 * Badge Component
 * Used to display status and priority labels.
 */

type BadgeProps = {
  value: string;
};

export default function Badge({ value }: BadgeProps) {
  const colors: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Resolved: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-md font-medium ${
        colors[value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {value}
    </span>
  );
}