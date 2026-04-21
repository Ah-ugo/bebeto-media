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

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const bookingsAPI = {
  getAll: (params) => api.get('/bookings/', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings/', data),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
};

export const packagesAPI = {
  getAll: () => api.get('/packages/'),
  create: (data) => api.post('/packages/', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
};

export const availabilityAPI = {
  month: (year, month) => api.get(`/availability/month/${year}/${month}`),
  block: (data) => api.post('/availability/block', data),
  unblock: (date) => api.delete(`/availability/unblock/${date}`),
};

export const portfolioAPI = {
  getAll: (params) => api.get('/portfolio/', { params }),
  upload: (data) =>
    api.post('/portfolio/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/portfolio/${id}`),
};

export const reviewsAPI = {
  getAll: () => api.get('/reviews/'),
  create: (data) => api.post('/reviews/', data),
};

export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
};

export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
};

export const createChatWS = (roomId, token) => {
  const wsUrl =
    (
      import.meta.env.VITE_API_URL || 'https://bebeto-api.onrender.com/api/v1'
    ).replace('http', 'ws') + `/chat/ws/${roomId}?token=${token}`;
  return new WebSocket(wsUrl);
};

export default api;
