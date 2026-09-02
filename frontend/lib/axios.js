import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api',
  withCredentials: true,
  timeout: 15000,
});

// Interceptor: on 401 on protected requests, try refresh token once
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Do NOT loop on auth status checks, login, register, or refresh itself
    const url = originalRequest?.url || '';
    const isAuthCheck = url.includes('/auth/me') || url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/auth/register');

    if (err.response?.status === 401 && !originalRequest._retry && !isAuthCheck) {
      originalRequest._retry = true;
      try {
        await axios.post(
          (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (refreshErr) {
        // Refresh token expired or invalid: let caller handle 401, never force window.location reload loop
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
