/*
  File: metainflu/frontend/client/src/services/authService.js
  Purpose: This service is exclusively for the CLIENT-FACING storefront.
  I have updated the API_URL to point to your local backend server.
*/
const API_URL = 'http://localhost:5000/api/auth/';

/**
 * Registers a new CLIENT user by sending a POST request to the backend.
 * All users registered through this function will have the default 'user' role.
 * @param {object} userData - The user's registration data (name, email, password).
 * @returns {Promise<object>} - A promise that resolves with the user data upon successful registration.
 */
const register = async (userData) => {
  try {
    const response = await fetch(API_URL + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user');
    }

    const data = await response.json();
    // Save client user data to localStorage
    if (data.token) {
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Authenticates a CLIENT user by sending a POST request to the backend.
 * @param {object} userData - The user's login credentials (email, password).
 * @returns {Promise<object>} - A promise that resolves with the user data upon successful login.
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
    // Save client user data to localStorage
    if (data.token) {
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Logs out the current client user by removing their data from localStorage.
 */
const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
};

