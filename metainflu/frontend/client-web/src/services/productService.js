/*
  File: frontend/client/src/services/productService.js
  Purpose: Handles fetching product data for the client-facing shop, now supporting category filtering.
*/

const API_URL = 'http://localhost:5000/api/products/';

/**
 * Fetches all products from the backend.
 * @param {string | null} categoryId - Optional ID to filter products by category.
 * @returns {Promise<Array>} - A promise that resolves with an array of products.
 */
const getProducts = async (categoryId = null) => {
  try {
    let url = new URL(API_URL);
    if (categoryId) {
        // Append category ID as a query parameter for filtering
        url.searchParams.append('category', categoryId);
    }
    url.searchParams.append('time', new Date().getTime());
    
    const response = await fetch(url);

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

const getProductById = async (id) => {
  try {
    let url = new URL(`${API_URL}${id}`);
    url.searchParams.append('time', new Date().getTime());
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch product');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
};