// File: frontend/client/src/services/productService.js

const API_URL = 'http://localhost:5000/api/products/';

/**
 * Fetches all products from the backend.
 * @returns {Promise<Array>} - A promise that resolves with an array of products.
 */
const getProducts = async () => {
  try {
    const response = await fetch(API_URL);

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

export default {
  getProducts,
};
