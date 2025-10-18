// File: frontend/client/src/services/influencerService.js

import api from './apiClient';

const API_URL = '/influencers/';

/**
 * Creates a new influencer profile.
 * @param {object} profileData - The influencer's profile data.
 * @param {string} token - The user's JWT token.
 * @returns {Promise<object>} - A promise that resolves with the created profile data.
 */
const createProfile = async (profileData) => {
  try {
    const { data } = await api.post('/influencers/profile', profileData);
    return data;
  } catch (error) {
    console.error('Profile creation failed:', error);
    throw error;
  }
};

export default {
  createProfile,
};
