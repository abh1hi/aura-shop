
import api from './api';

const API_URL = 'https://metainflu.onrender.com/api/influencers/';

const createProfile = async (profileData) => {
  return await api(API_URL + 'profile', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
};

export default {
  createProfile,
};
