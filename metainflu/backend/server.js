/*
  File: metainflu/backend/server.js
  Purpose: The main entry point for the Node.js Express backend.
  It sets up middleware, connects to the database, and registers all API routes,
  including the new vendor routes.
*/
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const vendorRoutes = require('./routes/vendorRoutes'); // Import vendor routes
const homeRoutes = require('./routes/homeRoutes'); // Import home routes

const { errorHandler } = require('./middleware/errorMiddleware');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI; 

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    // Local development URLs
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    // DevTunnels
    'https://3czzqk3l-5174.use2.devtunnels.ms',
    'https://3czzqk3l-5173.use2.devtunnels.ms',
    // GitHub Codespaces URLs (current and potential variations)
    'https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev',
    'https://improved-goggles-v6pqpqrvvj46cwqr7-5174.app.github.dev',
    // Allow any GitHub Codespaces domain pattern
    /.*\.app\.github\.dev$/,
    /.*\.githubpreview\.dev$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false // Handle preflight requests automatically
};

// Apply CORS middleware FIRST, before any other middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  next();
});

// Database Connection
// NOTE: Make sure your MONGO_URI environment variable is set for the connection to succeed.
mongoose.connect(mongoURI || 'mongodb://localhost:27017/aura-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Health check route (before auth routes)
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'AURA Shop API is running!', 
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// API status route
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'AURA Shop API v1.0', 
    status: 'operational',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      cart: '/api/cart',
      admin: '/api/admin',
      vendor: '/api/vendor',
      home: '/api/home'
    }
  });
});

// Routes - Order matters! More specific routes first
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/vendor', vendorRoutes); // Use new vendor routes
app.use('/api/home', homeRoutes);

// Test protected route
app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({ 
    message: `Hello, ${req.user.name}! Access granted.`,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Server URL: http://localhost:${port}`);
  console.log(`🌍 CORS enabled for multiple origins`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📝 MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;