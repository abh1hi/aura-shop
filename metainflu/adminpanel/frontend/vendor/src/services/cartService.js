const API_URL = 'http://localhost:5000/api/cart/';

// Helper function to get the token from localStorage
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

/**
 * Fetches the current user's cart.
 * @returns {Promise<object>} The cart object with populated items.
 */
const getCart = async () => {
  const token = getToken();
  if (!token) throw new Error('User not authenticated for cart access.');

  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw error;
  }
};

/**
 * Adds an item to the current user's cart.
 * @param {object} itemData - { productId, quantity, size, color }
 * @returns {Promise<object>} The updated cart object.
 */
const addItem = async (itemData) => {
    const token = getToken();
    if (!token) throw new Error('User not authenticated to add item.');
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add item to cart');
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to add item:', error);
        throw error;
    }
};

/**
 * Removes a specific item from the user's cart.
 * @param {string} productId - The ID of the product to remove.
 * @returns {Promise<object>} Success message or updated cart structure.
 */
const removeItem = async (productId) => {
    const token = getToken();
    if (!token) throw new Error('User not authenticated to remove item.');
    
    try {
        const response = await fetch(API_URL + productId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to remove item from cart');
        }
        
        // Return a confirmation or the updated cart from the backend
        return await response.json();
    } catch (error) {
        console.error('Failed to remove item:', error);
        throw error;
    }
};


export default {
  getCart,
  addItem,
  removeItem,
};