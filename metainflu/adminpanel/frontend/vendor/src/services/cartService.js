import api from './apiClient';

const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

const addItem = async (itemData) => {
  const { data } = await api.post('/cart', itemData);
  return data;
};

const removeItem = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

export default { getCart, addItem, removeItem };
