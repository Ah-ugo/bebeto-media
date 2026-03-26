/** @format */

import axios from 'axios';

const BASE =
  import.meta.env.VITE_API_URL || 'https://bebeto-api.onrender.com/api/v1';
const WS =
  import.meta.env.VITE_WS_URL || 'wss://bebeto-api.onrender.com/api/v1';

export const api = axios.create({
  baseURL: BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT
api.interceptors.request.use((cfg) => {
  try {
    const auth = JSON.parse(localStorage.getItem('bebeto-auth') || '{}');
    const token = auth?.state?.token || auth?.state?.access_token;
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return cfg;
});

// Auto-logout on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bebeto-auth');
      if (
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (d) => api.post('/auth/login', d),
  refresh: (t) => api.post('/auth/refresh', { refresh_token: t }),
  me: () => api.get('/auth/me'),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  create: (d) => api.post('/bookings/', d),
  getAll: (p) => api.get('/bookings/', { params: p }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, d) => api.patch(`/bookings/${id}/status`, d),
};

// ─── Packages ─────────────────────────────────────────────────────────────────
export const packagesAPI = {
  getAll: (cat) =>
    api.get('/packages/', { params: cat ? { category: cat } : {} }),
  getById: (id) => api.get(`/packages/${id}`),
  create: (d) => api.post('/packages/', d),
  update: (id, d) => api.put(`/packages/${id}`, d),
  delete: (id) => api.delete(`/packages/${id}`),
};

// ─── Portfolio ────────────────────────────────────────────────────────────────
export const portfolioAPI = {
  getAll: (p) => api.get('/portfolio/', { params: p }),
  getById: (id) => api.get(`/portfolio/${id}`),
  upload: (fd) => api.post('/portfolio/', fd),
  update: (id, d) => api.patch(`/portfolio/${id}`, d),
  delete: (id) => api.delete(`/portfolio/${id}`),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatAPI = {
  history: (bookingId, limit = 100) =>
    api.get(`/chat/${bookingId}/history`, { params: { limit } }),
  getConversations: () => api.get('/chat/conversations'),
};
export const createChatWS = (bookingId, token) => {
  const auth =
    token ||
    JSON.parse(localStorage.getItem('bebeto-auth') || '{}')?.state?.token ||
    JSON.parse(localStorage.getItem('bebeto-auth') || '{}')?.state
      ?.access_token;
  const url = `${WS}/chat/ws/${bookingId}` + (auth ? `?token=${auth}` : '');
  return new WebSocket(url);
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  getAll: (p) => api.get('/reviews/', { params: p }),
  stats: () => api.get('/reviews/stats'),
  submit: (d) => api.post('/reviews/', d),
  publish: (id, v) => api.patch(`/reviews/${id}/publish?published=${v}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ─── Availability ─────────────────────────────────────────────────────────────
export const availabilityAPI = {
  check: (date) => api.get('/availability/check', { params: { date } }),
  month: (year, mo) =>
    api.get('/availability/month', { params: { year, month: mo } }),
  block: (d) => api.post('/availability/block', d),
  unblock: (date) => api.delete(`/availability/block/${date}`),
  listBlocked: () => api.get('/availability/blocked'),
};

// ─── Enquiries ────────────────────────────────────────────────────────────────
export const enquiriesAPI = {
  submit: (d) => api.post('/enquiries/', d),
  getAll: (p) => api.get('/enquiries/', { params: p }),
  markRead: (id) => api.patch(`/enquiries/${id}/read`),
  delete: (id) => api.delete(`/enquiries/${id}`),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
};
