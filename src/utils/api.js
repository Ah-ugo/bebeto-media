/** @format */

import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://bebeto-api.onrender.com/api/v1',
});

// Request Interceptor: Attach the Bearer token to every request
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('bebeto-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        // Following the structure defined in bebeto-mobile/app/login.jsx:
        // { state: { token: '...', ... } }
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Could not parse auth data from localStorage', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle global errors like 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn(
        'Authentication error or permission denied. Redirecting to login.',
      );
      // Optional: Clear storage and redirect the user if the session is invalid
      // localStorage.removeItem('bebeto-auth');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
