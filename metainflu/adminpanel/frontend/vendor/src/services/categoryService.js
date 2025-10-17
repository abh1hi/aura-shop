/*
  Category service for vendor app to list categories
*/
const API_URL = 'http://localhost:5000/api/categories/';

const getCategories = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export default { getCategories };
