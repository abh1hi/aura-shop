
import api from './api';

const API_BASE_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/';

const getVendorDashboardStats = async (params) => {
  let url = API_BASE_URL + 'vendor/dashboard/stats';
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  return await api(url);
};

const getVendorProducts = async () => {
  return await api(API_BASE_URL + 'vendor/products');
};

const createProduct = async (productData) => {
  return await api(API_BASE_URL + 'products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

const updateProduct = async (productId, productData) => {
  return await api(`${API_BASE_URL}products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

const deleteProduct = async (productId) => {
  return await api(`${API_BASE_URL}products/${productId}`, {
    method: 'DELETE',
  });
};

const getVendorOrders = async () => {
  return await api(API_BASE_URL + 'vendor/orders');
};

const markOrderShipped = async (orderId) => {
  return await api(`${API_BASE_URL}vendor/orders/${orderId}/ship`, {
    method: 'PUT',
  });
};

export default {
  getVendorDashboardStats,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorOrders,
  markOrderShipped,
};
