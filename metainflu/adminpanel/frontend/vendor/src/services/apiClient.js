import axios from 'axios';

// Centralized axios instance for the vendor frontend.
// Uses the backend at http://localhost:5000 by default. Change via ENV if needed.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Attach token to requests when available
api.interceptors.request.use((cfg) => {
  try {
    const raw = localStorage.getItem('vendorUser') || localStorage.getItem('user') || localStorage.getItem('vendorAuthToken');
    let token = null;
    if (raw) {
      try { const parsed = JSON.parse(raw); token = parsed && parsed.token ? parsed.token : parsed; } catch(e){ token = raw; }
    }
    if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
  } catch (e) {
    // ignore
  }
  return cfg;
});

// Simple response interceptor to forward errors
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    // Could add refresh-token logic here in future
    return Promise.reject(err);
  }
);

export default api;
