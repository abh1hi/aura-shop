/*
  Vendor auth service for the vendor/admin panel.
  Exposes helper functions used by the vendor panel router and components:
  - login, logout
  - isAuthenticated, isVendor
  - getToken, getCurrentUser
  - refreshToken, requestPasswordReset, resetPassword, updateProfile

  This implementation stores the auth token and user info in localStorage
  under the key 'vendorUser' (to avoid clashing with client/admin keys).
*/

const API_URL = 'http://localhost:5000/api/auth/';

const VENDOR_STORAGE_KEY = 'vendorUser';

const saveVendorUser = (data) => {
  try {
    localStorage.setItem(VENDOR_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed saving vendor user to localStorage', e);
  }
};

const removeVendorUser = () => {
  localStorage.removeItem(VENDOR_STORAGE_KEY);
};

const getVendorUser = () => {
  try {
    const raw = localStorage.getItem(VENDOR_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const getToken = () => {
  const u = getVendorUser();
  return u && u.token ? u.token : null;
};

const isAuthenticated = async () => {
  // Quick client-side check based on localStorage; real validation could ping an endpoint
  return !!getToken();
};

const isVendor = async () => {
  const u = getVendorUser();
  return !!(u && (u.role === 'vendor' || u.role === 'admin'));
};

const login = async (credentials) => {
  try {
    const res = await fetch(API_URL + 'login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    // Expecting { token, user }
    saveVendorUser(data);
    return data;
  } catch (err) {
    console.error('Vendor login error', err);
    throw err;
  }
};

const logout = () => {
  removeVendorUser();
};

// Optional helpers for profile & password flows
const updateProfile = async (payload) => {
  const token = getToken();
  const res = await fetch(API_URL + 'profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return await res.json();
};

const requestPasswordReset = async (email) => {
  const res = await fetch(API_URL + 'request-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return await res.json();
};

const resetPassword = async (token, newPassword) => {
  const res = await fetch(API_URL + `reset-password/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: newPassword }),
  });
  return await res.json();
};

const refreshToken = async () => {
  const token = getToken();
  if (!token) throw new Error('No token');
  const res = await fetch(API_URL + 'refresh', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.token) {
    const user = getVendorUser() || {};
    saveVendorUser({ ...user, token: data.token });
  }
  return data;
};

const getCurrentUser = () => {
  const u = getVendorUser();
  return u && u.user ? u.user : u;
};

const authService = {
  login,
  logout,
  isAuthenticated,
  isVendor,
  getToken,
  getCurrentUser,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  refreshToken,
};

export default authService;
export { login, logout, isAuthenticated, isVendor, getToken, getCurrentUser, updateProfile, requestPasswordReset, resetPassword, refreshToken };