/*
 * Enhanced Authentication Middleware
 * Includes JWT verification, role-based access control, and security tracking
 */

const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const { logSecurityEvent } = require('./security')

// JWT verification middleware
const protect = asyncHandler(async (req, res, next) => {
  let token
  
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1]
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, no token provided',
          timestamp: new Date().toISOString()
        })
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password -twoFactorSecret')
      
      if (!user) {
        logSecurityEvent('INVALID_TOKEN_USER_NOT_FOUND', { userId: decoded.id }, req)
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
          timestamp: new Date().toISOString()
        })
      }
      
      // Check if user account is active
      if (!user.isActive) {
        logSecurityEvent('INACTIVE_USER_ACCESS_ATTEMPT', { userId: user._id }, req)
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
          timestamp: new Date().toISOString()
        })
      }
      
      // Check if account is locked
      if (user.isLocked) {
        logSecurityEvent('LOCKED_ACCOUNT_ACCESS_ATTEMPT', { userId: user._id }, req)
        return res.status(401).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts',
          timestamp: new Date().toISOString()
        })
      }
      
      // Check if password was changed after token was issued
      if (user.changedPasswordAfter(decoded.iat)) {
        logSecurityEvent('PASSWORD_CHANGED_AFTER_TOKEN', { userId: user._id }, req)
        return res.status(401).json({
          success: false,
          message: 'Password was changed recently. Please log in again',
          timestamp: new Date().toISOString()
        })
      }
      
      // Attach user to request object
      req.user = user
      
      next()
    } catch (error) {
      console.error('Token verification error:', error)
      
      let message = 'Not authorized, token failed'
      
      if (error.name === 'TokenExpiredError') {
        message = 'Not authorized, token expired'
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Not authorized, invalid token'
        logSecurityEvent('INVALID_JWT_TOKEN', { error: error.message }, req)
      }
      
      return res.status(401).json({
        success: false,
        message,
        timestamp: new Date().toISOString()
      })
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      timestamp: new Date().toISOString()
    })
  }
})

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
        timestamp: new Date().toISOString()
      })
    }
    
    if (!roles.includes(req.user.role)) {
      logSecurityEvent('INSUFFICIENT_PERMISSIONS', {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        attemptedResource: req.path
      }, req)
      
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
        timestamp: new Date().toISOString()
      })
    }
    
    next()
  }
}

// Admin role middleware (backward compatibility)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    logSecurityEvent('ADMIN_ACCESS_DENIED', {
      userId: req.user?._id,
      userRole: req.user?.role
    }, req)
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required',
      timestamp: new Date().toISOString()
    })
  }
}

// Vendor role middleware (backward compatibility)
const vendor = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') {
    next()
  } else {
    logSecurityEvent('VENDOR_ACCESS_DENIED', {
      userId: req.user?._id,
      userRole: req.user?.role
    }, req)
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. Vendor privileges required',
      timestamp: new Date().toISOString()
    })
  }
}

// Resource ownership middleware
const isOwner = (resourceModel, resourceIdParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam]
      const resource = await resourceModel.findById(resourceId)
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
          timestamp: new Date().toISOString()
        })
      }
      
      // Check if user owns the resource or is an admin
      if (resource.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        logSecurityEvent('UNAUTHORIZED_RESOURCE_ACCESS', {
          userId: req.user._id,
          resourceId,
          resourceModel: resourceModel.modelName
        }, req)
        
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource',
          timestamp: new Date().toISOString()
        })
      }
      
      req.resource = resource
      next()
    } catch (error) {
      console.error('Ownership check error:', error)
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership',
        timestamp: new Date().toISOString()
      })
    }
  })
}

// Two-factor authentication middleware
const requireTwoFactor = asyncHandler(async (req, res, next) => {
  if (req.user.twoFactorEnabled && !req.user.twoFactorVerified) {
    return res.status(403).json({
      success: false,
      message: 'Two-factor authentication required',
      requiresTwoFactor: true,
      timestamp: new Date().toISOString()
    })
  }
  
  next()
})

// Refresh token middleware
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required',
      timestamp: new Date().toISOString()
    })
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        timestamp: new Date().toISOString()
      })
    }
    
    // Generate new tokens
    const tokens = user.generateAuthToken()
    
    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    
    logSecurityEvent('INVALID_REFRESH_TOKEN', {
      error: error.message
    }, req)
    
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      timestamp: new Date().toISOString()
    })
  }
})

// Email verification required middleware
const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      requiresEmailVerification: true,
      timestamp: new Date().toISOString()
    })
  }
  
  next()
}

// Account age middleware (require account to be at least X days old)
const requireAccountAge = (minDays = 1) => {
  return (req, res, next) => {
    const accountAge = Date.now() - new Date(req.user.createdAt).getTime()
    const minAge = minDays * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    
    if (accountAge < minAge) {
      return res.status(403).json({
        success: false,
        message: `Account must be at least ${minDays} day(s) old to perform this action`,
        timestamp: new Date().toISOString()
      })
    }
    
    next()
  }
}

module.exports = {
  protect,
  authorize,
  admin,
  vendor,
  isOwner,
  requireTwoFactor,
  refreshToken,
  requireEmailVerification,
  requireAccountAge
}