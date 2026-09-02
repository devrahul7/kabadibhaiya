import axios from 'axios';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
  timeout: 10000
});
// Interceptor: on 401, try refresh token
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      try {
        await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/auth/refresh', {}, { withCredentials: true });
        return api(err.config);
      } catch { window.location.href = '/login'; }
    }
    return Promise.reject(err);
  }
);
export default api;
