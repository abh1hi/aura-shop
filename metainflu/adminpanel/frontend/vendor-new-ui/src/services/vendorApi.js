// Simple API wrapper connected to backend endpoints
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('vendor_token')
  const headers = { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...(options.headers||{}) }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
  return res.json()
}

export const vendorApi = {
  login: (data) => request('/vendor/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/vendor/auth/me'),
  dashboard: () => request('/vendor/dashboard'),
  orders: (q='') => request(`/vendor/orders${q}`),
  products: (q='') => request(`/vendor/products${q}`),
  createProduct: (data) => request('/vendor/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id,data) => request(`/vendor/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  payments: (q='') => request(`/vendor/payments${q}`),
}
