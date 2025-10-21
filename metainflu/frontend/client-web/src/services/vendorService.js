/*
  File: metainflu/frontend/client/src/services/vendorService.js
  Purpose: Centralized API calls for the Vendor Panel, secured by the vendor's JWT token.
  API routes hit the backend's /api/vendor/ endpoints for protected actions, and 
  /api/products/ for product management.
*/

// Set the base URL for the backend API
const API_BASE_URL = 'http://localhost:5000/api/';

/**
 * Helper function to retrieve the vendor's token from local storage.
 * @returns {string | null} The JWT token.
 */
const getToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user).token;
  }
  return null;
};

/**
 * Helper function to create authentication headers.
 * @returns {object} Headers object.
 */
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error('Vendor not authenticated. Please log in.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Fetches vendor-specific dashboard statistics.
 * @param {object} params - Query parameters for filtering.
 * @returns {Promise<object>} Dashboard stats.
 */
const getVendorDashboardStats = async (params) => {
  try {
    let url = API_BASE_URL + 'vendor/dashboard/stats';
    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dashboard stats');
    }

    return await response.json();
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
    const response = await fetch(API_BASE_URL + 'vendor/products', {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch vendor products');
    }

    return await response.json();
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
    const response = await fetch(API_BASE_URL + 'products', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }

    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }

    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }

    // Deletion usually returns a simple success message
    return { message: 'Product deleted successfully' };
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
    const response = await fetch(API_BASE_URL + 'vendor/orders', {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch vendor orders');
    }

    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}vendor/orders/${orderId}/ship`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark order as shipped');
    }

    return await response.json();
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
