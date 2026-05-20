import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";

/**
 * Register page:
 * - Validates confirm password
 * - Calls backend register endpoint
 * - If backend returns token -> auto-login
 * - Otherwise redirect to /login
 */
export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (confirmPassword !== password) return "Passwords do not match";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSuccessMsg(null);

    const validationError = validate();
    if (validationError) {
      setErr(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register({ email, password });

      /**
       * Backend behavior can differ:
       * Case A: returns { token, user } => we can auto-login
       * Case B: returns { message } => redirect to login
       */
      if (data?.token) {
        login(data.token, data.user);
        nav("/dashboard");
      } else {
        setSuccessMsg("Registration successful. Please login.");
        // small delay so user sees message (optional)
        setTimeout(() => nav("/login"), 700);
      }
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Registration failed");
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
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-600">Start tracking issues in minutes.</p>
          </div>

          {err && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMsg}
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
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Right: Info panel */}
        <div className="hidden md:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">What you get</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Create, update, resolve and close issues</li>
              <li>• Search, filter and paginate issues</li>
              <li>• Secure JWT authentication</li>
            </ul>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              After signup you can start creating issues immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}