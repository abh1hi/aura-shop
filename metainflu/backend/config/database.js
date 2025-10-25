/*
 * Enhanced Database Configuration with Security Features
 * Includes connection pooling, retry logic, and security settings
 */

const mongoose = require('mongoose')
const winston = require('winston')

// Database configuration
const dbConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/aura-shop',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
    serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT) || 5000,
    socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true,
    w: 'majority',
    // Security options for production
    ssl: process.env.NODE_ENV === 'production',
    authSource: process.env.DB_AUTH_SOURCE || 'admin'
  }
}

// Enhanced connection function with retry logic
const connectDB = async (retries = 5) => {
  try {
    // Enable mongoose debugging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true)
    }

    // Enable built-in sanitization
    mongoose.set('sanitizeFilter', true)
    
    // Connect to MongoDB
    const conn = await mongoose.connect(dbConfig.uri, dbConfig.options)
    
    // Setup event listeners
    setupConnectionListeners()
    
    // Create security indexes
    await createSecurityIndexes()
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
    return conn
  } catch (error) {
    console.error(`❌ Database connection failed (${retries} retries left):`, error.message)
    
    if (retries > 0) {
      console.log(`🔄 Retrying connection in 5 seconds...`)
      await new Promise(resolve => setTimeout(resolve, 5000))
      return connectDB(retries - 1)
    }
    
    console.error('💥 All connection attempts failed. Exiting...')
    process.exit(1)
  }
}

// Setup connection event listeners
const setupConnectionListeners = () => {
  mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB')
  })
  
  mongoose.connection.on('error', (err) => {
    console.error('🚨 Mongoose connection error:', err)
  })
  
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected from MongoDB')
  })
  
  mongoose.connection.on('reconnected', () => {
    console.log('🔄 Mongoose reconnected to MongoDB')
  })
  
  mongoose.connection.on('reconnectFailed', () => {
    console.error('💥 Mongoose failed to reconnect to MongoDB')
  })
}

// Create security and performance indexes
const createSecurityIndexes = async () => {
  try {
    const db = mongoose.connection.db
    
    // User collection indexes
    await db.collection('users').createIndex(
      { email: 1 }, 
      { unique: true, background: true }
    )
    
    await db.collection('users').createIndex(
      { loginAttempts: 1, lockUntil: 1 }, 
      { background: true, sparse: true }
    )
    
    await db.collection('users').createIndex(
      { role: 1 }, 
      { background: true }
    )
    
    await db.collection('users').createIndex(
      { createdAt: -1 }, 
      { background: true }
    )
    
    // Product collection indexes
    await db.collection('products').createIndex(
      { user: 1, categories: 1 }, 
      { background: true }
    )
    
    await db.collection('products').createIndex(
      { name: 'text', description: 'text', brand: 'text' }, 
      { background: true }
    )
    
    await db.collection('products').createIndex(
      { 'variants.sku': 1 }, 
      { 
        unique: true, 
        background: true,
        partialFilterExpression: { 
          'variants.sku': { $exists: true, $type: 'string', $ne: '' } 
        } 
      }
    )
    
    await db.collection('products').createIndex(
      { createdAt: -1 }, 
      { background: true }
    )
    
    // Order collection indexes
    await db.collection('orders').createIndex(
      { user: 1 }, 
      { background: true }
    )
    
    await db.collection('orders').createIndex(
      { user: 1, createdAt: -1 }, 
      { background: true }
    )
    
    await db.collection('orders').createIndex(
      { status: 1 }, 
      { background: true }
    )
    
    // Cart collection indexes
    await db.collection('carts').createIndex(
      { user: 1 }, 
      { unique: true, background: true }
    )
    
    // Category collection indexes
    await db.collection('categories').createIndex(
      { name: 1 }, 
      { unique: true, background: true }
    )
    
    console.log('✅ Security and performance indexes created successfully')
  } catch (error) {
    console.error('❌ Index creation failed:', error.message)
  }
}

// Graceful shutdown
const gracefulShutdown = () => {
  mongoose.connection.close(() => {
    console.log('🛑 MongoDB connection closed through app termination')
    process.exit(0)
  })
}

// Handle process termination
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

module.exports = {
  connectDB,
  gracefulShutdown
}