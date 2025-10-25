/*
 * Validation Composables
 * Provides reusable validation logic for Vue components
 */

import { ref, reactive } from 'vue'
import Joi from 'joi'
import DOMPurify from 'dompurify'

// Base validation composable
export function useValidation() {
  const errors = ref([])
  const isValidating = ref(false)

  const validateWithSchema = (data, schema, options = {}) => {
    isValidating.value = true
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      ...options
    })

    if (error) {
      errors.value = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
        type: detail.type,
        value: detail.context?.value
      }))
      isValidating.value = false
      return false
    }

    errors.value = []
    isValidating.value = false
    return value
  }

  const getFieldError = (field) => {
    return errors.value?.find(error => error.field === field)?.message
  }

  const clearFieldError = (field) => {
    if (errors.value) {
      errors.value = errors.value.filter(error => error.field !== field)
    }
  }

  const clearAllErrors = () => {
    errors.value = []
  }

  const hasErrors = () => {
    return errors.value.length > 0
  }

  return {
    errors,
    isValidating,
    validateWithSchema,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors
  }
}

// Product validation
export function useProductValidation() {
  const { errors, validateWithSchema, getFieldError, clearFieldError, clearAllErrors, hasErrors } = useValidation()

  const productSchema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s\-_.'"]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Product name contains invalid characters',
        'string.min': 'Product name must be at least 3 characters',
        'string.max': 'Product name cannot exceed 100 characters',
        'any.required': 'Product name is required'
      }),
    description: Joi.string()
      .max(1000)
      .allow('')
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    brand: Joi.string()
      .max(50)
      .allow('')
      .pattern(/^[a-zA-Z0-9\s\-_.'"]*$/)
      .messages({
        'string.pattern.base': 'Brand name contains invalid characters',
        'string.max': 'Brand name cannot exceed 50 characters'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .max(999999.99)
      .required()
      .messages({
        'number.positive': 'Price must be positive',
        'number.max': 'Price cannot exceed $999,999.99',
        'any.required': 'Price is required'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .max(999999)
      .required()
      .messages({
        'number.min': 'Stock cannot be negative',
        'number.max': 'Stock cannot exceed 999,999',
        'any.required': 'Stock quantity is required'
      }),
    category: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please select a valid category',
        'any.required': 'Category is required'
      }),
    tags: Joi.array()
      .items(Joi.string().max(50).pattern(/^[a-zA-Z0-9\s\-_]+$/))
      .max(10)
      .default([])
      .messages({
        'array.max': 'Cannot have more than 10 tags'
      })
  })

  const validateProduct = (productData) => {
    return validateWithSchema(productData, productSchema)
  }

  const validateProductField = (field, value) => {
    const fieldSchema = productSchema.extract(field)
    if (!fieldSchema) return true

    const { error } = fieldSchema.validate(value)
    
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, '')
      const existingErrorIndex = errors.value.findIndex(e => e.field === field)
      
      if (existingErrorIndex >= 0) {
        errors.value[existingErrorIndex].message = errorMessage
      } else {
        errors.value.push({ field, message: errorMessage, type: error.details[0].type })
      }
      return false
    }

    clearFieldError(field)
    return true
  }

  return {
    errors,
    validateProduct,
    validateProductField,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors
  }
}

// Category validation
export function useCategoryValidation() {
  const { errors, validateWithSchema, getFieldError, clearFieldError, clearAllErrors, hasErrors } = useValidation()

  const categorySchema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s\-]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Category name can only contain letters, numbers, spaces, and hyphens',
        'string.min': 'Category name must be at least 2 characters',
        'string.max': 'Category name cannot exceed 50 characters',
        'any.required': 'Category name is required'
      }),
    description: Joi.string()
      .max(200)
      .allow('')
      .messages({
        'string.max': 'Description cannot exceed 200 characters'
      }),
    parentId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Invalid parent category selection'
      }),
    status: Joi.string()
      .valid('active', 'inactive')
      .default('active')
      .messages({
        'any.only': 'Status must be either active or inactive'
      }),
    slug: Joi.string()
      .pattern(/^[a-z0-9-]*$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens'
      })
  })

  const validateCategory = (categoryData) => {
    return validateWithSchema(categoryData, categorySchema)
  }

  const generateSlug = (name) => {
    if (!name) return ''
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  return {
    errors,
    validateCategory,
    generateSlug,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors
  }
}

// User validation
export function useUserValidation() {
  const { errors, validateWithSchema, getFieldError, clearFieldError, clearAllErrors, hasErrors } = useValidation()

  const userSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Name can only contain letters and spaces',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .max(100)
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'string.max': 'Email cannot exceed 100 characters',
        'any.required': 'Email is required'
      }),
    role: Joi.string()
      .valid('user', 'vendor', 'admin')
      .required()
      .messages({
        'any.only': 'Please select a valid role',
        'any.required': 'Role is required'
      }),
    isActive: Joi.boolean().default(true)
  })

  const validateUser = (userData) => {
    return validateWithSchema(userData, userSchema)
  }

  return {
    errors,
    validateUser,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors
  }
}

// Authentication validation
export function useAuthValidation() {
  const { errors, validateWithSchema, getFieldError, clearFieldError, clearAllErrors, hasErrors } = useValidation()

  const loginSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(1)
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })

  const registrationSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Name can only contain letters and spaces',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
        'any.required': 'Password is required'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your password'
      })
  })

  const validateLogin = (credentials) => {
    return validateWithSchema(credentials, loginSchema)
  }

  const validateRegistration = (userData) => {
    return validateWithSchema(userData, registrationSchema)
  }

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    }

    const score = Object.values(checks).filter(Boolean).length
    const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong'

    return {
      score,
      strength,
      checks,
      isValid: score === 5
    }
  }

  return {
    errors,
    validateLogin,
    validateRegistration,
    checkPasswordStrength,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors
  }
}

// Data sanitization utility
export function useSanitization() {
  const sanitizeHtml = (input) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: []
    })
  }

  const sanitizeInput = (input) => {
    if (typeof input === 'string') {
      return sanitizeHtml(input).trim()
    }
    return input
  }

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj

    const sanitized = {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value)
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? sanitizeInput(item) : item
        )
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
    return sanitized
  }

  return {
    sanitizeHtml,
    sanitizeInput,
    sanitizeObject
  }
}

// File validation
export function useFileValidation() {
  const validateFile = (file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      maxWidth = null,
      maxHeight = null
    } = options

    const errors = []

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    }

    // Check image dimensions (if applicable and browser supports it)
    return new Promise((resolve) => {
      if (file.type.startsWith('image/') && (maxWidth || maxHeight)) {
        const img = new Image()
        img.onload = () => {
          if (maxWidth && img.width > maxWidth) {
            errors.push(`Image width must be less than ${maxWidth}px`)
          }
          if (maxHeight && img.height > maxHeight) {
            errors.push(`Image height must be less than ${maxHeight}px`)
          }
          resolve({ isValid: errors.length === 0, errors })
        }
        img.onerror = () => {
          errors.push('Invalid image file')
          resolve({ isValid: false, errors })
        }
        img.src = URL.createObjectURL(file)
      } else {
        resolve({ isValid: errors.length === 0, errors })
      }
    })
  }

  return {
    validateFile
  }
}