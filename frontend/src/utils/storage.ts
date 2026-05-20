/*for local storage access because avoid 
repeating string keys all over the app*/

export const storage = {
    setToken: (token: string) => localStorage.setItem("token", token),
    getToken: () => localStorage.getItem("token"),
    clearToken: () => localStorage.removeItem("token"),
};