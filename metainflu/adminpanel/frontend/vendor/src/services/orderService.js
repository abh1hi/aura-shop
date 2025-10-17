/*
  Order service placeholder for vendor Account page references.
  Implement endpoints as needed.
*/
const API_URL = 'http://localhost:5000/api/orders/';

const listOrders = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export default { listOrders };
