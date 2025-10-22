// src/config/api.js
// API Configuration for Aura Shop - Mobile & Web Compatible

const isDevelopment = import.meta.env.DEV

// Check if running in Capacitor (mobile app)
const isCapacitor = () => {
  return typeof window !== 'undefined' && 
         window.Capacitor && 
         window.Capacitor.isNativePlatform && 
         window.Capacitor.isNativePlatform()
}

// API Base URL Configuration
const getApiBaseUrl = () => {
  if (isCapacitor()) {
    // For Capacitor apps, use your computer's IP address
    // IMPORTANT: Replace 'YOUR_IP_ADDRESS' with your actual IP
    // Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
    return 'http://192.168.1.100:5000/api' // Example IP - CHANGE THIS!
  }
  
  if (isDevelopment) {
    // For web development
    return 'http://localhost:5000/api'
  }
  
  // For production - update with your production API URL
  return 'https://your-production-api.com/api'
}

export const API_BASE_URL = getApiBaseUrl()

// Enhanced API client with error handling and mobile compatibility
export const apiClient = {
  /**
   * Make HTTP request with proper headers and error handling
   * @param {string} endpoint - API endpoint (e.g., '/products')
   * @param {object} options - Fetch options
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    }
    
    // Add auth token if available
    try {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.warn('Could not access localStorage:', e)
    }
    
    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`)
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error ${response.status}:`, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log(`API Response: ${options.method || 'GET'} ${url} - Success`)
      return data
      
    } catch (error) {
      console.error('API request failed:', {
        url,
        error: error.message,
        options
      })
      throw error
    }
  },
  
  /**
   * GET request
   * @param {string} endpoint
   */
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  },
  
  /**
   * POST request
   * @param {string} endpoint
   * @param {object} data
   */
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  /**
   * PUT request
   * @param {string} endpoint
   * @param {object} data
   */
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(data)
    })
  },
  
  /**
   * DELETE request
   * @param {string} endpoint
   */
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  },
  
  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const response = await fetch(API_BASE_URL.replace('/api', '/'))
      const data = await response.json()
      console.log('API Connection Test:', data)
      return { success: true, data }
    } catch (error) {
      console.error('API Connection Failed:', error)
      return { success: false, error: error.message }
    }
  }
}

// API Endpoints - Centralized endpoint definitions
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  
  // Cart
  CART: '/cart',
  CART_ADD: '/cart/add',
  CART_REMOVE: '/cart/remove',
  CART_UPDATE: '/cart/update',
  
  // Home
  HOME_DATA: '/home',
  
  // Vendor (if user is vendor)
  VENDOR_PRODUCTS: '/vendor/products',
  VENDOR_ORDERS: '/vendor/orders',
  VENDOR_ANALYTICS: '/vendor/analytics',
  
  // Admin (if user is admin)
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products'
}

// Common API functions
export const api = {
  // Authentication
  login: (credentials) => apiClient.post(API_ENDPOINTS.LOGIN, credentials),
  register: (userData) => apiClient.post(API_ENDPOINTS.REGISTER, userData),
  logout: () => apiClient.post(API_ENDPOINTS.LOGOUT),
  getProfile: () => apiClient.get(API_ENDPOINTS.PROFILE),
  
  // Products
  getProducts: () => apiClient.get(API_ENDPOINTS.PRODUCTS),
  getProduct: (id) => apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id)),
  
  // Categories
  getCategories: () => apiClient.get(API_ENDPOINTS.CATEGORIES),
  getCategory: (id) => apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id)),
  
  // Cart
  getCart: () => apiClient.get(API_ENDPOINTS.CART),
  addToCart: (productData) => apiClient.post(API_ENDPOINTS.CART_ADD, productData),
  removeFromCart: (productId) => apiClient.delete(`${API_ENDPOINTS.CART_REMOVE}/${productId}`),
  updateCart: (cartData) => apiClient.put(API_ENDPOINTS.CART_UPDATE, cartData),
  
  // Orders
  getOrders: () => apiClient.get(API_ENDPOINTS.ORDERS),
  getOrder: (id) => apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id)),
  createOrder: (orderData) => apiClient.post(API_ENDPOINTS.ORDERS, orderData),
  
  // Home
  getHomeData: () => apiClient.get(API_ENDPOINTS.HOME_DATA),
  
  // Test connection
  testConnection: () => apiClient.testConnection()
}

// Export everything for easy importing
export default {
  apiClient,
  api,
  API_BASE_URL,
  API_ENDPOINTS,
  isCapacitor
}