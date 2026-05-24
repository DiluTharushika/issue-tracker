import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      login(data.token, data.user);
      nav("/dashboard");
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-12 select-none">
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/20 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/15 to-transparent blur-[90px] pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415509_1px,transparent_1px),linear-gradient(to_bottom,#33415509_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        className="relative w-full max-w-[420px] z-10"
      >
        {/* Glow behind card */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-violet-600/10 blur-xl pointer-events-none" />

        <div className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Creative Animated Logo Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{
                scale: [1, 1.04, 1],
                rotate: [0, 3, -3, 0],
                filter: [
                  "drop-shadow(0 0 10px rgba(59,130,246,0.35))",
                  "drop-shadow(0 0 20px rgba(139,92,246,0.55))",
                  "drop-shadow(0 0 10px rgba(59,130,246,0.35))",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white text-xl font-extrabold shadow-[0_0_25px_rgba(59,130,246,0.45)] relative cursor-pointer"
            >
              {/* Outer spinning neon borders */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-4px] rounded-[18px] border border-blue-500/25 pointer-events-none"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-8px] rounded-[22px] border border-violet-500/10 pointer-events-none"
              />
              N
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-3.5 text-center"
            >
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] leading-tight block">
                Nexus SaaS
              </span>
              <h1 className="text-xl font-extrabold text-white leading-tight mt-0.5">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Please enter details to log in secure session
              </p>
            </motion.div>
          </div>

          {err && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400 flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{err}</span>
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="bg-slate-950/40 border-slate-800/80 focus:border-blue-500/80 focus:ring-blue-500/15"
              required
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white transition-all duration-200 border-slate-200/80 dark:border-slate-800/80 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded-md border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                />
                Remember my access
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border-0 mt-2 py-3 rounded-xl cursor-pointer"
              disabled={loading}
            >
              {loading ? "Verifying Credentials..." : "Access Workspace"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Don’t have a dynamic account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-400 hover:text-blue-300 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
