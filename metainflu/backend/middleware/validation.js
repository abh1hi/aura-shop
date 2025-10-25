/*
 * Comprehensive Validation Middleware
 * Provides input validation, sanitization, and security checks
 */

const Joi = require('joi')
const validator = require('validator')
const mongoSanitize = require('express-mongo-sanitize')

// Validation middleware factory
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    })

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
        type: detail.type,
        value: detail.context?.value
      }))

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorDetails,
        timestamp: new Date().toISOString()
      })
    }

    req.validated = req.validated || {}
    req.validated[property] = value
    next()
  }
}

// Advanced sanitization middleware
const advancedSanitize = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const key in obj) {
        // Remove MongoDB operators and dangerous keys
        if (key.startsWith('$') || key.includes('.') || key.includes('__proto__')) {
          delete obj[key]
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key])
        } else if (typeof obj[key] === 'string') {
          // Escape HTML and remove potentially dangerous characters
          obj[key] = validator.escape(obj[key])
          obj[key] = obj[key].replace(/[<>"']/g, '')
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => sanitizeObject(item))
    }
    return obj
  }

  // Sanitize request data
  if (req.body) req.body = sanitizeObject({ ...req.body })
  if (req.query) req.query = sanitizeObject({ ...req.query })
  if (req.params) req.params = sanitizeObject({ ...req.params })

  // Apply additional MongoDB sanitization
  mongoSanitize()(req, res, next)
}

// Query parameter validation
const validateQueryParams = (req, res, next) => {
  const { page, limit, sort, sortBy, search } = req.query

  // Validate pagination
  if (page && (!validator.isInt(page, { min: 1 }) || parseInt(page) > 1000)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid page parameter. Must be between 1 and 1000',
      timestamp: new Date().toISOString()
    })
  }

  if (limit && (!validator.isInt(limit, { min: 1, max: 100 }))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid limit parameter. Must be between 1 and 100',
      timestamp: new Date().toISOString()
    })
  }

  // Validate sort direction
  if (sort && !['asc', 'desc', '1', '-1'].includes(sort.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid sort parameter. Must be asc, desc, 1, or -1',
      timestamp: new Date().toISOString()
    })
  }

  // Validate sortBy field (whitelist allowed fields)
  const allowedSortFields = [
    'createdAt', 'updatedAt', 'name', 'email', 'price', 
    'stock', 'status', 'role', 'title'
  ]
  
  if (sortBy && !allowedSortFields.includes(sortBy)) {
    return res.status(400).json({
      success: false,
      message: `Invalid sortBy parameter. Allowed fields: ${allowedSortFields.join(', ')}`,
      timestamp: new Date().toISOString()
    })
  }

  // Validate search parameter
  if (search && (search.length > 100 || !/^[\w\s\-_.,!?]+$/.test(search))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid search parameter. Must be alphanumeric with basic punctuation, max 100 characters',
      timestamp: new Date().toISOString()
    })
  }

  next()
}

// Validation schemas
const validationSchemas = {
  // User schemas
  userRegistration: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .trim()
      .messages({
        'string.pattern.base': 'Name can only contain letters and spaces',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters'
      }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'mil'] } })
      .max(100)
      .required()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    role: Joi.string()
      .valid('user', 'vendor')
      .default('user'),
    termsAccepted: Joi.boolean().valid(true).required(),
    privacyPolicyAccepted: Joi.boolean().valid(true).required(),
    marketingConsent: Joi.boolean().default(false)
  }),

  userLogin: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .lowercase()
      .trim(),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  passwordChange: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
  }),

  // Product schemas
  createProduct: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .trim()
      .messages({
        'string.min': 'Product name must be at least 3 characters long',
        'string.max': 'Product name cannot exceed 100 characters'
      }),
    description: Joi.string()
      .max(1000)
      .allow('')
      .trim(),
    brand: Joi.string()
      .max(50)
      .allow('')
      .trim(),
    price: Joi.number()
      .positive()
      .precision(2)
      .max(999999.99)
      .required()
      .messages({
        'number.positive': 'Price must be positive',
        'number.max': 'Price cannot exceed $999,999.99'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .max(999999)
      .required()
      .messages({
        'number.min': 'Stock cannot be negative',
        'number.max': 'Stock cannot exceed 999,999'
      }),
    category: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid category ID format'
      }),
    tags: Joi.array()
      .items(Joi.string().max(50).trim())
      .max(10)
      .default([])
      .messages({
        'array.max': 'Cannot have more than 10 tags'
      }),
    variants: Joi.array()
      .items(
        Joi.object({
          sku: Joi.string()
            .max(50)
            .required()
            .trim(),
          price: Joi.number()
            .positive()
            .precision(2)
            .required(),
          stock: Joi.number()
            .integer()
            .min(0)
            .required(),
          attributes: Joi.object()
            .pattern(Joi.string(), Joi.string().max(100))
            .default({})
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one product variant is required'
      })
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(3).max(100).trim(),
    description: Joi.string().max(1000).allow('').trim(),
    brand: Joi.string().max(50).allow('').trim(),
    price: Joi.number().positive().precision(2).max(999999.99),
    stock: Joi.number().integer().min(0).max(999999),
    category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    tags: Joi.array().items(Joi.string().max(50).trim()).max(10),
    variants: Joi.array().items(
      Joi.object({
        sku: Joi.string().max(50).trim(),
        price: Joi.number().positive().precision(2),
        stock: Joi.number().integer().min(0),
        attributes: Joi.object().pattern(Joi.string(), Joi.string().max(100))
      })
    ).min(1)
  }),

  // Category schemas
  createCategory: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s\-]+$/)
      .required()
      .trim()
      .messages({
        'string.pattern.base': 'Category name can only contain letters, numbers, spaces, and hyphens'
      }),
    description: Joi.string()
      .max(200)
      .allow('')
      .trim(),
    parentId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Invalid parent category ID format'
      }),
    status: Joi.string()
      .valid('active', 'inactive')
      .default('active'),
    slug: Joi.string()
      .pattern(/^[a-z0-9-]+$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens'
      })
  }),

  // Order schemas
  createOrder: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
          quantity: Joi.number().integer().min(1).max(100).required(),
          price: Joi.number().positive().precision(2).required()
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object({
      street: Joi.string().max(100).required().trim(),
      city: Joi.string().max(50).required().trim(),
      state: Joi.string().max(50).required().trim(),
      zipCode: Joi.string().max(20).required().trim(),
      country: Joi.string().max(50).required().trim()
    }).required()
  })
}

module.exports = {
  validateRequest,
  advancedSanitize,
  validateQueryParams,
  validationSchemas
}