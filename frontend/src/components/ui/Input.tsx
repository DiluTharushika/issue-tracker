import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};


export default function Input({ label, error, className = "", ...props }: Props) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 transition-colors">
          {label}
        </label>
      )}
      <input
        {...props}
        className={[
          "w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white transition-all duration-200",
          "border-slate-200/80 dark:border-slate-800/80 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20",
          error ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20" : "",
          className,
        ].join(" ")}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}