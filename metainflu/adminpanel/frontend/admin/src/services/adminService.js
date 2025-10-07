/*
  File: metainflu/adminpanel/frontend/admin/src/services/adminService.js
  Purpose: This file centralizes API calls for the admin panel. It handles fetching
  users, getting products, and creating new products, including authentication headers.
*/

const API_URL = 'http://localhost:5000/api/';

// Helper function to create authentication headers.
const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
});

/**
 * Fetches all users from the backend (admin only).
 * Requires a valid admin JWT token for authorization.
 * @param {string} token - The admin user's JWT token.
 * @returns {Promise<Array>} - A promise that resolves with an array of user objects.
 */
const getUsers = async (token) => {
  try {
    const response = await fetch(API_URL + 'admin/users', {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

/**
 * Fetches all products from the backend. This is a public endpoint.
 * @returns {Promise<Array>} - A promise that resolves with an array of product objects.
 */
const getProducts = async () => {
  try {
    const response = await fetch(API_URL + 'products');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

/**
 * Creates a new product (admin only).
 * Requires a valid admin JWT token for authorization.
 * @param {object} productData - The data for the new product (name, description, price, imageUrl).
 * @param {string} token - The admin user's JWT token.
 * @returns {Promise<object>} - A promise that resolves with the newly created product object.
 */
const createProduct = async (productData, token) => {
  try {
    const response = await fetch(API_URL + 'products', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};


export default {
  getUsers,
  getProducts,
  createProduct,
};

