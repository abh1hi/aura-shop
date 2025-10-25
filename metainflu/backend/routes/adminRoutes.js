/*
 * Enhanced Admin Routes
 * Comprehensive admin endpoints for the Vue.js admin panel integration
 */

const express = require('express')
const asyncHandler = require('express-async-handler')
const { protect, authorize } = require('../middleware/authMiddleware')
const { validateRequest, validationSchemas } = require('../middleware/validation')
const { applyRateLimit } = require('../middleware/security')

// Import models
const Product = require('../models/Product')
const User = require('../models/User')
const Category = require('../models/Category')
const Order = require('../models/Order')

// Import existing admin controller functions
const {
  getUsers,
  getPendingCategories,
  approveCategory,
  rejectCategory,
} = require('../controllers/adminController')

const router = express.Router()

// Apply admin authorization to all routes
router.use(protect)
router.use(authorize('admin'))

// Existing routes (backward compatibility)
router.route('/users').get(getUsers)
router.route('/categories/pending').get(getPendingCategories)
router.route('/categories/:id/approve').put(approveCategory)
router.route('/categories/:id').delete(rejectCategory)

// Dashboard Analytics
router.get('/dashboard', asyncHandler(async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ])
    ])
    
    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
    
    // Monthly sales data
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ])
    
    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentOrders,
        monthlySales: monthlySales.reverse()
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      timestamp: new Date().toISOString()
    })
  }
}))

// Enhanced Products Management
router.get('/products', 
  asyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        category = '',
        status = '',
        sortBy = 'createdAt',
        sort = 'desc'
      } = req.query
      
      const pageNum = parseInt(page)
      const limitNum = parseInt(limit)
      const skip = (pageNum - 1) * limitNum
      
      // Build filter query
      const filter = {}
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ]
      }
      
      if (category) {
        filter.categories = category
      }
      
      if (status) {
        if (status === 'out_of_stock') {
          filter.$or = [{ stock: 0 }, { 'variants.stock': { $lte: 0 } }]
        } else {
          filter.status = status
        }
      }
      
      // Build sort query
      const sortQuery = {}
      sortQuery[sortBy] = sort === 'asc' ? 1 : -1
      
      // Execute query
      const [products, totalCount] = await Promise.all([
        Product.find(filter)
          .populate('categories', 'name')
          .populate('user', 'name email')
          .sort(sortQuery)
          .skip(skip)
          .limit(limitNum),
        Product.countDocuments(filter)
      ])
      
      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
            hasNextPage: pageNum * limitNum < totalCount,
            hasPrevPage: pageNum > 1
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Products fetch error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        timestamp: new Date().toISOString()
      })
    }
  })
)

router.post('/products',
  validateRequest(validationSchemas.createProduct),
  asyncHandler(async (req, res) => {
    try {
      const productData = {
        ...req.validated.body,
        user: req.user._id
      }
      
      const product = new Product(productData)
      await product.save()
      
      await product.populate('categories user', 'name email')
      
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Product creation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        timestamp: new Date().toISOString()
      })
    }
  })
)

router.put('/products/:id',
  validateRequest(validationSchemas.updateProduct),
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        })
      }
      
      // Update product
      Object.assign(product, req.validated.body)
      await product.save()
      
      await product.populate('categories user', 'name email')
      
      res.json({
        success: true,
        data: product,
        message: 'Product updated successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Product update error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        timestamp: new Date().toISOString()
      })
    }
  })
)

router.delete('/products/:id',
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        })
      }
      
      await Product.findByIdAndDelete(req.params.id)
      
      res.json({
        success: true,
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Product deletion error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        timestamp: new Date().toISOString()
      })
    }
  })
)

// Enhanced Categories Management
router.get('/categories', asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ name: 1 })
    
    // Build hierarchy if needed
    const categoryTree = buildCategoryTree(categories)
    
    res.json({
      success: true,
      data: categoryTree,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Categories fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      timestamp: new Date().toISOString()
    })
  }
}))

router.post('/categories',
  validateRequest(validationSchemas.createCategory),
  asyncHandler(async (req, res) => {
    try {
      const category = new Category(req.validated.body)
      await category.save()
      
      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Category creation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        timestamp: new Date().toISOString()
      })
    }
  })
)

// Enhanced Orders Management
router.get('/orders', asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      startDate = '',
      endDate = ''
    } = req.query
    
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum
    
    // Build filter
    const filter = {}
    
    if (status) filter.status = status
    
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }
    
    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter)
    ])
    
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      timestamp: new Date().toISOString()
    })
  }
}))

// Enhanced Analytics endpoint
router.get('/analytics', asyncHandler(async (req, res) => {
  try {
    const { period = '30d' } = req.query
    
    let startDate
    const endDate = new Date()
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
    
    // Sales analytics
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['paid', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ])
    
    // Product performance
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ])
    
    res.json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        salesData,
        topProducts
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      timestamp: new Date().toISOString()
    })
  }
}))

// Enhanced Products Management
router.get('/products', 
  asyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        category = '',
        status = '',
        sortBy = 'createdAt',
        sort = 'desc'
      } = req.query
      
      const pageNum = parseInt(page)
      const limitNum = parseInt(limit)
      const skip = (pageNum - 1) * limitNum
      
      // Build filter query
      const filter = {}
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ]
      }
      
      if (category) {
        filter.categories = category
      }
      
      if (status) {
        if (status === 'out_of_stock') {
          filter.$or = [{ stock: 0 }, { 'variants.stock': { $lte: 0 } }]
        } else {
          filter.status = status
        }
      }
      
      // Build sort query
      const sortQuery = {}
      sortQuery[sortBy] = sort === 'asc' ? 1 : -1
      
      // Execute query
      const [products, totalCount] = await Promise.all([
        Product.find(filter)
          .populate('categories', 'name')
          .populate('user', 'name email')
          .sort(sortQuery)
          .skip(skip)
          .limit(limitNum),
        Product.countDocuments(filter)
      ])
      
      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
            hasNextPage: pageNum * limitNum < totalCount,
            hasPrevPage: pageNum > 1
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Products fetch error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        timestamp: new Date().toISOString()
      })
    }
  })
)

router.post('/products',
  validateRequest(validationSchemas.createProduct),
  asyncHandler(async (req, res) => {
    try {
      const productData = {
        ...req.validated.body,
        user: req.user._id
      }
      
      const product = new Product(productData)
      await product.save()
      
      await product.populate('categories user', 'name email')
      
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Product creation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        timestamp: new Date().toISOString()
      })
    }
  })
)

router.put('/products/:id',
  validateRequest(validationSchemas.updateProduct),
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        })
      }
      
      // Update product
      Object.assign(product, req.validated.body)
      await product.save()
      
      await product.populate('categories user', 'name email')
      
      res.json({
        success: true,
        data: product,
        message: 'Product updated successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Product update error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        timestamp: new Date().toISOString()
      })
    }
  })
)

router.delete('/products/:id',
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        })
      }
      
      await Product.findByIdAndDelete(req.params.id)
      
      res.json({
        success: true,
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Product deletion error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        timestamp: new Date().toISOString()
      })
    }
  })
)

// Enhanced Categories
router.get('/categories', asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ name: 1 })
    
    // Build hierarchy if needed
    const categoryTree = buildCategoryTree(categories)
    
    res.json({
      success: true,
      data: categoryTree,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Categories fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      timestamp: new Date().toISOString()
    })
  }
}))

router.post('/categories',
  validateRequest(validationSchemas.createCategory),
  asyncHandler(async (req, res) => {
    try {
      const category = new Category(req.validated.body)
      await category.save()
      
      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Category creation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        timestamp: new Date().toISOString()
      })
    }
  })
)

// Enhanced User Management
router.get('/users', asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = '',
      status = ''
    } = req.query
    
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum
    
    // Build filter
    const filter = {}
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (role) filter.role = role
    if (status === 'active') filter.isActive = true
    if (status === 'inactive') filter.isActive = false
    
    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .select('-password -twoFactorSecret -passwordResetToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter)
    ])
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Users fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      timestamp: new Date().toISOString()
    })
  }
}))

router.put('/users/:id',
  validateRequest({
    name: require('joi').string().min(2).max(50),
    email: require('joi').string().email(),
    role: require('joi').string().valid('user', 'vendor', 'admin'),
    isActive: require('joi').boolean()
  }),
  asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          timestamp: new Date().toISOString()
        })
      }
      
      // Update user
      Object.assign(user, req.validated.body)
      await user.save()
      
      // Remove sensitive fields
      const userResponse = user.toObject()
      delete userResponse.password
      delete userResponse.twoFactorSecret
      
      res.json({
        success: true,
        data: userResponse,
        message: 'User updated successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('User update error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        timestamp: new Date().toISOString()
      })
    }
  })
)

router.delete('/users/:id',
  asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          timestamp: new Date().toISOString()
        })
      }
      
      // Prevent deleting yourself
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account',
          timestamp: new Date().toISOString()
        })
      }
      
      await User.findByIdAndDelete(req.params.id)
      
      res.json({
        success: true,
        message: 'User deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('User deletion error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        timestamp: new Date().toISOString()
      })
    }
  })
)

// Utility function to build category tree
function buildCategoryTree(categories) {
  const categoryMap = new Map()
  const rootCategories = []
  
  // Create map of all categories
  categories.forEach(category => {
    categoryMap.set(category._id.toString(), {
      ...category.toObject(),
      children: []
    })
  })
  
  // Build tree structure
  categoryMap.forEach(category => {
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId.toString())
      if (parent) {
        parent.children.push(category)
      }
    } else {
      rootCategories.push(category)
    }
  })
  
  return rootCategories
}

module.exports = router