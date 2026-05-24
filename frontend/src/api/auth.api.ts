import api from "./axios";


export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    // Full URL: http://localhost:5000/api/auth/login 
    const res = await api.post("/auth/login", payload);
    return res.data;
  },

  register: async (payload: { email: string; password: string; fullName: string }) => {
    // Full URL: http://localhost:5000/api/auth/register 
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  getMe: async () => {
    // Full URL: http://localhost:5000/api/auth/me 
    const res = await api.get("/auth/me");
    return res.data;
  },

  updateProfile: async (payload: { fullName: string; role?: string; department?: string }) => {
    // Full URL: http://localhost:5000/api/auth/profile 
    const res = await api.put("/auth/profile", payload);
    return res.data;
  },
};