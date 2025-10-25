/*
 * Enhanced Authentication Controller
 * Includes account lockout, password policies, email verification, and security tracking
 */

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const asyncHandler = require('express-async-handler')
const { logSecurityEvent } = require('../middleware/security')

// Register new user
const registerUser = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'user',
      termsAccepted,
      privacyPolicyAccepted,
      marketingConsent = false
    } = req.validated.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        timestamp: new Date().toISOString()
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      termsAccepted,
      privacyPolicyAccepted,
      marketingConsent,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date()
    })

    // Generate email verification token
    const verificationToken = user.createEmailVerificationToken()
    
    await user.save()

    // Generate authentication tokens
    const tokens = user.generateAuthToken()

    // Log successful registration
    console.log(`New user registered: ${user.email} with role: ${user.role}`)

    // TODO: Send email verification email
    // await sendVerificationEmail(user.email, verificationToken)

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      },
      tokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
        timestamp: new Date().toISOString()
      })
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      timestamp: new Date().toISOString()
    })
  }
})

// User login
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.validated.body
    const ip = req.ip
    const userAgent = req.get('User-Agent')

    // Find user by email
    const user = await User.findByEmail(email)
    
    if (!user) {
      logSecurityEvent('LOGIN_ATTEMPT_INVALID_EMAIL', { email, ip }, req)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      })
    }

    // Check if account is locked
    if (user.isLocked) {
      logSecurityEvent('LOGIN_ATTEMPT_LOCKED_ACCOUNT', { 
        userId: user._id, 
        email: user.email 
      }, req)
      
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
        lockUntil: user.lockUntil,
        timestamp: new Date().toISOString()
      })
    }

    // Check if account is active
    if (!user.isActive) {
      logSecurityEvent('LOGIN_ATTEMPT_INACTIVE_ACCOUNT', { 
        userId: user._id, 
        email: user.email 
      }, req)
      
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
        timestamp: new Date().toISOString()
      })
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password)
    
    if (!isPasswordCorrect) {
      // Increment login attempts
      await user.incLoginAttempts()
      await user.addLoginRecord(ip, userAgent, false)
      
      logSecurityEvent('LOGIN_ATTEMPT_INVALID_PASSWORD', { 
        userId: user._id, 
        email: user.email,
        attempts: user.loginAttempts + 1
      }, req)
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      })
    }

    // Successful login - reset login attempts and update login info
    await user.resetLoginAttempts()
    await user.addLoginRecord(ip, userAgent, true)

    // Generate authentication tokens
    const tokens = user.generateAuthToken()

    // Log successful login
    console.log(`User logged in: ${user.email} from ${ip}`)

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled
      },
      tokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Admin login with role verification
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.validated.body
    const ip = req.ip
    const userAgent = req.get('User-Agent')

    const user = await User.findByEmail(email)
    
    if (!user) {
      logSecurityEvent('ADMIN_LOGIN_ATTEMPT_INVALID_EMAIL', { email, ip }, req)
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      })
    }

    // Verify password first
    const isPasswordCorrect = await user.comparePassword(password)
    
    if (!isPasswordCorrect) {
      await user.incLoginAttempts()
      await user.addLoginRecord(ip, userAgent, false)
      
      logSecurityEvent('ADMIN_LOGIN_ATTEMPT_INVALID_PASSWORD', { 
        userId: user._id, 
        email: user.email 
      }, req)
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      })
    }

    // Check admin role
    if (user.role !== 'admin') {
      logSecurityEvent('ADMIN_LOGIN_ATTEMPT_INSUFFICIENT_PRIVILEGES', { 
        userId: user._id, 
        email: user.email,
        actualRole: user.role
      }, req)
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
        timestamp: new Date().toISOString()
      })
    }

    // Check account status
    if (!user.isActive || user.isLocked) {
      logSecurityEvent('ADMIN_LOGIN_ATTEMPT_ACCOUNT_ISSUES', { 
        userId: user._id, 
        email: user.email,
        isActive: user.isActive,
        isLocked: user.isLocked
      }, req)
      
      return res.status(401).json({
        success: false,
        message: 'Account access restricted',
        timestamp: new Date().toISOString()
      })
    }

    // Successful admin login
    await user.resetLoginAttempts()
    await user.addLoginRecord(ip, userAgent, true)

    const tokens = user.generateAuthToken()

    console.log(`Admin logged in: ${user.email} from ${ip}`)
    logSecurityEvent('ADMIN_LOGIN_SUCCESS', { 
      userId: user._id, 
      email: user.email 
    }, req)

    res.json({
      success: true,
      message: 'Admin login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      },
      tokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Vendor login with role verification
const loginVendor = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.validated.body
    const ip = req.ip
    const userAgent = req.get('User-Agent')

    const user = await User.findByEmail(email)
    
    if (!user || !(await user.comparePassword(password))) {
      if (user) {
        await user.incLoginAttempts()
        await user.addLoginRecord(ip, userAgent, false)
      }
      
      logSecurityEvent('VENDOR_LOGIN_ATTEMPT_INVALID_CREDENTIALS', { 
        email,
        userId: user?._id 
      }, req)
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      })
    }

    if (user.role !== 'vendor') {
      logSecurityEvent('VENDOR_LOGIN_ATTEMPT_INSUFFICIENT_PRIVILEGES', { 
        userId: user._id, 
        actualRole: user.role 
      }, req)
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Vendor privileges required.',
        timestamp: new Date().toISOString()
      })
    }

    if (!user.isActive || user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Account access restricted',
        timestamp: new Date().toISOString()
      })
    }

    await user.resetLoginAttempts()
    await user.addLoginRecord(ip, userAgent, true)

    const tokens = user.generateAuthToken()

    res.json({
      success: true,
      message: 'Vendor login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        vendorInfo: user.vendorInfo
      },
      tokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Vendor login error:', error)
    res.status(500).json({
      success: false,
      message: 'Vendor login failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Get current user profile
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -twoFactorSecret')
  
  res.json({
    success: true,
    user,
    timestamp: new Date().toISOString()
  })
})

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, phone, marketingConsent } = req.body
    const user = await User.findById(req.user._id)

    if (name) user.name = name
    if (phone !== undefined) user.phone = phone
    if (marketingConsent !== undefined) user.marketingConsent = marketingConsent

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        marketingConsent: user.marketingConsent
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Change password
const changePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.validated.body
    const user = await User.findById(req.user._id)

    // Verify current password
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword)
    
    if (!isCurrentPasswordCorrect) {
      logSecurityEvent('PASSWORD_CHANGE_INVALID_CURRENT', { 
        userId: user._id 
      }, req)
      
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        timestamp: new Date().toISOString()
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    logSecurityEvent('PASSWORD_CHANGED', { userId: user._id }, req)

    res.json({
      success: true,
      message: 'Password changed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Password change error:', error)
    res.status(500).json({
      success: false,
      message: 'Password change failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Request password reset
const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findByEmail(email)

    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        timestamp: new Date().toISOString()
      })
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    // TODO: Send password reset email
    // await sendPasswordResetEmail(user.email, resetToken)

    console.log(`Password reset requested for: ${user.email}`)
    logSecurityEvent('PASSWORD_RESET_REQUESTED', { userId: user._id }, req)

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    res.status(500).json({
      success: false,
      message: 'Password reset request failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Reset password with token
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token, password } = req.body
    const user = await User.findByResetToken(token)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
        timestamp: new Date().toISOString()
      })
    }

    // Reset password and clear reset token
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    logSecurityEvent('PASSWORD_RESET_COMPLETED', { userId: user._id }, req)

    res.json({
      success: true,
      message: 'Password reset successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Verify email
const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params
    const user = await User.findByVerificationToken(token)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
        timestamp: new Date().toISOString()
      })
    }

    // Verify email and clear verification token
    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    console.log(`Email verified for user: ${user.email}`)
    logSecurityEvent('EMAIL_VERIFIED', { userId: user._id }, req)

    res.json({
      success: true,
      message: 'Email verified successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      timestamp: new Date().toISOString()
    })
  }
})

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  loginVendor,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail
}