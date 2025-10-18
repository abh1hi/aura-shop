/*
  File: frontend/client/src/services/productService.js
  Purpose: Handles fetching product data for the client-facing shop, now supporting category filtering.
*/

import api from './apiClient';

const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

export default { getCategories };