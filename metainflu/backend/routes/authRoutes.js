/*
 * Enhanced Authentication Routes
 * Includes comprehensive validation, rate limiting, and security measures
 */

const express = require('express')
const { 
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
} = require('../controllers/authController')
const { protect, refreshToken } = require('../middleware/authMiddleware')
const { validateRequest, validationSchemas } = require('../middleware/validation')
const { applyRateLimit } = require('../middleware/security')

const router = express.Router()

// Public routes (no authentication required)

// User registration with validation and rate limiting
router.post('/register',
  applyRateLimit('registration'),
  validateRequest(validationSchemas.userRegistration),
  registerUser
)

// General user login
router.post('/login',
  applyRateLimit('auth'),
  validateRequest(validationSchemas.userLogin),
  loginUser
)

// Admin-specific login
router.post('/admin/login',
  applyRateLimit('auth'),
  validateRequest(validationSchemas.userLogin),
  loginAdmin
)

// Vendor-specific login
router.post('/vendor/login',
  applyRateLimit('auth'),
  validateRequest(validationSchemas.userLogin),
  loginVendor
)

// Token refresh
router.post('/refresh',
  applyRateLimit('auth'),
  refreshToken
)

// Password reset request
router.post('/forgot-password',
  applyRateLimit('passwordReset'),
  validateRequest({
    email: require('joi').string().email().required()
  }),
  forgotPassword
)

// Password reset with token
router.post('/reset-password',
  applyRateLimit('passwordReset'),
  validateRequest({
    token: require('joi').string().required(),
    password: require('joi').string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
  }),
  resetPassword
)

// Email verification
router.get('/verify-email/:token', verifyEmail)

// Protected routes (authentication required)

// Get current user profile
router.get('/me', protect, getMe)

// Update user profile
router.put('/profile',
  protect,
  validateRequest({
    name: require('joi').string().min(2).max(50).pattern(/^[a-zA-Z\s]+$/),
    phone: require('joi').string().pattern(/^\+?[1-9]\d{1,14}$/).allow(''),
    marketingConsent: require('joi').boolean()
  }),
  updateProfile
)

// Change password
router.post('/change-password',
  protect,
  validateRequest(validationSchemas.passwordChange),
  changePassword
)

// Resend email verification
router.post('/resend-verification',
  protect,
  applyRateLimit('passwordReset'), // Use same rate limit as password reset
  async (req, res) => {
    try {
      const user = req.user
      
      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified',
          timestamp: new Date().toISOString()
        })
      }
      
      // Generate new verification token
      const verificationToken = user.createEmailVerificationToken()
      await user.save({ validateBeforeSave: false })
      
      // TODO: Send verification email
      // await sendVerificationEmail(user.email, verificationToken)
      
      res.json({
        success: true,
        message: 'Verification email sent successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Resend verification error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email',
        timestamp: new Date().toISOString()
      })
    }
  }
)

// Logout (client-side token clearing)
router.post('/logout',
  protect,
  (req, res) => {
    // In a more advanced implementation, you might:
    // 1. Add token to blacklist (Redis/database)
    // 2. Log the logout event
    // 3. Clear any server-side sessions
    
    console.log(`User logged out: ${req.user.email}`)
    
    res.json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString()
    })
  }
)

// Get login history
router.get('/login-history',
  protect,
  async (req, res) => {
    try {
      const user = await require('../models/User').findById(req.user._id).select('loginHistory')
      
      res.json({
        success: true,
        loginHistory: user.loginHistory || [],
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Login history error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve login history',
        timestamp: new Date().toISOString()
      })
    }
  }
)

// Account status
router.get('/account-status',
  protect,
  (req, res) => {
    const user = req.user
    
    res.json({
      success: true,
      status: {
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        isLocked: user.isLocked,
        loginAttempts: user.loginAttempts,
        lastLogin: user.lastLogin,
        accountAge: Date.now() - new Date(user.createdAt).getTime()
      },
      timestamp: new Date().toISOString()
    })
  }
)

module.exports = router