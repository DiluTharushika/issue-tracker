import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-600">We will build this next.</p>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}