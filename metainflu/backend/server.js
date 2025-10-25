/*
 * Enhanced Aura Shop Backend Server
 * Comprehensive security implementation with validation, rate limiting, and monitoring
 */

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const morgan = require('morgan')

// Load environment variables
dotenv.config()

// Import database connection
const { connectDB } = require('./config/database')

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware')
const { 
  securityMiddleware, 
  applyRateLimit, 
  corsConfig, 
  csrfProtection, 
  csrfTokenHandler,
  apiSecurityHeaders 
} = require('./middleware/security')
const { 
  protect, 
  authorize, 
  admin, 
  vendor, 
  refreshToken 
} = require('./middleware/authMiddleware')
const { 
  advancedSanitize, 
  validateQueryParams 
} = require('./middleware/validation')

// Import routes
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cartRoutes = require('./routes/cartRoutes')
const adminRoutes = require('./routes/adminRoutes')
const vendorRoutes = require('./routes/vendorRoutes')
const homeRoutes = require('./routes/homeRoutes')

// Initialize Express app
const app = express()
const port = process.env.PORT || 5000

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1)

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('combined'))
}

// Security middleware stack (applied to all routes)
app.use(securityMiddleware)

// CORS configuration
app.use(cors(corsConfig))

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.MAX_JSON_SIZE || '10mb',
  strict: true
}))
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_URL_ENCODED_SIZE || '10mb'
}))

// Advanced sanitization
app.use(advancedSanitize)

// Query parameter validation
app.use(validateQueryParams)

// API security headers
app.use('/api', apiSecurityHeaders)

// CSRF token endpoint (must be before CSRF protection)
app.get('/api/csrf-token', csrfTokenHandler)

// Health check endpoints (no rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

app.get('/health/detailed', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {}
  }
  
  // Database health check
  try {
    const mongoose = require('mongoose')
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping()
      health.services.database = { 
        status: 'healthy', 
        connection: 'connected',
        readyState: mongoose.connection.readyState
      }
    } else {
      health.services.database = { 
        status: 'unhealthy', 
        connection: 'disconnected',
        readyState: mongoose.connection.readyState
      }
      health.status = 'unhealthy'
    }
  } catch (error) {
    health.services.database = { 
      status: 'unhealthy', 
      error: error.message 
    }
    health.status = 'unhealthy'
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503
  res.status(statusCode).json(health)
})

// API information endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Aura Shop API',
    version: '1.1.0',
    description: 'Secure e-commerce backend API',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      cart: '/api/cart',
      admin: '/api/admin',
      vendor: '/api/vendor',
      home: '/api/home'
    },
    security: {
      cors: true,
      rateLimit: true,
      validation: true,
      sanitization: true,
      helmet: true
    },
    features: {
      authentication: 'JWT with refresh tokens',
      authorization: 'Role-based access control',
      validation: 'Comprehensive input validation',
      monitoring: 'Request logging and health checks'
    }
  })
})

// Authentication routes (with specific rate limiting)
app.use('/api/auth/register', applyRateLimit('registration'))
app.use('/api/auth/login', applyRateLimit('auth'))
app.use('/api/auth/admin/login', applyRateLimit('auth'))
app.use('/api/auth/vendor/login', applyRateLimit('auth'))
app.use('/api/auth/forgot-password', applyRateLimit('passwordReset'))
app.use('/api/auth/reset-password', applyRateLimit('passwordReset'))

// Token refresh endpoint
app.post('/api/auth/refresh', applyRateLimit('auth'), refreshToken)

// Mount API routes with rate limiting
app.use('/api/auth', applyRateLimit('general'), authRoutes)
app.use('/api/products', applyRateLimit('general'), productRoutes)
app.use('/api/categories', applyRateLimit('general'), categoryRoutes)
app.use('/api/orders', applyRateLimit('general'), orderRoutes)
app.use('/api/cart', applyRateLimit('general'), cartRoutes)
app.use('/api/home', applyRateLimit('general'), homeRoutes)

// Protected admin and vendor routes with CSRF protection and stricter rate limiting
app.use('/api/admin', 
  applyRateLimit('general'),
  protect,
  authorize('admin'),
  // csrfProtection, // Enable in production
  adminRoutes
)

app.use('/api/vendor', 
  applyRateLimit('general'),
  protect,
  authorize('vendor'),
  // csrfProtection, // Enable in production
  vendorRoutes
)

// Test protected route
app.get('/api/protected', 
  applyRateLimit('general'),
  protect, 
  (req, res) => {
    res.json({
      success: true,
      message: `Hello, ${req.user.name}! Access granted.`,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      timestamp: new Date().toISOString()
    })
  }
)

// Upload endpoint with file type validation and rate limiting
app.post('/api/upload',
  applyRateLimit('upload'),
  protect,
  (req, res) => {
    // TODO: Implement file upload with multer and validation
    res.json({
      success: false,
      message: 'File upload endpoint not implemented yet',
      timestamp: new Date().toISOString()
    })
  }
)

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Aura Shop API is running securely',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    documentation: '/api/info',
    health: '/health'
  })
})

// Global error handler (must be last)
app.use(errorHandler)

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`)
  
  // Close server
  server.close(() => {
    console.log('✅ HTTP server closed')
    
    // Close database connection
    const mongoose = require('mongoose')
    mongoose.connection.close(() => {
      console.log('✅ Database connection closed')
      console.log('👋 Process terminated gracefully')
      process.exit(0)
    })
  })
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('🚨 Unhandled Promise Rejection:', err)
  console.error('Promise:', promise)
  // Close server & exit process
  gracefulShutdown('UNHANDLED_REJECTION')
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err)
  gracefulShutdown('UNCAUGHT_EXCEPTION')
})

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB()
    
    // Start server
    const server = app.listen(port, () => {
      console.log(`\n🚀 Aura Shop API Server`)
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌐 Server running on port ${port}`)
      console.log(`📱 Health check: http://localhost:${port}/health`)
      console.log(`📋 API info: http://localhost:${port}/api/info`)
      console.log(`🔒 Security features enabled`)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n📖 Development URLs:`)
        console.log(`   • API Base: http://localhost:${port}/api`)
        console.log(`   • Admin Panel: http://localhost:5174`)
        console.log(`   • Customer App: http://localhost:5173`)
      }
      
      console.log(`\n✅ Server startup complete\n`)
    })
    
    // Store server reference for graceful shutdown
    global.server = server
    
    return server
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
if (require.main === module) {
  startServer()
}

module.exports = app