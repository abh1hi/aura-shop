/*
 * Enhanced Admin Service with Comprehensive Security
 * Includes client-side validation, sanitization, and secure token management
 */

import axios from 'axios'
import Joi from 'joi'
import DOMPurify from 'dompurify'

class AdminService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
    this.timeout = 10000
    
    // Create axios instance with interceptors
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add CSRF token for state-changing requests
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
          const csrfToken = this.getCSRFToken()
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken
          }
        }
        
        // Sanitize request data
        if (config.data) {
          config.data = this.sanitizeData(config.data)
        }
        
        return config
      },
      (error) => Promise.reject(this.handleError(error))
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            await this.refreshToken()
            // Retry original request with new token
            const token = this.getToken()
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return this.api(originalRequest)
          } catch (refreshError) {
            this.handleAuthError()
            return Promise.reject(refreshError)
          }
        }
        
        return Promise.reject(this.handleError(error))
      }
    )
  }

  // Validation schemas
  static validationSchemas = {
    product: Joi.object({
      name: Joi.string()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-Z0-9\s\-_.'"]+$/)
        .required()
        .messages({
          'string.pattern.base': 'Product name contains invalid characters',
          'string.min': 'Product name must be at least 3 characters',
          'string.max': 'Product name cannot exceed 100 characters'
        }),
      description: Joi.string()
        .max(1000)
        .allow('')
        .messages({
          'string.max': 'Description cannot exceed 1000 characters'
        }),
      brand: Joi.string()
        .max(50)
        .allow('')
        .pattern(/^[a-zA-Z0-9\s\-_.'"]*$/)
        .messages({
          'string.pattern.base': 'Brand name contains invalid characters'
        }),
      price: Joi.number()
        .positive()
        .precision(2)
        .max(999999.99)
        .required()
        .messages({
          'number.positive': 'Price must be positive',
          'number.max': 'Price cannot exceed $999,999.99'
        }),
      stock: Joi.number()
        .integer()
        .min(0)
        .max(999999)
        .required()
        .messages({
          'number.min': 'Stock cannot be negative',
          'number.max': 'Stock cannot exceed 999,999'
        }),
      category: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid category ID format'
        }),
      tags: Joi.array()
        .items(Joi.string().max(50).pattern(/^[a-zA-Z0-9\s\-_]+$/)).max(10)
        .default([])
    }),

    category: Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z0-9\s\-]+$/)
        .required()
        .messages({
          'string.pattern.base': 'Category name can only contain letters, numbers, spaces, and hyphens'
        }),
      description: Joi.string().max(200).allow(''),
      parentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(''),
      status: Joi.string().valid('active', 'inactive').default('active')
    }),

    user: Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required(),
      email: Joi.string().email().max(100).required(),
      role: Joi.string().valid('user', 'vendor', 'admin').required(),
      isActive: Joi.boolean().default(true)
    })
  }

  // Data validation
  validateData(data, schemaName) {
    const schema = AdminService.validationSchemas[schemaName]
    if (!schema) {
      throw new Error(`Validation schema '${schemaName}' not found`)
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const validationError = new Error('Validation failed')
      validationError.name = 'ValidationError'
      validationError.details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }))
      throw validationError
    }

    return value
  }

  // Data sanitization
  sanitizeData(data) {
    if (typeof data === 'string') {
      return DOMPurify.sanitize(data, { ALLOWED_TAGS: [] })
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item))
    }
    
    if (data && typeof data === 'object') {
      const sanitized = {}
      for (const [key, value] of Object.entries(data)) {
        // Skip dangerous keys
        if (key.startsWith('$') || key.includes('.') || key === '__proto__') {
          continue
        }
        sanitized[key] = this.sanitizeData(value)
      }
      return sanitized
    }
    
    return data
  }

  // Token management
  getToken() {
    return localStorage.getItem('admin_access_token')
  }

  getRefreshToken() {
    return localStorage.getItem('admin_refresh_token')
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('admin_access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('admin_refresh_token', refreshToken)
    }
  }

  clearTokens() {
    localStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')
    localStorage.removeItem('csrf_token')
  }

  getCSRFToken() {
    return localStorage.getItem('csrf_token')
  }

  async fetchCSRFToken() {
    try {
      const response = await axios.get(`${this.baseURL}/csrf-token`)
      const csrfToken = response.data.csrfToken
      localStorage.setItem('csrf_token', csrfToken)
      return csrfToken
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error.message)
      return null
    }
  }

  // Token refresh
  async refreshToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refreshToken
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data
      this.setTokens(accessToken, newRefreshToken)
      
      return accessToken
    } catch (error) {
      this.clearTokens()
      throw error
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      const customError = new Error(data.message || `HTTP Error ${status}`)
      customError.status = status
      customError.errors = data.errors || []
      customError.timestamp = data.timestamp
      
      return customError
    } else if (error.request) {
      // Network error
      return new Error('Network error: Unable to connect to server')
    } else {
      // Other error
      return error
    }
  }

  handleAuthError() {
    this.clearTokens()
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // API Methods with validation
  
  // Dashboard
  async getDashboardData() {
    try {
      const response = await this.api.get('/admin/dashboard')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Analytics
  async getAnalytics(period = '30d') {
    try {
      const response = await this.api.get(`/admin/analytics`, {
        params: { period }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Products
  async getProducts(filters = {}) {
    try {
      const response = await this.api.get('/admin/products', {
        params: filters
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getProduct(id) {
    try {
      const response = await this.api.get(`/admin/products/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createProduct(productData) {
    try {
      // Client-side validation
      const validatedData = this.validateData(productData, 'product')
      
      const response = await this.api.post('/admin/products', validatedData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateProduct(id, productData) {
    try {
      // Client-side validation (partial update)
      const validatedData = this.validateData(productData, 'product')
      
      const response = await this.api.put(`/admin/products/${id}`, validatedData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteProduct(id) {
    try {
      const response = await this.api.delete(`/admin/products/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Categories
  async getCategories() {
    try {
      const response = await this.api.get('/admin/categories')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createCategory(categoryData) {
    try {
      const validatedData = this.validateData(categoryData, 'category')
      const response = await this.api.post('/admin/categories', validatedData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const validatedData = this.validateData(categoryData, 'category')
      const response = await this.api.put(`/admin/categories/${id}`, validatedData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteCategory(id) {
    try {
      const response = await this.api.delete(`/admin/categories/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Users
  async getUsers(filters = {}) {
    try {
      const response = await this.api.get('/admin/users', {
        params: filters
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateUser(id, userData) {
    try {
      const validatedData = this.validateData(userData, 'user')
      const response = await this.api.put(`/admin/users/${id}`, validatedData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteUser(id) {
    try {
      const response = await this.api.delete(`/admin/users/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Orders
  async getOrders(filters = {}) {
    try {
      const response = await this.api.get('/admin/orders', {
        params: filters
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // File upload
  async uploadFile(file, folder = 'general') {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds for file upload
      })
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Bulk operations
  async bulkDeleteProducts(productIds) {
    try {
      const response = await this.api.delete('/admin/products/bulk', {
        data: { ids: productIds }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async bulkUpdateProductStatus(productIds, status) {
    try {
      const response = await this.api.patch('/admin/products/bulk-status', {
        ids: productIds,
        status
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

// Create and export singleton instance
const adminService = new AdminService()
export default adminService