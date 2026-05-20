import api from "./axios";

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const res = await api.post("/api/auth/login", payload);
    return res.data;
  },
  register: async (payload: { email: string; password: string }) => {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
  },
};