/*
  File: metainflu/adminpanel/frontend/admin/src/services/adminService.js
  Purpose: This file centralizes API calls for the admin panel. It handles fetching
  users, getting products, and creating new products, including authentication headers.
*/

const API_URL = 'http://localhost:5000/api/';

// Helper function to retrieve the admin token from localStorage.
const getToken = () => {
  const adminUser = localStorage.getItem('adminUser');
  if (adminUser) {
    return JSON.parse(adminUser).token;
  }
  return null;
};

// Helper function to create authentication headers.
const getAuthHeaders = () => {
  const token = getToken();
  // Although we check for a token, we don't throw an error here.
  // This allows the API to handle unauthorized requests gracefully,
  // which is better for centralized error handling in the UI.
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Fetches all users from the backend (admin only).
 * Requires a valid admin JWT token for authorization.
 * @returns {Promise<Array>} - A promise that resolves with an array of user objects.
 */
const getUsers = async () => {
  try {
    const response = await fetch(API_URL + 'admin/users', {
      headers: getAuthHeaders(),
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
 * @returns {Promise<object>} - A promise that resolves with the newly created product object.
 */
const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL + 'products', {
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
      const response = await fetch(`${API_URL}admin/categories/pending`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pending categories');
      }
      return response.json();
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
        const response = await fetch(`${API_URL}admin/categories/${id}/approve`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to approve category');
        }
        return response.json();
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
        const response = await fetch(`${API_URL}admin/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to reject category');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to reject category:', error);
        throw error;
    }
};


const API_URL_HOME = 'http://localhost:5000/api/home';

const getHeroBanners = async () => {
    try {
        const response = await fetch(`${API_URL_HOME}/hero-banners`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch hero banners');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to fetch hero banners:', error);
        throw error;
    }
};

const createHeroBanner = async (bannerData) => {
    try {
        const response = await fetch(`${API_URL_HOME}/hero-banners`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(bannerData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create hero banner');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to create hero banner:', error);
        throw error;
    }
};

const updateHeroBanner = async (id, bannerData) => {
    try {
        const response = await fetch(`${API_URL_HOME}/hero-banners/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(bannerData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update hero banner');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to update hero banner:', error);
        throw error;
    }
};

const deleteHeroBanner = async (id) => {
    try {
        const response = await fetch(`${API_URL_HOME}/hero-banners/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete hero banner');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to delete hero banner:', error);
        throw error;
    }
};

const getFeaturedCollections = async () => {
    try {
        const response = await fetch(`${API_URL_HOME}/featured-collections`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch featured collections');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to fetch featured collections:', error);
        throw error;
    }
};

const createFeaturedCollection = async (collectionData) => {
    try {
        const response = await fetch(`${API_URL_HOME}/featured-collections`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create featured collection');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to create featured collection:', error);
        throw error;
    }
};

const updateFeaturedCollection = async (id, collectionData) => {
    try {
        const response = await fetch(`${API_URL_HOME}/featured-collections/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update featured collection');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to update featured collection:', error);
        throw error;
    }
};

const deleteFeaturedCollection = async (id) => {
    try {
        const response = await fetch(`${API_URL_HOME}/featured-collections/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete featured collection');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to delete featured collection:', error);
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
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getFeaturedCollections,
  createFeaturedCollection,
  updateFeaturedCollection,
  deleteFeaturedCollection,
};