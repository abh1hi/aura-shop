
import { globalState } from '../main';

const api = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired, log the user out
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    globalState.isLoggedIn = false;
    globalState.user = null;
    // Redirect to login page
    window.location.href = '/login';
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
};

export default api;
