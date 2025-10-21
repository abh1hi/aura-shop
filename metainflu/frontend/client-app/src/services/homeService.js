
import api from './api';

const API_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/home';

const getHeroBanners = async () => {
  return await api(`${API_URL}/hero-banners`);
};

const getFeaturedCollections = async () => {
  return await api(`${API_URL}/featured-collections`);
};

const getShippingInfo = async () => {
  return await api(`${API_URL}/shipping-info`);
};

export default {
  getHeroBanners,
  getFeaturedCollections,
  getShippingInfo,
};