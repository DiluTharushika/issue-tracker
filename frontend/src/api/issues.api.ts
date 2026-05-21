import api from "./axios";

/**
 * issuesApi handles all issue-related requests
 */
export const issuesApi = {
    getAll: async (params?: {
        search?: string;
        status?: string;
        priority?: string;
    }) => {
        const res = await api.get("/issues", { params });
        return res.data;
    },

    deleteIssue: async (id: string) => {
        const res = await api.delete(`/issues/${id}`);
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get(`/issues/${id}`);
        return res.data;
    },

    updateIssue: async (id: string, payload: any) => {
        const res = await api.put(`/issues/${id}`, payload);
        return res.data;
    },

    createIssue: async (payload: any) => {
        const res = await api.post("/issues", payload);
        return res.data;
    },
};