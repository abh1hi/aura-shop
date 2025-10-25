/*
 * Comprehensive Security Middleware
 * Includes rate limiting, CSRF protection, security headers, and more
 */

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')

// Rate limiting configurations
const createRateLimiter = (windowMs, max, message, skipSuccessful = false) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      retryAfter: Math.ceil(windowMs / 1000),
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: skipSuccessful,
    handler: (req, res) => {
      console.log(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`)
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(windowMs / 1000),
        timestamp: new Date().toISOString()
      })
    }
  })
}

// Different rate limiters for different endpoints
const rateLimiters = {
  // General API rate limiting
  general: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests per window
    'Too many requests from this IP, please try again later'
  ),

  // Authentication rate limiting
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 login attempts per window
    'Too many login attempts, please try again later',
    true // Skip successful requests
  ),

  // Registration rate limiting
  registration: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // 3 registrations per hour per IP
    'Too many registration attempts, please try again later'
  ),

  // Password reset rate limiting
  passwordReset: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // 3 password reset attempts per hour
    'Too many password reset attempts, please try again later'
  ),

  // File upload rate limiting
  upload: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    10, // 10 uploads per window
    'Too many file upload attempts, please try again later'
  )
}

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Remove in production if possible
        "'unsafe-eval'" // Remove in production if possible
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      connectSrc: [
        "'self'",
        process.env.FRONTEND_URL || "http://localhost:5173"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "no-referrer" },
  hsts: {
    maxAge: parseInt(process.env.HSTS_MAX_AGE) || 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
})

// CORS configuration
const corsConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5174'
    ]
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log(`CORS blocked request from origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
}

// CSRF protection configuration
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
})

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    }
    
    if (req.user) {
      logData.userId = req.user._id
      logData.userRole = req.user.role
    }
    
    // Log based on status code
    if (res.statusCode >= 400) {
      console.error('Request Error:', logData)
    } else {
      console.log('Request:', logData)
    }
  })
  
  next()
}

// Security event logger
const logSecurityEvent = (event, details, req) => {
  const securityLog = {
    event,
    details,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?._id,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  }
  
  console.warn('SECURITY EVENT:', securityLog)
  
  // In production, send to security monitoring service
  // Example: Sentry, DataDog, etc.
}

// IP whitelist/blacklist middleware
const ipFilter = (req, res, next) => {
  const clientIP = req.ip
  
  // Blacklisted IPs (in production, store in database or Redis)
  const blacklistedIPs = process.env.BLACKLISTED_IPS?.split(',') || []
  
  if (blacklistedIPs.includes(clientIP)) {
    logSecurityEvent('BLOCKED_IP_ACCESS', { ip: clientIP }, req)
    return res.status(403).json({
      success: false,
      message: 'Access denied',
      timestamp: new Date().toISOString()
    })
  }
  
  next()
}

// Request size limiter
const requestSizeLimiter = (limit = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || 0)
    const maxSize = parseInt(limit) * 1024 * 1024 // Convert MB to bytes
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        message: `Request entity too large. Maximum allowed size: ${limit}`,
        timestamp: new Date().toISOString()
      })
    }
    
    next()
  }
}

// Security middleware stack
const securityMiddleware = [
  // Basic security headers
  securityHeaders,
  
  // Compression
  compression(),
  
  // Cookie parser (required for CSRF)
  cookieParser(),
  
  // HTTP Parameter Pollution protection
  hpp({
    whitelist: ['tags', 'categories'] // Allow arrays for these parameters
  }),
  
  // Request logging
  requestLogger,
  
  // IP filtering
  ipFilter,
  
  // Request size limiting
  requestSizeLimiter('10mb')
]

// Apply rate limiting based on route
const applyRateLimit = (type = 'general') => {
  return rateLimiters[type] || rateLimiters.general
}

// CSRF token endpoint
const csrfTokenHandler = (req, res) => {
  res.json({
    success: true,
    csrfToken: req.csrfToken(),
    timestamp: new Date().toISOString()
  })
}

// Security headers for API responses
const apiSecurityHeaders = (req, res, next) => {
  // Additional security headers for API
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  
  next()
}

module.exports = {
  securityMiddleware,
  rateLimiters,
  applyRateLimit,
  corsConfig,
  csrfProtection,
  csrfTokenHandler,
  logSecurityEvent,
  apiSecurityHeaders,
  requestSizeLimiter
}