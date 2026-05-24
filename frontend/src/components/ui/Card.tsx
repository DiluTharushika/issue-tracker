import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "", ...props }: Props) {
  return (
    <motion.div
      className={[
        "relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50",
        "bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl",
        "shadow-[0_8px_30px_rgba(59,130,246,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        "transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
        "hover:border-slate-300 dark:hover:border-slate-600/80",
        className,
      ].join(" ")}
      {...props}
    >
      {/* Subtle top glare effect for 3D feel */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
      {children}
    </motion.div>
  );
}