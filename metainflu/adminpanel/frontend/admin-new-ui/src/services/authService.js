import adminService from './adminService.js'

class AuthService {
  constructor() {
    this.user = null
    this.isAuthenticated = false
  }

  // Login
  async login(credentials) {
    try {
      const response = await adminService.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })

      if (response.token) {
        adminService.setToken(response.token)
        this.user = response.user
        this.isAuthenticated = true
        return response
      }

      throw new Error('Invalid response from server')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Logout
  logout() {
    adminService.clearToken()
    this.user = null
    this.isAuthenticated = false
  }

  // Get current user
  async getCurrentUser() {
    if (!adminService.token) {
      throw new Error('No token available')
    }

    try {
      const response = await adminService.request('/auth/me')
      this.user = response.user
      this.isAuthenticated = true
      return response.user
    } catch (error) {
      console.error('Failed to get current user:', error)
      this.logout()
      throw error
    }
  }

  // Check if user is authenticated
  async checkAuth() {
    if (!adminService.token) {
      return false
    }

    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await adminService.request('/auth/refresh', {
        method: 'POST'
      })

      if (response.token) {
        adminService.setToken(response.token)
        return response.token
      }

      throw new Error('Failed to refresh token')
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.logout()
      throw error
    }
  }

  // Update profile
  async updateProfile(data) {
    try {
      const response = await adminService.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      this.user = { ...this.user, ...response.user }
      return response.user
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await adminService.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      return response
    } catch (error) {
      console.error('Password change failed:', error)
      throw error
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await adminService.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      })

      return response
    } catch (error) {
      console.error('Password reset request failed:', error)
      throw error
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await adminService.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          password: newPassword
        })
      })

      return response
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  }
}

export default new AuthService()
