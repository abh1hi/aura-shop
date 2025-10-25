// Enhanced admin service with modern API patterns
class AdminService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    this.token = localStorage.getItem('admin_token')
  }

  // Set authentication token
  setToken(token) {
    this.token = token
    localStorage.setItem('admin_token', token)
  }

  // Clear authentication token
  clearToken() {
    this.token = null
    localStorage.removeItem('admin_token')
  }

  // Make authenticated API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Dashboard data
  async getDashboardData() {
    return this.request('/admin/dashboard')
  }

  // Analytics data
  async getAnalytics(period = '30d') {
    return this.request(`/admin/analytics?period=${period}`)
  }

  // Hero banners
  async getHeroBanners() {
    return this.request('/admin/hero-banners')
  }

  async createHeroBanner(data) {
    return this.request('/admin/hero-banners', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateHeroBanner(id, data) {
    return this.request(`/admin/hero-banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteHeroBanner(id) {
    return this.request(`/admin/hero-banners/${id}`, {
      method: 'DELETE'
    })
  }

  // Featured collections
  async getFeaturedCollections() {
    return this.request('/admin/featured-collections')
  }

  async createFeaturedCollection(data) {
    return this.request('/admin/featured-collections', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateFeaturedCollection(id, data) {
    return this.request(`/admin/featured-collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteFeaturedCollection(id) {
    return this.request(`/admin/featured-collections/${id}`, {
      method: 'DELETE'
    })
  }

  // Products
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/admin/products${params ? `?${params}` : ''}`)
  }

  async createProduct(data) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateProduct(id, data) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE'
    })
  }

  // Categories
  async getCategories() {
    return this.request('/admin/categories')
  }

  async createCategory(data) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateCategory(id, data) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteCategory(id) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE'
    })
  }

  // Users
  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/admin/users${params ? `?${params}` : ''}`)
  }

  async updateUser(id, data) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    })
  }

  // Campaigns
  async getCampaigns() {
    return this.request('/admin/campaigns')
  }

  async createCampaign(data) {
    return this.request('/admin/campaigns', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateCampaign(id, data) {
    return this.request(`/admin/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteCampaign(id) {
    return this.request(`/admin/campaigns/${id}`, {
      method: 'DELETE'
    })
  }

  // Payments
  async getPayments(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/admin/payments${params ? `?${params}` : ''}`)
  }

  // File upload
  async uploadFile(file, folder = 'general') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    return this.request('/admin/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      }
    })
  }
}

export default new AdminService()
