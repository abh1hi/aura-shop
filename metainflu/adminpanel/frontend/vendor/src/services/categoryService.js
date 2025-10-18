/*
  File: metainflu/frontend/client/src/services/categoryService.js
  Purpose: Handles fetching public category data.
*/

const API_URL = 'http://localhost:5000/api/categories/';

/**
 * Fetches all approved categories from the backend.
 * @returns {Promise<Array>} - A promise that resolves with an array of category objects.
 */
const getCategories = async () => {
  try {
    let url = new URL(API_URL);
    url.searchParams.append('time', new Date().getTime());
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch categories');
    }

    // Assuming the backend returns an array of approved categories
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

export default {
  getCategories,
};
