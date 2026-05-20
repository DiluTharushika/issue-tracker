import api from "./axios";

/**
 * authApi handles all authentication requests.
 * Base URL already includes /api (from .env).
 * So we only need /auth/login and /auth/register here.
 */
export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    // Full URL: http://localhost:5000/api/auth/login ✅
    const res = await api.post("/auth/login", payload);
    return res.data;
  },

  register: async (payload: { email: string; password: string }) => {
    // Full URL: http://localhost:5000/api/auth/register ✅
    const res = await api.post("/auth/register", payload);
    return res.data;
  },
};