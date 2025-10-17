/*
  Simple product service for vendor app.
  Adjust API_URL to match backend.
*/
const API_URL = 'http://localhost:5000/api/products/';

const getProductById = async (id) => {
  const res = await fetch(API_URL + id);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export default { getProductById };
