
import api from './api';

const API_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/orders/';

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
