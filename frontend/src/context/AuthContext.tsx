import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from "react";
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

  // Ref to skip the syncProfile effect right after login
  const skipSyncRef = useRef(false);

  const login = useCallback((newToken: string, newUser?: AuthUser) => {
    storage.setToken(newToken);
    if (newUser != null) {
      // Persist user immediately so Sidebar / Settings see it on first render
      setUser(newUser);
      storage.setUser(newUser);
    }
    // Skip the upcoming syncProfile triggered by setToken 
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    storage.clearToken();
    storage.clearUser();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: AuthUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      storage.setUser(updatedUser);
    }
  }, []);

  // Keep user profile details perfectly synced with the MongoDB database on page load
  useEffect(() => {
    // If we just came from login(), skip this sync 
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }

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
          
          if (e?.response?.status === 401 || e?.response?.status === 403) {
            logout();
          }
        }
      }
    };
    syncProfile();
  }, [token, logout]);

  const value = useMemo(
    () => ({ token, user, login, logout, updateUser }),
    [token, user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}