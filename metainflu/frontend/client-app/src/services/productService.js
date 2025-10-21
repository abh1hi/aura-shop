
import api from './api';

const API_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/products/';

const getProducts = async (categoryId = null) => {
  let url = new URL(API_URL);
  if (categoryId) {
    url.searchParams.append('category', categoryId);
  }
  url.searchParams.append('time', new Date().getTime());
  return await api(url);
};

const getProductById = async (id) => {
  let url = new URL(`${API_URL}${id}`);
  url.searchParams.append('time', new Date().getTime());
  return await api(url);
};

export default {
  getProducts,
  getProductById,
};