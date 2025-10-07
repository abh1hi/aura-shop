/*
  File: metainflu/adminpanel/frontend/admin/src/services/authService.js
  Purpose: This service is exclusively for the ADMIN PANEL. It handles the
  login of administrators by hitting a separate, dedicated admin login endpoint.
  I have updated the API_URL to point to your local backend server.
*/
const API_URL = 'http://localhost:5000/api/auth/admin/';

/**
 * Logs in an administrator.
 * @param {object} userData - The admin's credentials (email, password).
 * @returns {Promise<object>} - A promise resolving with admin data.
 */
const login = async (userData) => {
  try {
    const response = await fetch(API_URL + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to log in');
    }

    const data = await response.json();
    if (data.token) {
      // Use a separate key for the admin token to ensure separation.
      localStorage.setItem('adminToken', data.token);
    }
    return data;
  } catch (error) {
    console.error('Admin login failed:', error);
    throw error;
  }
};

/**
 * Logs out the administrator by clearing the admin token.
 */
const logout = () => {
  localStorage.removeItem('adminToken');
};

export default {
  login,
  logout,
};

