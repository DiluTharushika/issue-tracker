import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

/**
 * Reusable button.
 * Reason: consistent look for all actions.
 */
export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";

  const styles: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return <button {...props} className={[base, styles[variant], className].join(" ")} />;
}