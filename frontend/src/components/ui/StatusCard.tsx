/**
 * StatusCard Component
 * Used in Dashboard to display issue counts with dark mode support.
 */

type StatusCardProps = {
  title: string;
  count: number;
  color: string;
};

export default function StatusCard({ title, count, color }: StatusCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 transition-colors duration-300">
      <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
      <div className={`mt-2 text-2xl font-bold ${color}`}>
        {count}
      </div>
    </div>
  );
}