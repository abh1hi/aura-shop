
import api from './api';

const API_URL = 'http://localhost:5000/api/cart';

const getCart = async () => {
  return await api(API_URL);
};

const addToCart = async (itemData) => {
  return await api(API_URL, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

const removeFromCart = async (itemId) => {
  return await api(`${API_URL}/${itemId}`, {
    method: 'DELETE',
  });
};

const updateCartItem = async (itemId, quantity) => {
  return await api(`${API_URL}/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
};

const clearCart = async () => {
  return await api(API_URL, {
    method: 'DELETE',
  });
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};