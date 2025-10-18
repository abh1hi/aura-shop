/*
  Order service placeholder for vendor Account page references.
  Implement endpoints as needed.
*/
import api from './apiClient';

const listOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export default { listOrders };
