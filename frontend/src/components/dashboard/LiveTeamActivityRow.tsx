import Card from "../ui/Card";
import { motion } from "framer-motion";

type ActivityItem = {
  id: string;
  title: string;
  time: string;
  action: "Created" | "Updated";
};

type Props = {
  items: ActivityItem[];
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function getFakeUser(id: string) {
  const users = [
    { name: "Mark T.", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
    { name: "Sarah L.", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
    { name: "Elena R.", color: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400" },
    { name: "John D.", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
  ];
  let charCodeSum = 0;
  for (let i = 0; i < id.length; i++) {
    charCodeSum += id.charCodeAt(i);
  }
  return users[charCodeSum % users.length];
}

export default function LiveTeamActivityRow({ items }: Props) {
  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Live Team Activity</h2>
        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          2 developers active now
        </div>
      </div>

      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x"
      >
        {items.length === 0 ? (
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
            No activity yet.
          </div>
        ) : (
          items.map((a) => {
            const user = getFakeUser(a.id);
            const initials = user.name.split(' ').map(n=>n[0]).join('');

            return (
              <motion.div
                variants={itemVariants}
                key={a.id}
                className="group min-w-[280px] snap-start rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex gap-4 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm cursor-pointer"
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${user.color}`}>
                  {initials}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{user.name}</span> {a.action.toLowerCase()} issue <span className="font-semibold text-slate-900 dark:text-slate-100 truncate inline-block max-w-[120px] align-bottom">"{a.title}"</span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {a.time}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </Card>
  );
}