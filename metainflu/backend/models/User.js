/*
 * Enhanced User Model with Security Features
 * Includes account lockout, password policies, and security tracking
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    validate: {
      validator: function(name) {
        return /^[a-zA-Z\s]+$/.test(name)
      },
      message: 'Name can only contain letters and spaces'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [100, 'Email cannot exceed 100 characters'],
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function(password) {
        // Strong password requirements
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'vendor', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'user'
  },
  
  // Account status and verification
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  // Password reset functionality
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  
  // Account lockout mechanism
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  
  // Security tracking
  lastLogin: {
    type: Date
  },
  lastLoginIP: {
    type: String
  },
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    success: {
      type: Boolean,
      default: true
    }
  }],
  
  // Two-Factor Authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  twoFactorBackupCodes: [{
    code: String,
    used: {
      type: Boolean,
      default: false
    }
  }],
  
  // Privacy and compliance
  termsAccepted: {
    type: Boolean,
    required: [true, 'Terms and conditions must be accepted']
  },
  termsAcceptedAt: {
    type: Date,
    default: Date.now
  },
  privacyPolicyAccepted: {
    type: Boolean,
    required: [true, 'Privacy policy must be accepted']
  },
  privacyPolicyAcceptedAt: {
    type: Date,
    default: Date.now
  },
  marketingConsent: {
    type: Boolean,
    default: false
  },
  
  // Additional profile information
  avatar: {
    type: String
  },
  phone: {
    type: String,
    validate: {
      validator: function(phone) {
        return !phone || /^\+?[1-9]\d{1,14}$/.test(phone)
      },
      message: 'Please provide a valid phone number'
    }
  },
  
  // Vendor-specific fields
  vendorInfo: {
    businessName: {
      type: String,
      required: function() {
        return this.role === 'vendor'
      }
    },
    businessAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    taxId: {
      type: String,
      required: function() {
        return this.role === 'vendor'
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
})

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// Virtual for full name display
userSchema.virtual('displayName').get(function() {
  return this.name
})

// Password hashing middleware
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
    this.password = await bcrypt.hash(this.password, saltRounds)
    
    // Update password changed timestamp
    this.passwordChangedAt = Date.now()
    
    next()
  } catch (error) {
    next(error)
  }
})

// Update login history before saving
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    // Keep only last 10 login records
    if (this.loginHistory.length >= 10) {
      this.loginHistory = this.loginHistory.slice(-9)
    }
  }
  next()
})

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error('Password comparison failed')
  }
}

userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role
  }
  
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  )
  
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  )
  
  return { accessToken, refreshToken }
}

userSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // Lock account after maximum attempts
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5
  const lockTime = parseInt(process.env.LOCK_TIME) || 2 // hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { 
      lockUntil: Date.now() + (lockTime * 60 * 60 * 1000) // Convert hours to ms
    }
  }
  
  return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: { 
      loginAttempts: 1, 
      lockUntil: 1 
    }
  })
}

userSchema.methods.addLoginRecord = async function(ip, userAgent, success = true) {
  const loginRecord = {
    ip,
    userAgent,
    timestamp: new Date(),
    success
  }
  
  return this.updateOne({
    $push: { 
      loginHistory: {
        $each: [loginRecord],
        $slice: -10 // Keep only last 10 records
      }
    },
    $set: {
      lastLogin: success ? new Date() : this.lastLogin,
      lastLoginIP: success ? ip : this.lastLoginIP
    }
  })
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  
  const resetExpire = parseInt(process.env.PASSWORD_RESET_EXPIRE) || 10 // minutes
  this.passwordResetExpires = Date.now() + (resetExpire * 60 * 1000)
  
  return resetToken
}

userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex')
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex')
  
  const verifyExpire = parseInt(process.env.EMAIL_VERIFICATION_EXPIRE) || 24 // hours
  this.emailVerificationExpires = Date.now() + (verifyExpire * 60 * 60 * 1000)
  
  return verificationToken
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamp < changedTimestamp
  }
  return false
}

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

userSchema.statics.findByResetToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })
}

userSchema.statics.findByVerificationToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  
  return this.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  })
}

// Indexes
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ loginAttempts: 1, lockUntil: 1 })
userSchema.index({ role: 1 })
userSchema.index({ createdAt: -1 })
userSchema.index({ lastLogin: -1 })
userSchema.index({ 'vendorInfo.isVerified': 1 })

// Export the model
module.exports = mongoose.model('User', userSchema)