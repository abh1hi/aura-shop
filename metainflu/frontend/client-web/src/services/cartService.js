import axios from 'axios';

const API_URL = 'https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api/cart';

const getCart = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const addToCart = async (itemData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, itemData, config);
    return response.data;
};

const removeFromCart = async (itemId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${itemId}`, config);
    return response.data;
};


const updateCartItem = async (itemId, quantity, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${itemId}`, { quantity }, config);
    return response.data;
};

const clearCart = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL, config);
    return response.data;
};

export default {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
};