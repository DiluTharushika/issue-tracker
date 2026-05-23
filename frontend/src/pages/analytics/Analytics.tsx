import { useEffect, useMemo, useState } from "react";
import { issuesApi } from "../../api/issues.api";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiBarChart2,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiRefreshCw,
  FiInbox,
  FiCheck,
  FiPercent,
  FiZap,
} from "react-icons/fi";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

type TimeframeOption = "7d" | "30d" | "90d" | "all";

export default function Analytics() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeOption>("30d");

  const fetchIssues = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const data = await issuesApi.getAll();
      setIssues(data.issues || data || []);
    } catch (e) {
      console.error("Failed to fetch analytics data", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // 1. Filter issues based on Timeframe preset
  const filteredIssues = useMemo(() => {
    if (timeframe === "all") return issues;
    const now = new Date();
    const cutoff = new Date();

    if (timeframe === "7d") cutoff.setDate(now.getDate() - 7);
    else if (timeframe === "30d") cutoff.setDate(now.getDate() - 30);
    else if (timeframe === "90d") cutoff.setDate(now.getDate() - 90);

    return issues.filter((issue) => new Date(issue.createdAt) >= cutoff);
  }, [issues, timeframe]);

  // 2. Perform Dynamic Calculations
  const metrics = useMemo(() => {
    const total = filteredIssues.length;
    const resolved = filteredIssues.filter((i) => i.status === "Resolved").length;
    const open = filteredIssues.filter((i) => i.status === "Open").length;
    const inProgress = filteredIssues.filter((i) => i.status === "In Progress").length;
    const unresolved = open + inProgress;

    // Resolution Rate
    const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100);

    // Average Resolution Time (in Hours/Days)
    const resolvedIssues = filteredIssues.filter(
      (i) => i.status === "Resolved" && i.createdAt && i.updatedAt
    );
    let avgResolutionTimeStr = "N/A";
    let avgResolutionDays = 0;

    if (resolvedIssues.length > 0) {
      const totalMs = resolvedIssues.reduce((sum, issue) => {
        const duration =
          new Date(issue.updatedAt).getTime() - new Date(issue.createdAt).getTime();
        return sum + Math.max(0, duration);
      }, 0);
      const avgMs = totalMs / resolvedIssues.length;
      const avgHours = avgMs / (1000 * 60 * 60);

      avgResolutionDays = avgHours / 24;
      if (avgHours < 24) {
        avgResolutionTimeStr = `${avgHours.toFixed(1)} hrs`;
      } else {
        avgResolutionTimeStr = `${avgResolutionDays.toFixed(1)} days`;
      }
    }

    // Critical Backlog Burden (% of unresolved issues that are High Priority)
    const highPriorityUnresolved = filteredIssues.filter(
      (i) => i.status !== "Resolved" && i.priority === "High"
    ).length;
    const criticalBurdenRate =
      unresolved === 0 ? 0 : Math.round((highPriorityUnresolved / unresolved) * 100);

    return {
      total,
      resolved,
      open,
      inProgress,
      unresolved,
      resolutionRate,
      avgResolutionTimeStr,
      avgResolutionDays,
      criticalBurdenRate,
      highPriorityUnresolved,
    };
  }, [filteredIssues]);

  // 3. Generate contiguous trend data for Area Chart
  const trendData = useMemo(() => {
    const daysToGenerate =
      timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 15;
    const result: { date: string; created: number; resolved: number }[] = [];

    // Fallback if all time selected
    if (timeframe === "all") {
      const dateMap: { [key: string]: { created: number; resolved: number } } = {};
      
      issues.forEach((issue) => {
        const cDate = new Date(issue.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        dateMap[cDate] = dateMap[cDate] || { created: 0, resolved: 0 };
        dateMap[cDate].created += 1;

        if (issue.status === "Resolved" && issue.updatedAt) {
          const rDate = new Date(issue.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          dateMap[rDate] = dateMap[rDate] || { created: 0, resolved: 0 };
          dateMap[rDate].resolved += 1;
        }
      });

      const sorted = Object.entries(dateMap)
        .map(([date, val]) => ({
          date,
          created: val.created,
          resolved: val.resolved,
        }));
      return sorted.slice(-15); // limit to last 15 active days
    }

    // Contiguous sequence generation
    const now = new Date();
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      result.push({ date: dateStr, created: 0, resolved: 0 });
    }

    filteredIssues.forEach((issue) => {
      const cDate = new Date(issue.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const entryC = result.find((r) => r.date === cDate);
      if (entryC) entryC.created += 1;

      if (issue.status === "Resolved" && issue.updatedAt) {
        const rDate = new Date(issue.updatedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        const entryR = result.find((r) => r.date === rDate);
        if (entryR) entryR.resolved += 1;
      }
    });

    return result;
  }, [filteredIssues, issues, timeframe]);

  // 4. Priority breakdown data (Grouped Bar Chart)
  const priorityData = useMemo(() => {
    const priorities = ["Low", "Medium", "High"];
    return priorities.map((priority) => {
      const pIssues = filteredIssues.filter((i) => i.priority === priority);
      return {
        priority,
        Open: pIssues.filter((i) => i.status === "Open").length,
        "In Progress": pIssues.filter((i) => i.status === "In Progress").length,
        Resolved: pIssues.filter((i) => i.status === "Resolved").length,
      };
    });
  }, [filteredIssues]);

  // 5. Pie chart data for Status
  const statusPieData = useMemo(() => {
    return [
      { name: "Resolved", value: metrics.resolved, color: "#2563eb" },
      { name: "In Progress", value: metrics.inProgress, color: "#f59e0b" },
      { name: "Open", value: metrics.open, color: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [metrics]);

  // 6. Intelligent insights generation
  const insights = useMemo(() => {
    const list: { type: "success" | "warning" | "info"; text: string }[] = [];

    if (metrics.total === 0) {
      list.push({
        type: "info",
        text: "No active logs found. Create issues or change the timeframe filter above to generate analytical insights.",
      });
      return list;
    }

    // 1. Resolution rate check
    if (metrics.resolutionRate >= 70) {
      list.push({
        type: "success",
        text: `Excellent Resolution Efficiency: Your team has closed ${metrics.resolutionRate}% of issues within this timeframe, showing high productivity.`,
      });
    } else if (metrics.resolutionRate < 45) {
      list.push({
        type: "warning",
        text: `Slow Turnaround Warnings: Resolution rate is at ${metrics.resolutionRate}%. Consider organizing backlog grooming or assigning more developers to active issues.`,
      });
    }

    // 2. Critical Burden check
    if (metrics.criticalBurdenRate >= 40) {
      list.push({
        type: "warning",
        text: `High-Priority Bottleneck: High-severity issues make up ${metrics.criticalBurdenRate}% of the unresolved backlog (${metrics.highPriorityUnresolved} high priority issues are open).`,
      });
    } else {
      list.push({
        type: "success",
        text: "Healthy backlog load: Unresolved high-priority issues are under control, reducing blockers for other sub-systems.",
      });
    }

    // 3. Resolution speed insight
    if (metrics.avgResolutionDays > 0 && metrics.avgResolutionDays < 2) {
      list.push({
        type: "success",
        text: `Lightning-fast resolution speed: Average issue fix turnaround is under 2 days (${metrics.avgResolutionTimeStr}), showing outstanding response metrics.`,
      });
    } else if (metrics.avgResolutionDays >= 7) {
      list.push({
        type: "info",
        text: `Longer cycles detected: Average fix duration is ${metrics.avgResolutionTimeStr}. Standardizing root-cause definition during planning can help accelerate resolution.`,
      });
    }

    // 4. Overall Trend
    const totalCreated = trendData.reduce((acc, curr) => acc + curr.created, 0);
    const totalResolved = trendData.reduce((acc, curr) => acc + curr.resolved, 0);
    if (totalResolved >= totalCreated && totalCreated > 0) {
      list.push({
        type: "success",
        text: `Net Positive Velocity: Team resolved ${totalResolved} issues while only ${totalCreated} were created during this window. Net backlog is shrinking.`,
      });
    } else if (totalCreated > totalResolved * 1.5) {
      list.push({
        type: "info",
        text: `Backlog Expansion: Newly created issues (${totalCreated}) are outpacing resolved ones (${totalResolved}) by more than 1.5x. Backlog is rising.`,
      });
    }

    return list;
  }, [metrics, trendData]);

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Preset configuration pills
  const timeframePresets: { label: string; value: TimeframeOption }[] = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "All Time", value: "all" },
  ];

  return (
    <motion.div
      className="h-full min-h-0 overflow-y-auto flex flex-col gap-6 relative pr-2 pb-8 glassy-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background glowing rings matching App design */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-50 dark:bg-transparent" />
      <div className="pointer-events-none fixed -inset-10 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/50 via-white/50 to-white dark:from-blue-500/10 dark:via-transparent dark:to-transparent blur-3xl" />
      <div className="pointer-events-none fixed -inset-10 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent blur-2xl" />

      {/* Header section with controls */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiBarChart2 className="text-blue-600 dark:text-blue-400" />
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Monitor resolution velocity, priorities distribution, and executive productivity.
          </p>
        </div>

        {/* Date presets & Refresh buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-1 shadow-sm">
            {timeframePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setTimeframe(preset.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timeframe === preset.value
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchIssues(true)}
            className={`p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer ${
              refreshing ? "animate-spin text-blue-600" : ""
            }`}
            title="Refresh analytics data"
          >
            <FiRefreshCw className="text-sm" />
          </button>
        </div>
      </motion.div>

      {/* Row 1: Key Performance Indicators (KPIs) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 relative z-10"
      >
        {/* KPI 1: Backlog Volume */}
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-blue-500 bg-transparent">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Active Backlog
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
              <FiInbox />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {metrics.unresolved}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{metrics.total} total issues logged</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Resolution Efficiency */}
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-emerald-500 bg-transparent">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Resolution Efficiency
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
              <FiPercent />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {metrics.resolutionRate}%
            </div>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${metrics.resolutionRate}%` }}
              />
            </div>
          </div>
        </Card>

        {/* KPI 3: Avg. Resolution time */}
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-amber-500 bg-transparent">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Avg. Turnaround
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center">
              <FiClock />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {metrics.avgResolutionTimeStr}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Time-to-resolve for issues</span>
            </div>
          </div>
        </Card>

        {/* KPI 4: High Priority Backlog Burden */}
        <Card
          className={`p-5 flex flex-col justify-between border-t-4 bg-transparent transition-all duration-300 ${
            metrics.criticalBurdenRate >= 45 ? "border-t-rose-500" : "border-t-violet-500"
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Critical Burden
            </span>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                metrics.criticalBurdenRate >= 45
                  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 animate-pulse"
                  : "bg-violet-50 dark:bg-violet-500/10 text-violet-500 dark:text-violet-400"
              }`}
            >
              <FiAlertTriangle />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {metrics.criticalBurdenRate}%
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{metrics.highPriorityUnresolved} high priority open issues</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Row 2: Charts Area (Velocity Area Chart & Distribution Pie) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10"
      >
        {/* Area Chart: Throughput Trends (8 Cols) */}
        <Card className="lg:col-span-8 p-5 flex flex-col min-h-[350px] bg-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Issue Velocity Trends
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Timeline comparing incoming new issues vs resolved completions.
              </p>
            </div>
            {/* Custom chart legend */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2 w-4 rounded bg-blue-600 block" /> Created
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2 w-4 rounded bg-emerald-500 block" /> Resolved
              </span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[260px]">
            {metrics.total === 0 ? (
              <div className="h-full flex items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
                No trend data available for this range
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/30" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ fontWeight: 500 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCreated)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Pie Chart: Status Composition (4 Cols) */}
        <Card className="lg:col-span-4 p-5 flex flex-col min-h-[350px] bg-transparent">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Status Breakdown</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 pb-2">
            Proportional split of issues in the active window.
          </p>

          <div className="relative flex-1 flex items-center justify-center min-h-[180px]">
            {statusPieData.length === 0 ? (
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No active issues
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val} Issues`]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Counter overlay in core center */}
                <div className="absolute grid place-items-center">
                  <div className="text-center pointer-events-none">
                    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {metrics.total}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Logged
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Detailed status key lists */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Resolved</div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">{metrics.resolved}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/10">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">In Progress</div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{metrics.inProgress}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100/50 dark:border-rose-500/10">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Open</div>
              <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">{metrics.open}</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Row 3: Priority Burden Stacked Bar & Executive AI Insights */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10"
      >
        {/* Priority Status Breakdown (Grouped Bar Chart - 7 Cols) */}
        <Card className="lg:col-span-7 p-5 flex flex-col min-h-[350px] bg-transparent">
          <div className="pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Backlog Load by Severity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Issue volumes and status grouped by priority levels.
            </p>
          </div>

          <div className="flex-1 w-full min-h-[240px]">
            {metrics.total === 0 ? (
              <div className="h-full flex items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
                No priority breakdown data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/30" />
                  <XAxis
                    dataKey="priority"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 500, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
                  <Bar dataKey="Open" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="In Progress" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Resolved" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* AI Executive Insights & Recommendations (5 Cols) */}
        <Card className="lg:col-span-5 p-5 flex flex-col bg-transparent">
          <div className="flex items-center gap-2 pb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
              <FiZap className="animate-bounce text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Executive Insights
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automated diagnostics calculated in real-time.
              </p>
            </div>
          </div>

          {/* Insights List */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {insights.map((insight, idx) => {
              const bg =
                insight.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                  : insight.type === "warning"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300";

              const icon =
                insight.type === "success" ? (
                  <FiCheck className="text-emerald-500 shrink-0" />
                ) : insight.type === "warning" ? (
                  <FiAlertTriangle className="text-rose-500 shrink-0" />
                ) : (
                  <FiTrendingUp className="text-blue-500 shrink-0" />
                );

              return (
                <div
                  key={idx}
                  className={`flex gap-3 items-start p-3.5 rounded-xl border text-xs leading-relaxed transition-all hover:scale-[1.01] ${bg}`}
                >
                  <span className="mt-0.5 text-base">{icon}</span>
                  <div>{insight.text}</div>
                </div>
              );
            })}
          </div>

          {/* Action Guidance Footnote */}
          {metrics.total > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/30 dark:border-slate-700/30 text-[11px] text-slate-500 dark:text-slate-400 italic text-center">
              Guidance computed on {filteredIssues.length} active records in the {timeframe === "all" ? "entire database" : `${timeframe} range`}.
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}