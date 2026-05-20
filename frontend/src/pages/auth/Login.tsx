import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";


export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });

      // If you want "remember me" behavior:
      // - remember = store token in localStorage (current approach)
      // - otherwise you could store in sessionStorage (optional)
      // For now, we keep localStorage as you already implemented.
      if (!remember) {
        // Optional improvement: use sessionStorage instead of localStorage
        // sessionStorage.setItem("token", data.token);
        // But since our axios reads localStorage, we keep consistent.
      }

      login(data.token, data.user);
      nav("/dashboard");
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 md:grid-cols-2">
        {/* Left: Card */}
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="text-xs font-semibold text-blue-600">IssueTracker Pro</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Sign in</h1>
            <p className="mt-1 text-sm text-slate-600">Welcome back. Please enter your details.</p>
          </div>

          {err && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Remember me
              </label>

              <button type="button" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => alert("Optional: Google OAuth (not required)")}
            >
              Continue with Google
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Right: Marketing/Preview panel (optional, matches SaaS look) */}
        <div className="hidden md:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Track bugs. Ship faster.</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage issues with priorities, statuses, filters and secure authentication.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-sm font-semibold text-slate-900">Open</div>
                <div className="mt-2 text-2xl font-bold text-blue-600">12</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-sm font-semibold text-slate-900">Resolved</div>
                <div className="mt-2 text-2xl font-bold text-emerald-600">38</div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              Tip: After login, you’ll see dashboard cards + issues table like the design screenshot.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}