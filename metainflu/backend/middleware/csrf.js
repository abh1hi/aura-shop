/*
 * Custom CSRF Protection Middleware
 * Replaces deprecated csurf package with modern implementation
 */

const crypto = require('crypto')
const { promisify } = require('util')

// Generate cryptographically secure random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Verify CSRF token
const verifyToken = (sessionToken, requestToken) => {
  if (!sessionToken || !requestToken) {
    return false
  }
  
  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(sessionToken, 'hex'),
    Buffer.from(requestToken, 'hex')
  )
}

// Store CSRF tokens (in production, use Redis or database)
const tokenStore = new Map()

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now()
  for (const [token, data] of tokenStore.entries()) {
    if (now - data.timestamp > 3600000) { // 1 hour expiry
      tokenStore.delete(token)
    }
  }
}, 300000) // Clean every 5 minutes

// CSRF protection middleware
const csrfProtection = (options = {}) => {
  const {
    ignoreMethods = ['GET', 'HEAD', 'OPTIONS'],
    tokenHeader = 'x-csrf-token',
    cookieName = '_csrf',
    sessionKey = 'csrfToken'
  } = options

  return (req, res, next) => {
    // Skip CSRF check for safe methods
    if (ignoreMethods.includes(req.method.toUpperCase())) {
      return next()
    }

    // Get token from header or body
    const requestToken = req.get(tokenHeader) || req.body._csrf
    
    // Get session token (from session or cookie)
    const sessionToken = req.session?.[sessionKey] || req.cookies?.[cookieName]

    if (!verifyToken(sessionToken, requestToken)) {
      console.warn(`CSRF token mismatch for ${req.method} ${req.path} from ${req.ip}`)
      
      return res.status(403).json({
        success: false,
        message: 'Invalid CSRF token',
        error: 'CSRF_TOKEN_MISMATCH',
        timestamp: new Date().toISOString()
      })
    }

    next()
  }
}

// Generate and set CSRF token
const generateCSRFToken = (req, res, next) => {
  const token = generateToken()
  const timestamp = Date.now()
  
  // Store token with timestamp
  tokenStore.set(token, { timestamp })
  
  // Set token in session or cookie
  if (req.session) {
    req.session.csrfToken = token
  } else {
    res.cookie('_csrf', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    })
  }
  
  // Add method to get token for client
  req.csrfToken = () => token
  
  next()
}

// CSRF token endpoint handler
const csrfTokenHandler = (req, res) => {
  const token = req.csrfToken ? req.csrfToken() : generateToken()
  
  // If no token exists, generate one
  if (!req.csrfToken) {
    const timestamp = Date.now()
    tokenStore.set(token, { timestamp })
    
    if (req.session) {
      req.session.csrfToken = token
    } else {
      res.cookie('_csrf', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      })
    }
  }
  
  res.json({
    success: true,
    csrfToken: token,
    timestamp: new Date().toISOString()
  })
}

// Double-submit cookie pattern (alternative approach)
const doubleSubmitCookie = (options = {}) => {
  const {
    cookieName = '_csrf',
    headerName = 'x-csrf-token',
    ignoreMethods = ['GET', 'HEAD', 'OPTIONS']
  } = options

  return (req, res, next) => {
    // Skip for safe methods
    if (ignoreMethods.includes(req.method.toUpperCase())) {
      return next()
    }

    const cookieToken = req.cookies?.[cookieName]
    const headerToken = req.get(headerName) || req.body._csrf

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      console.warn(`CSRF double-submit validation failed for ${req.method} ${req.path} from ${req.ip}`)
      
      return res.status(403).json({
        success: false,
        message: 'CSRF token validation failed',
        error: 'CSRF_VALIDATION_FAILED',
        timestamp: new Date().toISOString()
      })
    }

    next()
  }
}

// Set CSRF cookie for double-submit pattern
const setCSRFCookie = (req, res, next) => {
  const token = generateToken()
  
  // Set both httpOnly cookie and expose token for client
  res.cookie('_csrf', token, {
    httpOnly: false, // Allow client to read for double-submit
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000
  })
  
  req.csrfToken = () => token
  next()
}

// Enhanced CSRF protection with rate limiting
const enhancedCSRFProtection = (options = {}) => {
  const {
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000, // 15 minutes
    blockDuration = 30 * 60 * 1000 // 30 minutes
  } = options
  
  const failureMap = new Map()
  
  return (req, res, next) => {
    const clientId = req.ip + (req.user?.id || '')
    const now = Date.now()
    
    // Clean up old entries
    for (const [id, data] of failureMap.entries()) {
      if (now - data.lastAttempt > windowMs) {
        failureMap.delete(id)
      }
    }
    
    const clientData = failureMap.get(clientId) || { attempts: 0, lastAttempt: now }
    
    // Check if client is blocked
    if (clientData.blocked && now - clientData.blockedAt < blockDuration) {
      return res.status(429).json({
        success: false,
        message: 'Too many CSRF failures. Temporarily blocked.',
        error: 'CSRF_RATE_LIMITED',
        retryAfter: Math.ceil((blockDuration - (now - clientData.blockedAt)) / 1000),
        timestamp: new Date().toISOString()
      })
    }
    
    // Apply CSRF protection
    csrfProtection()(req, res, (err) => {
      if (err) {
        // Increment failure count
        clientData.attempts++
        clientData.lastAttempt = now
        
        if (clientData.attempts >= maxAttempts) {
          clientData.blocked = true
          clientData.blockedAt = now
          
          console.warn(`CSRF rate limit exceeded for client: ${clientId}`)
        }
        
        failureMap.set(clientId, clientData)
        return next(err)
      }
      
      // Reset on success
      if (failureMap.has(clientId)) {
        failureMap.delete(clientId)
      }
      
      next()
    })
  }
}

module.exports = {
  csrfProtection,
  generateCSRFToken,
  csrfTokenHandler,
  doubleSubmitCookie,
  setCSRFCookie,
  enhancedCSRFProtection,
  generateToken,
  verifyToken
}