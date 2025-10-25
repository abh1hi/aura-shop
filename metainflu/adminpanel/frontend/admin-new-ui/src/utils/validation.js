/*
 * Simple Validation Utility
 * Lightweight validation without external dependencies
 */

export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

class Validator {
  constructor() {
    this.rules = []
    this.field = ''
  }

  static string() {
    const validator = new Validator()
    validator.type = 'string'
    return validator
  }

  static number() {
    const validator = new Validator()
    validator.type = 'number'
    return validator
  }

  static boolean() {
    const validator = new Validator()
    validator.type = 'boolean'
    return validator
  }

  static array() {
    const validator = new Validator()
    validator.type = 'array'
    return validator
  }

  static object(schema = {}) {
    const validator = new Validator()
    validator.type = 'object'
    validator.schema = schema
    return validator
  }

  required(message = 'This field is required') {
    this.rules.push({
      type: 'required',
      message,
      validate: (value) => {
        if (value === null || value === undefined || value === '') {
          return false
        }
        if (Array.isArray(value) && value.length === 0) {
          return false
        }
        return true
      }
    })
    return this
  }

  min(minValue, message) {
    this.rules.push({
      type: 'min',
      message: message || `Must be at least ${minValue}`,
      validate: (value) => {
        if (this.type === 'string') {
          return value.length >= minValue
        }
        if (this.type === 'number') {
          return value >= minValue
        }
        return true
      }
    })
    return this
  }

  max(maxValue, message) {
    this.rules.push({
      type: 'max',
      message: message || `Must be at most ${maxValue}`,
      validate: (value) => {
        if (this.type === 'string') {
          return value.length <= maxValue
        }
        if (this.type === 'number') {
          return value <= maxValue
        }
        return true
      }
    })
    return this
  }

  matches(pattern, message) {
    this.rules.push({
      type: 'matches',
      message: message || 'Invalid format',
      validate: (value) => {
        if (typeof value !== 'string') return false
        return pattern.test(value)
      }
    })
    return this
  }

  email(message = 'Invalid email format') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return this.matches(emailPattern, message)
  }

  positive(message = 'Must be positive') {
    this.rules.push({
      type: 'positive',
      message,
      validate: (value) => {
        return typeof value === 'number' && value > 0
      }
    })
    return this
  }

  integer(message = 'Must be a whole number') {
    this.rules.push({
      type: 'integer',
      message,
      validate: (value) => {
        return typeof value === 'number' && Number.isInteger(value)
      }
    })
    return this
  }

  oneOf(values, message) {
    this.rules.push({
      type: 'oneOf',
      message: message || `Must be one of: ${values.join(', ')}`,
      validate: (value) => {
        return values.includes(value)
      }
    })
    return this
  }

  nullable() {
    this.isNullable = true
    return this
  }

  default(defaultValue) {
    this.defaultValue = defaultValue
    return this
  }

  validate(value) {
    // Handle null/undefined values
    if ((value === null || value === undefined) && this.isNullable) {
      return { isValid: true, value: value }
    }

    // Apply default value
    if ((value === null || value === undefined || value === '') && this.defaultValue !== undefined) {
      value = this.defaultValue
    }

    // Type validation
    if (!this.validateType(value)) {
      return {
        isValid: false,
        error: `Expected ${this.type} but received ${typeof value}`
      }
    }

    // Rule validation
    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        return {
          isValid: false,
          error: rule.message
        }
      }
    }

    // Object schema validation
    if (this.type === 'object' && this.schema) {
      const objectErrors = []
      const validatedObject = {}

      for (const [key, validator] of Object.entries(this.schema)) {
        const result = validator.validate(value[key])
        if (!result.isValid) {
          objectErrors.push({
            field: key,
            message: result.error
          })
        } else {
          validatedObject[key] = result.value
        }
      }

      if (objectErrors.length > 0) {
        return {
          isValid: false,
          errors: objectErrors
        }
      }

      return { isValid: true, value: validatedObject }
    }

    return { isValid: true, value }
  }

  validateType(value) {
    switch (this.type) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number' && !isNaN(value)
      case 'boolean':
        return typeof value === 'boolean'
      case 'array':
        return Array.isArray(value)
      case 'object':
        return value !== null && typeof value === 'object' && !Array.isArray(value)
      default:
        return true
    }
  }
}

// Export validation schemas
export const validationSchemas = {
  product: Validator.object({
    name: Validator.string()
      .min(3, 'Product name must be at least 3 characters')
      .max(100, 'Product name cannot exceed 100 characters')
      .matches(/^[a-zA-Z0-9\s\-_.'\'"]+$/, 'Product name contains invalid characters')
      .required('Product name is required'),
    description: Validator.string()
      .max(1000, 'Description cannot exceed 1000 characters')
      .nullable(),
    brand: Validator.string()
      .max(50, 'Brand name cannot exceed 50 characters')
      .matches(/^[a-zA-Z0-9\s\-_.'\'"]*$/, 'Brand name contains invalid characters')
      .nullable(),
    price: Validator.number()
      .positive('Price must be positive')
      .max(999999.99, 'Price cannot exceed $999,999.99')
      .required('Price is required'),
    stock: Validator.number()
      .integer('Stock must be a whole number')
      .min(0, 'Stock cannot be negative')
      .max(999999, 'Stock cannot exceed 999,999')
      .required('Stock is required'),
    category: Validator.string()
      .matches(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format')
      .required('Category is required')
  }),

  category: Validator.object({
    name: Validator.string()
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name cannot exceed 50 characters')
      .matches(/^[a-zA-Z0-9\s\-]+$/, 'Category name can only contain letters, numbers, spaces, and hyphens')
      .required('Category name is required'),
    description: Validator.string()
      .max(200, 'Description cannot exceed 200 characters')
      .nullable(),
    parentId: Validator.string()
      .matches(/^[0-9a-fA-F]{24}$/, 'Invalid parent category ID format')
      .nullable(),
    status: Validator.string()
      .oneOf(['active', 'inactive'], 'Status must be active or inactive')
      .default('active')
  }),

  user: Validator.object({
    name: Validator.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
      .required('Name is required'),
    email: Validator.string()
      .email('Invalid email format')
      .max(100, 'Email cannot exceed 100 characters')
      .required('Email is required'),
    role: Validator.string()
      .oneOf(['user', 'vendor', 'admin'], 'Invalid role')
      .required('Role is required'),
    isActive: Validator.boolean()
      .default(true)
  })
}

// Validation function
export function validateData(data, schemaName) {
  const schema = validationSchemas[schemaName]
  if (!schema) {
    throw new Error(`Validation schema '${schemaName}' not found`)
  }

  const result = schema.validate(data)
  
  if (!result.isValid) {
    const validationError = new ValidationError('Validation failed')
    validationError.details = result.errors || [{ field: 'root', message: result.error }]
    throw validationError
  }

  return result.value
}

export default Validator