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
};