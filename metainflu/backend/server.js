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

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
'http://localhost:5174',
'http://127.0.0.1:5174','https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
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

// Test protected route
app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({ message: `Hello, ${req.user.name}! Access granted.` });
});

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

