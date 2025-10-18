/*
  File: metainflu/frontend/client/src/services/vendorService.js
  Purpose: Centralized API calls for the Vendor Panel, secured by the vendor's JWT token.
  API routes hit the backend's /api/vendor/ endpoints for protected actions, and 
  /api/products/ for product management.
*/

import api from './apiClient';

// Use apiClient which already points to /api base and attaches token

/**
 * Fetches vendor-specific dashboard statistics.
 * @param {object} params - Query parameters for filtering.
 * @returns {Promise<object>} Dashboard stats.
 */
const getVendorDashboardStats = async (params) => {
  try {
  let url = '/vendor/dashboard/stats';
    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const { data } = await api.get(url, { params });
    return data;
  } catch (error) {
    console.error('getVendorDashboardStats failed:', error);
    throw error;
  }
};

/**
 * Fetches products owned by the current vendor.
 * @returns {Promise<Array>} Array of products.
 */
const getVendorProducts = async () => {
  try {
    // Hits the protected route specific to fetching the current vendor's products
    const { data } = await api.get('/vendor/products');
    return data;
  } catch (error) {
    console.error('getVendorProducts failed:', error);
    throw error;
  }
};

/**
 * Creates a new product.
 * @param {object} productData - Data for the new product.
 * @returns {Promise<object>} The created product.
 */
const createProduct = async (productData) => {
  try {
    // Hits the product route, which will be filtered by the backend controller to the current vendor
    const { data } = await api.post('/products', productData);
    return data;
  } catch (error) {
    console.error('createProduct failed:', error);
    throw error;
  }
};

/**
 * Updates an existing product. (Fix: Missing function added)
 * @param {string} productId - The ID of the product to update.
 * @param {object} productData - The updated product data.
 * @returns {Promise<object>} The updated product.
 */
const updateProduct = async (productId, productData) => {
  try {
    // Hits the product route, restricted to vendor/admin roles
    const { data } = await api.put(`/products/${productId}`, productData);
    return data;
  } catch (error) {
    console.error('updateProduct failed:', error);
    throw error;
  }
};

/**
 * Deletes a product. (Fix: Missing function added)
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<object>} A success message.
 */
const deleteProduct = async (productId) => {
  try {
    // Hits the product route, restricted to vendor/admin roles
    const { data } = await api.delete(`/products/${productId}`);
    return data;
  } catch (error) {
    console.error('deleteProduct failed:', error);
    throw error;
  }
};

/**
 * Fetches orders for products owned by the current vendor.
 * @returns {Promise<Array>} Array of relevant orders.
 */
const getVendorOrders = async () => {
  try {
    // Hits the protected route specific to fetching the current vendor's orders
    const { data } = await api.get('/vendor/orders');
    return data;
  } catch (error) {
    console.error('getVendorOrders failed:', error);
    throw error;
  }
};

/**
 * Updates the status of an order to 'shipped'.
 * @param {string} orderId - The ID of the order to update.
 * @returns {Promise<object>} The updated order object.
 */
const markOrderShipped = async (orderId) => {
  try {
    // Hits the protected route to update order status
    const { data } = await api.put(`/vendor/orders/${orderId}/ship`);
    return data;
  } catch (error) {
    console.error('markOrderShipped failed:', error);
    throw error;
  }
};

export default {
  getVendorDashboardStats,
  getVendorProducts,
  createProduct,
  updateProduct, // Now included
  deleteProduct, // Now included
  getVendorOrders,
  markOrderShipped,
};
