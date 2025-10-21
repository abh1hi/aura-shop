
import api from './api';

const API_URL = 'http://localhost:5000/api/orders/';

const createOrder = async (orderData) => {
  return await api(API_URL, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

const getOrderById = async (orderId) => {
  return await api(API_URL + orderId);
};

const getMyOrders = async () => {
  return await api(API_URL + 'myorders');
};

export default {
  createOrder,
  getOrderById,
  getMyOrders,
};
