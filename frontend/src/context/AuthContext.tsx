import React, { createContext, useMemo, useState, useEffect } from "react";
import { storage } from "../utils/storage";
import { authApi } from "../api/auth.api";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
} | null;

type AuthContextType = {
  token: string | null;
  user: AuthUser;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Load token and user from localStorage so refresh doesn't flash unauthenticated states
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [user, setUser] = useState<AuthUser>(storage.getUser());

  const login = (newToken: string, newUser?: AuthUser) => {
    storage.setToken(newToken);
    setToken(newToken);
    if (newUser !== undefined) {
      setUser(newUser);
      storage.setUser(newUser);
    }
  };

  const logout = () => {
    storage.clearToken();
    storage.clearUser();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: AuthUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      storage.setUser(updatedUser);
    }
  };

  // Keep user profile details perfectly synced with the MongoDB database on page load
  useEffect(() => {
    const syncProfile = async () => {
      if (token) {
        try {
          const data = await authApi.getMe();
          if (data?.success && data?.user) {
            setUser(data.user);
            storage.setUser(data.user);
          }
        } catch (e: any) {
          console.error("Session verification details failed:", e);
          // Only perform auto-logout on explicit 401/403 credentials denial.
          // This keeps the user logged in using cached credentials if the network drops or server restarts!
          if (e?.response?.status === 401 || e?.response?.status === 403) {
            logout();
          }
        }
      }
    };
    syncProfile();
  }, [token]);

  const value = useMemo(() => ({ token, user, login, logout, updateUser }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}