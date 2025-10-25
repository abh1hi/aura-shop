/*
 * Authentication Store (Pinia)
 * Manages authentication state, user data, and auth-related actions
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService.js'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const loginAttempts = ref(0)
  const maxLoginAttempts = 5
  const lockoutTimeRemaining = ref(0)
  
  // Toast instance
  const toast = useToast()

  // Getters (computed)
  const isLoggedIn = computed(() => {
    return isAuthenticated.value && !!user.value
  })

  const userRole = computed(() => {
    return user.value?.role || null
  })

  const isAdmin = computed(() => {
    return userRole.value === 'admin'
  })

  const isVendor = computed(() => {
    return userRole.value === 'vendor'
  })

  const isEmailVerified = computed(() => {
    return user.value?.emailVerified === true
  })

  const isAccountLocked = computed(() => {
    return lockoutTimeRemaining.value > 0
  })

  const canAttemptLogin = computed(() => {
    return loginAttempts.value < maxLoginAttempts && !isAccountLocked.value
  })

  // Actions
  const initializeAuth = async () => {
    try {
      isLoading.value = true
      
      // Check if user has valid token
      if (authService.isLoggedIn()) {
        const userData = await authService.getCurrentUser()
        user.value = userData
        isAuthenticated.value = true
        return true
      }
    } catch (error) {
      console.warn('Failed to initialize auth:', error.message)
      await logout()
    } finally {
      isLoading.value = false
    }
    return false
  }

  const login = async (credentials) => {
    try {
      isLoading.value = true
      
      if (!canAttemptLogin.value) {
        throw new Error('Account temporarily locked due to too many failed attempts')
      }

      const response = await authService.loginAdmin(credentials)
      
      if (response.success) {
        user.value = response.user
        isAuthenticated.value = true
        loginAttempts.value = 0 // Reset attempts on success
        
        toast.success('Login successful!')
        
        return {
          success: true,
          user: response.user
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      
      // Increment login attempts
      loginAttempts.value++
      
      // Handle specific error types
      if (error.status === 423) {
        // Account locked
        startLockoutTimer()
        toast.error('Account temporarily locked. Please try again later.')
      } else if (error.status === 401) {
        toast.error('Invalid email or password')
      } else if (error.status === 429) {
        toast.error('Too many login attempts. Please try again later.')
      } else {
        toast.error(error.message || 'Login failed. Please try again.')
      }
      
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true
      
      // Call logout API if authenticated
      if (isAuthenticated.value) {
        try {
          await authService.api.post('/auth/logout')
        } catch (error) {
          console.warn('Logout API call failed:', error.message)
        }
      }
      
      // Clear local state
      user.value = null
      isAuthenticated.value = false
      loginAttempts.value = 0
      lockoutTimeRemaining.value = 0
      
      // Clear service state
      authService.logout()
      
      toast.info('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      
      const updatedUser = await authService.updateProfile(profileData)
      user.value = { ...user.value, ...updatedUser }
      
      toast.success('Profile updated successfully')
      return updatedUser
    } catch (error) {
      console.error('Profile update failed:', error)
      toast.error(error.message || 'Failed to update profile')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      isLoading.value = true
      
      await authService.changePassword(passwordData)
      
      toast.success('Password changed successfully')
    } catch (error) {
      console.error('Password change failed:', error)
      toast.error(error.message || 'Failed to change password')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      return await authService.checkAuth()
    } catch (error) {
      console.error('Auth check failed:', error)
      return false
    }
  }

  const startLockoutTimer = () => {
    // Set lockout time (2 hours = 7200 seconds)
    lockoutTimeRemaining.value = 7200
    
    // Countdown timer
    const timer = setInterval(() => {
      lockoutTimeRemaining.value--
      
      if (lockoutTimeRemaining.value <= 0) {
        clearInterval(timer)
        loginAttempts.value = 0
        toast.info('Account unlocked. You may now attempt to login again.')
      }
    }, 1000)
  }

  const refreshUserData = async () => {
    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      return userData
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      throw error
    }
  }

  // Utility functions
  const hasRole = (role) => {
    return userRole.value === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(userRole.value)
  }

  const getSessionTimeRemaining = () => {
    return authService.getSessionTimeRemaining()
  }

  const formatLockoutTime = computed(() => {
    if (lockoutTimeRemaining.value <= 0) return ''
    
    const hours = Math.floor(lockoutTimeRemaining.value / 3600)
    const minutes = Math.floor((lockoutTimeRemaining.value % 3600) / 60)
    const seconds = lockoutTimeRemaining.value % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  })

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    loginAttempts,
    lockoutTimeRemaining,
    
    // Getters
    isLoggedIn,
    userRole,
    isAdmin,
    isVendor,
    isEmailVerified,
    isAccountLocked,
    canAttemptLogin,
    formatLockoutTime,
    
    // Actions
    initializeAuth,
    login,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    refreshUserData,
    hasRole,
    hasAnyRole,
    getSessionTimeRemaining
  }
})