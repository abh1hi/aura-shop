/*
  File: metainflu/frontend/client/src/services/authService.js
  Purpose: This service is exclusively for the CLIENT-FACING storefront.
  I have updated the API_URL to point to your local backend server.
*/
const API_URL = 'http://localhost:5000/api/auth/';

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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
    }

    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
    }

    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export default {
  register,
  login,
  logout,
};

