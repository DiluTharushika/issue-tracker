/*for local storage access because avoid 
repeating string keys all over the app*/

export const storage = {
    setToken: (token: string) => localStorage.setItem("token", token),
    getToken: () => localStorage.getItem("token"),
    clearToken: () => localStorage.removeItem("token"),
    setUser: (user: any) => localStorage.setItem("user", JSON.stringify(user)),
    getUser: () => {
        try {
            const u = localStorage.getItem("user");
            return u ? JSON.parse(u) : null;
        } catch (e) {
            console.error("Failed to parse cached user", e);
            return null;
        }
    },
    clearUser: () => localStorage.removeItem("user"),
};