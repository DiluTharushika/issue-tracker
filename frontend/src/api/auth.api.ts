import api from "./axios";


export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const res = await api.post("/auth/login", payload);
    return res.data;
  },

  register: async (payload: { email: string; password: string }) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },
};