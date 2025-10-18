/*
  File: frontend/client/src/services/productService.js
  Purpose: Handles fetching product data for the client-facing shop, now supporting category filtering.
*/

import api from './apiClient';

const API_URL = '/products/';

/**
 * Fetches all products from the backend.
 * @param {string | null} categoryId - Optional ID to filter products by category.
 * @returns {Promise<Array>} - A promise that resolves with an array of products.
 */
const getProducts = async (categoryId = null) => {
  try {
    const params = {};
    if (categoryId) params.category = categoryId;
    params.time = Date.now();
    const { data } = await api.get('/products', { params });
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`, { params: { time: Date.now() } });
    return data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
};