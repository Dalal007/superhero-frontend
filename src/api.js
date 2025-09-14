import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Admin API functions
export const adminApi = {
  getUsers: (page = 1, limit = 10, queryParams = "") => {
    const baseUrl = `/admin/users?page=${page}&limit=${limit}`;
    return api.get(queryParams ? `${baseUrl}&${queryParams}` : baseUrl);
  },
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
