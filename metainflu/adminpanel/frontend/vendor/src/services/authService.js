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

import api from './apiClient';

const API_URL = '/auth/';

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
    const { data } = await api.post(API_URL + 'vendor/login', credentials);
    // Expecting { token, user }
    saveVendorUser(data);
    return data;
  } catch (err) {
    console.error('Vendor login error', err);
    throw err;
  }
};

const register = async (payload) => {
  try {
    const { data } = await api.post(API_URL + 'register', payload);
    // Optionally auto-login after register if backend returns token/user
    if (data && data.token) {
      saveVendorUser(data);
    }
    return data;
  } catch (err) {
    console.error('Vendor register error', err);
    throw err;
  }
};

const logout = () => {
  removeVendorUser();
};

// Optional helpers for profile & password flows
const updateProfile = async (payload) => {
  const token = getToken();
  const { data } = await api.put(API_URL + 'profile', payload);
  return data;
};

const requestPasswordReset = async (email) => {
  const { data } = await api.post(API_URL + 'request-password', { email });
  return data;
};

const resetPassword = async (token, newPassword) => {
  const { data } = await api.post(API_URL + `reset-password/${token}`, { password: newPassword });
  return data;
};

const refreshToken = async () => {
  const token = getToken();
  if (!token) throw new Error('No token');
  const { data } = await api.post(API_URL + 'refresh');
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
  register,
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
export { login, register, logout, isAuthenticated, isVendor, getToken, getCurrentUser, updateProfile, requestPasswordReset, resetPassword, refreshToken };