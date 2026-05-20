import React, { createContext, useMemo, useState } from "react";
import { storage } from "../utils/storage";

type AuthUser = { id: string; email: string } | null;

type AuthContextType = {
  token: string | null;
  user: AuthUser;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Load token from localStorage so refresh doesn't log the user out
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [user, setUser] = useState<AuthUser>(null);

  const login = (newToken: string, newUser?: AuthUser) => {
    storage.setToken(newToken);
    setToken(newToken);
    if (newUser !== undefined) setUser(newUser);
  };

  const logout = () => {
    storage.clearToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}