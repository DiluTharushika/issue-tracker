/**
 * Badge Component
 * Consistent size + Professional colors for Priority and Status
 */

type BadgeProps = {
  value: string;
};

export default function Badge({ value }: BadgeProps) {
  const getStyles = (val: string) => {
    switch (val.toLowerCase()) {
      // Priority
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "low":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";

      // Status
      case "open":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "in progress":
        return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
      case "resolved":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-lg min-w-[85px] text-center transition-colors ${getStyles(
        value
      )}`}
    >
      {value}
    </span>
  );
}