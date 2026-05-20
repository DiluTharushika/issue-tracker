import type {ReactNode} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
/* Blocks access to pages if the user is not authenticated */

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
}