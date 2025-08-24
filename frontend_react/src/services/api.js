import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // Backend Django server URL
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: Attach access token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quizAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle token refresh automatically on 401 token expiry errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.code === 'token_not_valid' &&
      localStorage.getItem('quizRefreshToken') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('http://localhost:8000/api/users/token/refresh/', {
          refresh: localStorage.getItem('quizRefreshToken'),
        });
        const newAccess = res.data.access;
        localStorage.setItem('quizAccessToken', newAccess);
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('quizAccessToken');
        localStorage.removeItem('quizRefreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
