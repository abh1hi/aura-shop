/*
  File: metainflu/adminpanel/frontend/vendor/src/services/authService.js
  Purpose: This service handles authentication for VENDORS. It provides
  login, logout, and authentication verification for vendor accounts.
*/

const API_URL = 'http://localhost:5000/api/auth/vendor/';
const TOKEN_KEY = 'vendorToken';
const USER_KEY = 'vendorUser';

/**
 * Logs in a vendor.
 * @param {object} credentials - The vendor's credentials (email, password).
 * @returns {Promise<object>} - A promise resolving with vendor data.
 */
const login = async (credentials) => {
  try {
    const response = await fetch(API_URL + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to log in');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.vendor));
    }
    return data;
  } catch (error) {
    console.error('Vendor login failed:', error);
    throw error;
  }
};

/**
 * Registers a new vendor account.
 * @param {object} vendorData - The vendor registration data.
 * @returns {Promise<object>} - A promise resolving with registration result.
 */
const register = async (vendorData) => {
  try {
    const response = await fetch(API_URL + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register');
    }

    return await response.json();
  } catch (error) {
    console.error('Vendor registration failed:', error);
    throw error;
  }
};

/**
 * Logs out the vendor by clearing stored data.
 */
const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Checks if the vendor is currently authenticated.
 * @returns {Promise<boolean>} - Promise resolving to authentication status.
 */
const isAuthenticated = async () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const response = await fetch(API_URL + 'verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

/**
 * Checks if the current user has vendor role.
 * @returns {Promise<boolean>} - Promise resolving to vendor status.
 */
const isVendor = async () => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.role === 'vendor' || user.userType === 'vendor';
};

/**
 * Gets the current authentication token.
 * @returns {string|null} - The authentication token or null.
 */
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Gets the current authenticated vendor data.
 * @returns {object|null} - The vendor object or null.
 */
const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Updates the current vendor profile.
 * @param {object} profileData - The updated profile data.
 * @returns {Promise<object>} - Promise resolving with updated profile.
 */
const updateProfile = async (profileData) => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(API_URL + 'profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const updatedUser = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

/**
 * Requests a password reset for vendor account.
 * @param {string} email - The vendor's email address.
 * @returns {Promise<object>} - Promise resolving with reset result.
 */
const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(API_URL + 'forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reset email');
    }

    return await response.json();
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
};

/**
 * Resets the vendor password using a reset token.
 * @param {string} token - The password reset token.
 * @param {string} newPassword - The new password.
 * @returns {Promise<object>} - Promise resolving with reset result.
 */
const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(API_URL + 'reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password: newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }

    return await response.json();
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

/**
 * Refreshes the authentication token.
 * @returns {Promise<string>} - Promise resolving with new token.
 */
const refreshToken = async () => {
  const token = getToken();
  if (!token) throw new Error('No token to refresh');
  
  try {
    const response = await fetch(API_URL + 'refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout(); // Clear invalid token
    throw error;
  }
};

// Create the authService object with all methods
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
  refreshToken
};

// Export both named exports and default export for flexibility
export {
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
  refreshToken
};

export default authService;