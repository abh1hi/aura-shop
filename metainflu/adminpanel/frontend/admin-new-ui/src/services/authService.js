/*
 * Enhanced Authentication Service
 * Includes secure token management, validation, and error handling
 */

import adminService from './adminService.js'
import Validator, { ValidationError } from '../utils/validation.js'

class AuthService {
  constructor() {
    this.user = null
    this.isAuthenticated = false
    
    // Check for existing session on initialization
    this.initializeAuth()
  }

  async initializeAuth() {
    const token = adminService.getToken()
    if (token) {
      try {
        await this.getCurrentUser()
      } catch (error) {
        console.warn('Failed to restore session:', error.message)
        this.logout()
      }
    }
  }

  // Validation schemas using built-in validator
  static validationSchemas = {
    login: Validator.object({
      email: Validator.string()
        .email('Please enter a valid email address')
        .max(100, 'Email cannot exceed 100 characters')
        .required('Email is required'),
      password: Validator.string()
        .required('Password is required')
    }),

    register: Validator.object({
      name: Validator.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .required('Name is required'),
      email: Validator.string()
        .email('Please enter a valid email address')
        .max(100, 'Email cannot exceed 100 characters')
        .required('Email is required'),
      password: Validator.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('Password is required'),
      termsAccepted: Validator.boolean()
        .required('You must accept the terms and conditions'),
      privacyPolicyAccepted: Validator.boolean()
        .required('You must accept the privacy policy')
    }),

    changePassword: Validator.object({
      currentPassword: Validator.string()
        .required('Current password is required'),
      newPassword: Validator.string()
        .min(8, 'New password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('New password is required')
    })
  }

  // Validate input data
  validateCredentials(data, schemaName) {
    const schema = AuthService.validationSchemas[schemaName]
    if (!schema) {
      throw new Error(`Validation schema '${schemaName}' not found`)
    }

    const result = schema.validate(data)
    
    if (!result.isValid) {
      const validationError = new ValidationError('Validation failed')
      validationError.details = result.errors || [{ field: 'root', message: result.error }]
      throw validationError
    }

    return result.value
  }

  // Validate password strength
  validatePassword(password) {
    const errors = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)')
    }
    
    return errors
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Login methods
  async login(credentials) {
    try {
      // Client-side validation
      const validatedCredentials = this.validateCredentials(credentials, 'login')
      
      const response = await adminService.api.post('/auth/login', validatedCredentials)
      
      if (response.data.success && response.data.tokens) {
        // Store tokens
        adminService.setTokens(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        )
        
        // Set user data
        this.user = response.data.user
        this.isAuthenticated = true
        
        // Fetch CSRF token for future requests
        await adminService.fetchCSRFToken()
        
        return response.data
      }
      
      throw new Error('Invalid response from server')
    } catch (error) {
      console.error('Login failed:', error)
      this.logout() // Clear any partial state
      throw error
    }
  }

  async loginAdmin(credentials) {
    try {
      const validatedCredentials = this.validateCredentials(credentials, 'login')
      
      const response = await adminService.api.post('/auth/admin/login', validatedCredentials)
      
      if (response.data.success && response.data.tokens) {
        adminService.setTokens(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        )
        
        this.user = response.data.user
        this.isAuthenticated = true
        
        await adminService.fetchCSRFToken()
        
        return response.data
      }
      
      throw new Error('Invalid response from server')
    } catch (error) {
      console.error('Admin login failed:', error)
      this.logout()
      throw error
    }
  }

  async loginVendor(credentials) {
    try {
      const validatedCredentials = this.validateCredentials(credentials, 'login')
      
      const response = await adminService.api.post('/auth/vendor/login', validatedCredentials)
      
      if (response.data.success && response.data.tokens) {
        adminService.setTokens(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        )
        
        this.user = response.data.user
        this.isAuthenticated = true
        
        await adminService.fetchCSRFToken()
        
        return response.data
      }
      
      throw new Error('Invalid response from server')
    } catch (error) {
      console.error('Vendor login failed:', error)
      this.logout()
      throw error
    }
  }

  // Registration
  async register(userData) {
    try {
      // Validate email
      if (!this.validateEmail(userData.email)) {
        throw new ValidationError('Invalid email format')
      }

      // Validate password
      const passwordErrors = this.validatePassword(userData.password)
      if (passwordErrors.length > 0) {
        throw new ValidationError('Password validation failed', passwordErrors.map(error => ({ field: 'password', message: error })))
      }

      // Validate password confirmation
      if (userData.password !== userData.confirmPassword) {
        throw new ValidationError('Passwords do not match')
      }

      // Validate required fields
      if (!userData.name || userData.name.trim().length < 2) {
        throw new ValidationError('Name must be at least 2 characters')
      }

      if (!userData.termsAccepted) {
        throw new ValidationError('You must accept the terms and conditions')
      }

      if (!userData.privacyPolicyAccepted) {
        throw new ValidationError('You must accept the privacy policy')
      }
      
      // Remove confirmPassword before sending to server
      const { confirmPassword, ...registrationData } = userData
      
      const response = await adminService.api.post('/auth/register', registrationData)
      
      if (response.data.success) {
        // Don't auto-login for registration, let them login manually
        return response.data
      }
      
      throw new Error('Registration failed')
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // Logout
  logout() {
    adminService.clearTokens()
    this.user = null
    this.isAuthenticated = false
    
    // Clear any cached data
    this.clearUserCache()
    
    // Redirect to login page if in browser
    if (typeof window !== 'undefined') {
      // Don't redirect immediately to avoid loops
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }, 100)
    }
  }

  // Get current user
  async getCurrentUser() {
    if (!adminService.getToken()) {
      throw new Error('No authentication token available')
    }

    try {
      const response = await adminService.api.get('/auth/me')
      
      if (response.data.success) {
        this.user = response.data.user
        this.isAuthenticated = true
        return response.data.user
      }
      
      throw new Error('Failed to get user data')
    } catch (error) {
      console.error('Failed to get current user:', error)
      this.logout()
      throw error
    }
  }

  // Check authentication status
  async checkAuth() {
    if (!adminService.getToken()) {
      return false
    }

    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await adminService.api.put('/auth/profile', profileData)
      
      if (response.data.success) {
        // Update local user data
        this.user = { ...this.user, ...response.data.user }
        return response.data.user
      }
      
      throw new Error('Profile update failed')
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      // Validate new password
      const passwordErrors = this.validatePassword(passwordData.newPassword)
      if (passwordErrors.length > 0) {
        throw new ValidationError('Password validation failed', passwordErrors.map(error => ({ field: 'newPassword', message: error })))
      }

      // Validate password confirmation
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        throw new ValidationError('Password confirmation does not match')
      }
      
      const response = await adminService.api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      return response.data
    } catch (error) {
      console.error('Password change failed:', error)
      throw error
    }
  }

  // Password reset
  async requestPasswordReset(email) {
    try {
      if (!this.validateEmail(email)) {
        throw new Error('Please provide a valid email address')
      }
      
      const response = await adminService.api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      console.error('Password reset request failed:', error)
      throw error
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const passwordErrors = this.validatePassword(newPassword)
      if (passwordErrors.length > 0) {
        throw new ValidationError('Password validation failed', passwordErrors.map(error => ({ field: 'password', message: error })))
      }
      
      const response = await adminService.api.post('/auth/reset-password', {
        token,
        password: newPassword
      })
      
      return response.data
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  }

  // Email verification
  async verifyEmail(token) {
    try {
      const response = await adminService.api.get(`/auth/verify-email/${token}`)
      
      if (response.data.success && this.user) {
        // Update user's email verification status
        this.user.emailVerified = true
      }
      
      return response.data
    } catch (error) {
      console.error('Email verification failed:', error)
      throw error
    }
  }

  async resendVerificationEmail() {
    try {
      const response = await adminService.api.post('/auth/resend-verification')
      return response.data
    } catch (error) {
      console.error('Failed to resend verification email:', error)
      throw error
    }
  }

  // Utility methods
  isLoggedIn() {
    return this.isAuthenticated && !!this.user && !!adminService.getToken()
  }

  hasRole(role) {
    return this.user?.role === role
  }

  hasAnyRole(roles) {
    return roles.includes(this.user?.role)
  }

  getUser() {
    return this.user
  }

  getUserRole() {
    return this.user?.role
  }

  isEmailVerified() {
    return this.user?.emailVerified === true
  }

  clearUserCache() {
    // Clear any cached user-specific data
    // This could include clearing Vue/Pinia stores, localStorage items, etc.
  }

  // Session management
  async refreshSession() {
    try {
      await adminService.refreshToken()
      await this.getCurrentUser()
      return true
    } catch (error) {
      this.logout()
      return false
    }
  }

  // Security utilities
  isSessionExpired() {
    const token = adminService.getToken()
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return Date.now() >= payload.exp * 1000
    } catch (error) {
      return true
    }
  }

  getSessionTimeRemaining() {
    const token = adminService.getToken()
    if (!token) return 0
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const remaining = (payload.exp * 1000) - Date.now()
      return Math.max(0, remaining)
    } catch (error) {
      return 0
    }
  }
}

// Create and export singleton instance
const authService = new AuthService()
export default authService