import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../ui/Card";

type ActivityItem = {
  id: string;
  title: string;
  time: string;
  action: "Created" | "Updated";
  creatorName?: string;
};

type Props = {
  items: ActivityItem[];
  onIssueClick?: (id: string) => void;
};

type ChatMessage = ActivityItem & {
  key: string;
  timestamp: number;
};

function getUserAvatarStyle(id: string) {
  const styles = [
    {
      color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      status: "online" as const,
    },
    {
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      status: "online" as const,
    },
    {
      color: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
      status: "away" as const,
    },
    {
      color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      status: "online" as const,
    },
  ];

  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return styles[sum % styles.length];
}

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.12 } },
};

export default function LiveTeamActivityRow({ items, onIssueClick }: Props) {
  const [feed, setFeed] = useState<ChatMessage[]>([]);
  const [paused, setPaused] = useState(false);

  const feedRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);

  const MAX_MESSAGES = 7;

  useEffect(() => {
    if (!items || items.length === 0) {
      setFeed([]);
      return;
    }

    const seedCount = Math.min(4, items.length);
    const seeded: ChatMessage[] = items.slice(0, seedCount).map((it, i) => ({
      ...it,
      key: `seed-${it.id}-${i}`,
      timestamp: Date.now() - (seedCount - i) * 1500,
    }));

    setFeed(seeded);
    indexRef.current = seedCount % items.length;
  }, [items]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const t = setInterval(() => {
      if (paused) return;

      const next = items[indexRef.current % items.length];
      indexRef.current = (indexRef.current + 1) % items.length;

      const msg: ChatMessage = {
        ...next,
        key: `live-${next.id}-${Date.now()}`,
        timestamp: Date.now(),
      };

      setFeed((prev) => {
        const updated = [...prev, msg];
        return updated.length > MAX_MESSAGES
          ? updated.slice(updated.length - MAX_MESSAGES)
          : updated;
      });
    }, 2000);

    return () => clearInterval(t);
  }, [items, paused]);

  useEffect(() => {
    if (paused) return;
    const el = feedRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [feed, paused]);

  const activeCount = items?.length ?? 0;

  return (
    <Card className="p-0 bg-transparent border border-slate-200/40 dark:border-slate-700/50 flex flex-col overflow-hidden rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Live Team Activity
          </h2>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            LIVE
          </span>
        </div>

        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {activeCount} active
        </div>
      </div>

      {/* Feed */}
      <div
        ref={feedRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="glassy-scrollbar flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-1.5"
      >
        {feed.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400 px-1 py-2">
            No activity yet.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {feed.map((msg) => {
              const userStyle = getUserAvatarStyle(msg.id);
              const name = msg.creatorName || "System";
              const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <motion.div
                  key={msg.key}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  onClick={() => onIssueClick?.(msg.id)}
                  className="flex items-start gap-2 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="relative shrink-0 mt-0.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${userStyle.color}`}
                    >
                      {initials}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
                        userStyle.status === "online"
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {name}
                      </span>

                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          msg.action === "Created"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                        }`}
                      >
                        {msg.action}
                      </span>

                      <span className="ml-auto text-[9px] text-slate-400 dark:text-slate-600">
                        {msg.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                      issue: <span className="font-medium">"{msg.title}"</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>{paused ? "Paused" : "Streaming live..."}</span>
        <span>{feed.length} updates</span>
      </div>
    </Card>
  );
}