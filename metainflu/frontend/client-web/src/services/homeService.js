import axios from 'axios';

const API_URL = 'https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api/home';

const getHeroBanners = async () => {
    const response = await axios.get(`${API_URL}/hero-banners`);
    return response.data;
};

const getFeaturedCollections = async () => {
    const response = await axios.get(`${API_URL}/featured-collections`);
    return response.data;
};

const getShippingInfo = async () => {
    const response = await axios.get(`${API_URL}/shipping-info`);
    return response.data;
};

export default {
    getHeroBanners,
    getFeaturedCollections,
    getShippingInfo,
};