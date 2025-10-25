/*
 * Enhanced Authentication Service
 * Includes secure token management, validation, and error handling
 */

import adminService from './adminService.js'
import Joi from 'joi'

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

  // Validation schemas
  static validationSchemas = {
    login: Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(100)
        .required()
        .messages({
          'string.email': 'Please enter a valid email address',
          'string.empty': 'Email is required'
        }),
      password: Joi.string()
        .min(1)
        .required()
        .messages({
          'string.empty': 'Password is required'
        })
    }),

    register: Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
          'string.pattern.base': 'Name can only contain letters and spaces',
          'string.min': 'Name must be at least 2 characters',
          'string.max': 'Name cannot exceed 50 characters'
        }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(100)
        .required(),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
          'string.min': 'Password must be at least 8 characters',
          'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
          'any.only': 'Passwords do not match'
        }),
      termsAccepted: Joi.boolean()
        .valid(true)
        .required()
        .messages({
          'any.only': 'You must accept the terms and conditions'
        }),
      privacyPolicyAccepted: Joi.boolean()
        .valid(true)
        .required()
        .messages({
          'any.only': 'You must accept the privacy policy'
        })
    }),

    changePassword: Joi.object({
      currentPassword: Joi.string()
        .required()
        .messages({
          'string.empty': 'Current password is required'
        }),
      newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
          'string.min': 'New password must be at least 8 characters',
          'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
      confirmNewPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
          'any.only': 'Password confirmation does not match'
        })
    })
  }

  // Validate input data
  validateCredentials(data, schemaName) {
    const schema = AuthService.validationSchemas[schemaName]
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
      const validatedData = this.validateCredentials(userData, 'register')
      
      // Remove confirmPassword before sending to server
      const { confirmPassword, ...registrationData } = validatedData
      
      const response = await adminService.api.post('/auth/register', registrationData)
      
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
      const validatedData = this.validateCredentials(passwordData, 'changePassword')
      
      // Remove confirmNewPassword before sending to server
      const { confirmNewPassword, ...changeData } = validatedData
      
      const response = await adminService.api.post('/auth/change-password', {
        currentPassword: changeData.currentPassword,
        newPassword: changeData.newPassword
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
      const { error } = Joi.string().email().validate(email)
      if (error) {
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
      const passwordSchema = Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
      
      const { error } = passwordSchema.validate(newPassword)
      if (error) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
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