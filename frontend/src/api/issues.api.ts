import api from "./axios";

/**
 * issuesApi handles all issue-related API requests.
 */
export const issuesApi = {
  getAll: async () => {
    const res = await api.get("/issues");
    return res.data; // expected: { success: true, issues: [...] }
  },
};