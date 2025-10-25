# User Registration & Admin Setup Guide

This guide explains how to create accounts and promote users to admin role in the Aura Shop admin panel.

## 📋 Overview

The registration system creates users with the `user` role by default. To access admin features, you need to upgrade the role to `admin` after registration.

## 🚀 Quick Start

### Step 1: Register a New Account

1. **Start the servers:**
   ```bash
   # Terminal 1: Backend
   cd metainflu/backend
   npm run dev
   
   # Terminal 2: Admin Frontend
   cd metainflu/adminpanel/frontend/admin-new-ui
   npm run dev
   ```

2. **Open the admin panel:**
   - Navigate to: http://localhost:5174
   - Click "Create Account" on the login page
   - Or go directly to: http://localhost:5174/register

3. **Fill out the registration form:**
   - Full Name: Your name
   - Email: A valid email address
   - Password: Must meet security requirements (8+ chars, uppercase, lowercase, number, special character)
   - Accept terms and privacy policy
   - Click "Create Account"

### Step 2: Upgrade to Admin Role

**After successful registration, upgrade your role to admin:**

```bash
# Navigate to backend directory
cd metainflu/backend

# Run the role update script
node scripts/updateUserRole.js your-email@example.com admin
```

**Example:**
```bash
node scripts/updateUserRole.js john@example.com admin
```

### Step 3: Login as Admin

1. Go back to the login page: http://localhost:5174/login
2. Enter your email and password
3. You should now have admin access! 🎉

## 📁 System Architecture

### Registration Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Registration   │───▶│   User Created  │───▶│  Role: 'user'   │
│      Form       │    │   in Database   │    │   (Default)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                               
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Update Role   │───▶│  Role: 'admin'  │
                       │     Script      │    │  (Upgraded)     │
                       └─────────────────┘    └─────────────────┘
```

### File Structure

```
aura-shop/
├── metainflu/
│   ├── backend/
│   │   ├── controllers/
│   │   │   └── authController.js      # Registration endpoint
│   │   ├── models/
│   │   │   └── User.js               # User model with roles
│   │   └── scripts/
│   │       └── updateUserRole.js     # Role update script
│   └── adminpanel/frontend/admin-new-ui/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── AdminLogin.vue    # Login page with register link
│       │   │   └── AdminRegister.vue # Registration form
│       │   ├── services/
│       │   │   └── authService.js    # Registration API calls
│       │   └── router/
│       │       └── index.js          # Routes including /register
```

## 🔧 Technical Details

### Registration API Endpoint

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user",
  "termsAccepted": true,
  "privacyPolicyAccepted": true,
  "marketingConsent": false
}
```

### User Roles

- **`user`** - Default role, limited access
- **`vendor`** - Can manage products and orders
- **`admin`** - Full system access

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

## 🛠 Troubleshooting

### Common Issues

#### 1. "Email already exists" Error
**Problem:** Trying to register with an email that's already in the database.

**Solution:**
- Use a different email address, OR
- Check existing users: `node scripts/updateUserRole.js existing@email.com admin`

#### 2. "Rate limit exceeded" on Login
**Problem:** Too many failed login attempts.

**Solution:**
- Wait 2 minutes for rate limit to reset, OR
- Restart the backend server to reset in-memory limits

#### 3. Registration Form Validation Errors
**Problem:** Frontend validation failing.

**Solutions:**
- **Name:** Only letters and spaces allowed
- **Email:** Must be valid email format
- **Password:** Must meet security requirements
- **Checkboxes:** Terms and Privacy Policy must be accepted

#### 4. Script Can't Find User
**Problem:** `updateUserRole.js` says "User not found".

**Solution:**
- Check email spelling (case-insensitive)
- Verify user was created successfully in database
- Check MongoDB connection

### Database Verification

To check if a user was created successfully:

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use test

# Find user by email
db.users.findOne({email: "your-email@example.com"})

# List all users
db.users.find({}, {name: 1, email: 1, role: 1})
```

## 🔐 Security Features

### Built-in Security

- **Password Hashing:** bcrypt with salt rounds
- **Rate Limiting:** Prevents brute force attacks
- **Account Lockout:** After 5 failed attempts
- **Input Validation:** Frontend and backend validation
- **CSRF Protection:** Cross-site request forgery prevention
- **Email Verification:** (Ready for email service integration)

### Data Sanitization

- HTML sanitization using DOMPurify
- SQL injection prevention
- NoSQL injection prevention
- XSS protection

## 📝 Advanced Usage

### Bulk User Management

You can create a simple script to manage multiple users:

```bash
# Promote multiple users to admin
node scripts/updateUserRole.js user1@example.com admin
node scripts/updateUserRole.js user2@example.com admin
node scripts/updateUserRole.js user3@example.com vendor
```

### Environment Variables

Key environment variables for registration:

```bash
# Backend (.env)
MONGODB_URI=mongodb://127.0.0.1:27017/test
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
JWT_REFRESH_EXPIRE=7d

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000/api
```

### Custom Role Creation

To add new roles, update:

1. **Backend:** `models/User.js` - Add to role enum
2. **Frontend:** `scripts/updateUserRole.js` - Add to VALID_ROLES
3. **Routes:** Update role checks in router guards

## 🎯 Production Deployment

### Before Going Live

1. **Disable Registration Route** (Optional)
   - Comment out `/register` route in production
   - Create admin users manually

2. **Email Service Integration**
   - Set up email verification
   - Configure SMTP settings
   - Enable password reset emails

3. **Environment Security**
   - Use strong JWT secrets
   - Enable HTTPS
   - Set up proper CORS
   - Configure rate limiting

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Verify all servers are running
3. Check browser console for errors
4. Review server logs for backend errors

## ✅ Success Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5174  
- [ ] MongoDB connected and accessible
- [ ] Registration form accessible at `/register`
- [ ] User created successfully in database
- [ ] Role updated to `admin` using script
- [ ] Login successful with admin privileges
- [ ] Admin panel features accessible

---

🎉 **Congratulations!** You now have a fully functional admin account for your Aura Shop platform!