import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import IssuesList from "./pages/issues/IssuesList";
import IssueForm from "./pages/issues/IssueForm";

import AppLayout from "./components/layout/AppLayout";

/**
 * Route structure:
 * - Public: /login, /register
 * - Protected: everything inside AppLayout
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issues" element={<IssuesList />} />
        <Route path="/issues/new" element={<IssueForm mode="create" />} />
        <Route path="/issues/:id/edit" element={<IssueForm mode="edit" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}