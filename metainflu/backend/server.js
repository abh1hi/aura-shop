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
const parentCategoryRoutes = require('./routes/parentCategoryRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI; 

// Middleware - Updated CORS for Android Capacitor support
const corsOptions = {
  origin: [
    // Development web servers
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'https://3czzqk3l-5174.use2.devtunnels.ms',
    'https://3czzqk3l-5173.use2.devtunnels.ms',
    'https://automatic-sniffle-976j6j599wgvh9vqw-5173.app.github.dev',
    
    // Capacitor Android/iOS - localhost with https
    'https://localhost',
    'http://localhost',
    'capacitor://localhost',
    'ionic://localhost',
    
    // Allow any localhost with different ports for development
    /^http:\/\/localhost:[0-9]+$/,
    /^https:\/\/localhost:[0-9]+$/,
    /^http:\/\/127\.0\.0\.1:[0-9]+$/,
    /^https:\/\/127\.0\.0\.1:[0-9]+$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
};

app.use(cors(corsOptions));

// Additional headers for Capacitor compatibility
app.use((req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).json({});
  }
  
  // Set headers for all requests
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Log requests for debugging
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.headers.origin || 'unknown origin'}`);
  
  next();
});

app.use(express.json());

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/vendor', vendorRoutes); // Use new vendor routes
app.use('/api/home', homeRoutes);
app.use('/api/parent-categories', parentCategoryRoutes);

// Test protected route
app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({ message: `Hello, ${req.user.name}! Access granted.` });
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Aura Shop API is running...',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info route for debugging
app.get('/api/info', (req, res) => {
  res.status(200).json({
    message: 'Aura Shop API Information',
    version: '1.0.0',
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
    cors: {
      enabled: true,
      allowsCredentials: true,
      supportsMobile: true
    }
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 Mobile apps can connect via: http://YOUR_IP:${port}`);
  console.log(`🌐 Web apps can connect via: http://localhost:${port}`);
});
