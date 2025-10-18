/*
  File: metainflu/adminpanel/frontend/admin/src/services/adminService.js
  Purpose: This file centralizes API calls for the admin panel. It handles fetching
  users, getting products, and creating new products, including authentication headers.
*/

import api from './apiClient';

/**
 * Fetches all users from the backend (admin only).
 * Requires a valid admin JWT token for authorization.
 * @returns {Promise<Array>} - A promise that resolves with an array of user objects.
 */
const getUsers = async () => {
  try {
    const { data } = await api.get('/admin/users');
    return data;
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
    const { data } = await api.get('/products');
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

/**
 * Creates a new product (admin only).
 * Requires a valid admin JWT token for authorization.
 * @param {object} productData - The data for the new product (name, description, price, imageUrl).
 * @returns {Promise<object>} - A promise that resolves with the newly created product object.
 */
const createProduct = async (productData) => {
  try {
    const { data } = await api.post('/products', productData);
    return data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

/**
 * Fetches categories pending approval (admin only).
 * @returns {Promise<Array>} - A promise resolving to an array of pending categories.
 */
const getPendingCategories = async () => {
  try {
      const { data } = await api.get('/admin/categories/pending');
      return data;
  } catch (error) {
      console.error('Failed to fetch pending categories:', error);
      throw error;
  }
};

/**
 * Approves a category (admin only).
 * @param {string} id - The ID of the category to approve.
 * @returns {Promise<object>} - A promise resolving to the approved category.
 */
const approveCategory = async (id) => {
    try {
    const { data } = await api.put(`/admin/categories/${id}/approve`);
    return data;
    } catch (error) {
        console.error('Failed to approve category:', error);
        throw error;
    }
};

/**
 * Rejects (deletes) a category (admin only).
 * @param {string} id - The ID of the category to reject.
 * @returns {Promise<object>} - A promise resolving to a confirmation message.
 */
const rejectCategory = async (id) => {
    try {
    const { data } = await api.delete(`/admin/categories/${id}`);
    return data;
    } catch (error) {
        console.error('Failed to reject category:', error);
        throw error;
    }
};

export default {
  getUsers,
  getProducts,
  createProduct,
  getPendingCategories,
  approveCategory,
  rejectCategory,
};