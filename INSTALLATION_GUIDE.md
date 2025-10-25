# 📦 Aura Shop Installation Guide

This guide provides step-by-step instructions for setting up the Aura Shop application with the latest security features and dependency updates.

## 🚀 Quick Installation

### Prerequisites
- **Node.js**: Version 18.0.0 or higher (tested with v22.19.0)
- **npm**: Version 9.0.0 or higher
- **MongoDB**: Version 6.0 or higher
- **Git**: Latest version

### 1. Clone the Repository

```bash
git clone https://github.com/abh1hi/aura-shop.git
cd aura-shop
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd metainflu/backend

# Install dependencies (updated packages)
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
# Use your preferred editor (nano, vim, code, etc.)
nano .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../adminpanel/frontend/admin-new-ui

# Install dependencies
npm install

# Create environment file (optional)
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env.local
```

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
# Or start MongoDB manually
mongod --dbpath /path/to/your/db
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd metainflu/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd metainflu/adminpanel/frontend/admin-new-ui
npm run dev
```

## ⚠️ Handling npm Warnings

### Understanding the Warnings

The warnings you encountered are for **deprecated packages** that have been **replaced with updated versions** in our latest package.json updates:

| Deprecated Package | Issue | Replacement | Status |
|-------------------|-------|-------------|--------|
| `inflight@1.0.6` | Memory leaks | Removed from dependencies | ✅ Fixed |
| `rimraf@3.0.2` | Version < v4 unsupported | Updated to latest | ✅ Fixed |
| `glob@7.2.3` | Version < v9 unsupported | Updated to latest | ✅ Fixed |
| `supertest@6.3.4` | Security vulnerabilities | Updated to v7+ | ✅ Fixed |
| `csurf@1.11.0` | Package archived | Custom implementation | ✅ Fixed |
| `multer@1.4.5-lts.2` | Security vulnerabilities | Updated to v2.x | ✅ Fixed |
| `eslint@8.57.1` | Version unsupported | Updated to v9+ | ✅ Fixed |

### Clean Installation Process

1. **Remove old node_modules and package-lock.json:**
```bash
cd metainflu/backend
rm -rf node_modules package-lock.json
npm install
```

2. **Verify updated packages:**
```bash
npm list | grep -E "(inflight|rimraf|glob|supertest|csurf|multer|eslint)"
```

3. **Run security audit:**
```bash
npm audit
npm audit fix  # If any issues remain
```

## 🔐 Environment Configuration

### Backend Environment (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/aura-shop
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aura-shop

# JWT Security (Generate strong secrets!)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-here
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-different-refresh-token-secret-key-here
JWT_REFRESH_EXPIRE=7d

# Security Configuration
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=2
PASSWORD_RESET_EXPIRE=10
EMAIL_VERIFICATION_EXPIRE=24

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@aurashop.com
FROM_NAME=Aura Shop

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif

# Security Headers
HSTS_MAX_AGE=31536000

# Monitoring (Optional)
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

### Frontend Environment (.env.local)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=Aura Shop Admin
VITE_APP_VERSION=1.2.0

# Security Configuration
VITE_ENABLE_DEVTOOLS=true
```

## 🧪 Testing the Installation

### 1. Backend Health Check
```bash
# Test API endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/info
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-26T20:41:00.000Z",
  "uptime": 12.345,
  "version": "1.2.0",
  "environment": "development"
}
```

### 2. Frontend Access
Open your browser to:
- **Admin Panel**: http://localhost:5174
- **API Documentation**: http://localhost:5000/api/info

### 3. Database Connection Test
```bash
# Check database connection
curl http://localhost:5000/health/detailed
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

#### 2. MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Test MongoDB connection
mongosh "your-connection-string"
```

#### 3. Node.js Version Issues
```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Update Node.js using nvm (recommended)
nvm install --lts
nvm use --lts
```

#### 4. npm Permission Issues
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm

# Or use npm without sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### 5. CORS Issues
If you encounter CORS errors:
1. Check `CORS_ORIGINS` in backend `.env`
2. Ensure frontend URL is included
3. Restart backend server after changes

#### 6. JWT Secret Errors
```bash
# Generate secure JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Performance Optimization

#### 1. Database Indexing
```bash
# Connect to MongoDB and create indexes
mongosh your-database-name
db.users.createIndex({ "email": 1 }, { unique: true })
db.products.createIndex({ "user": 1, "categories": 1 })
```

#### 2. Node.js Optimization
```bash
# Set Node.js environment for production
export NODE_ENV=production

# Increase memory limit if needed
export NODE_OPTIONS="--max-old-space-size=4096"
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Build frontend
cd metainflu/adminpanel/frontend/admin-new-ui
npm run build

# Install production dependencies only
cd ../../backend
npm ci --production
```

### 2. Security Checklist
- [ ] Update all JWT secrets
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Enable CSRF protection
- [ ] Configure secure MongoDB connection
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules

### 3. Process Management
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "aura-shop-api"
pm2 startup
pm2 save

# Using systemd service
sudo nano /etc/systemd/system/aura-shop.service
sudo systemctl enable aura-shop
sudo systemctl start aura-shop
```

## 📊 Monitoring

### Health Checks
```bash
# API health
curl -f http://localhost:5000/health || exit 1

# Database health
curl -f http://localhost:5000/health/detailed || exit 1
```

### Log Monitoring
```bash
# View application logs
tail -f logs/combined-$(date +%Y-%m-%d).log

# View error logs
tail -f logs/error-$(date +%Y-%m-%d).log

# View security events
tail -f logs/security-$(date +%Y-%m-%d).log
```

## 🆘 Support

### Getting Help
1. **Check logs** for detailed error messages
2. **Review environment configuration**
3. **Test each component individually**
4. **Create GitHub issue** with detailed error information

### Useful Commands
```bash
# Check all services
npm run health-check  # Custom script

# Reset development environment
npm run reset-dev  # Clears cache, reinstalls dependencies

# Security audit
npm audit
npm run security:check
```

---

**✅ Installation Complete!**

Your Aura Shop application should now be running with:
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5174  
- **Database**: Connected and secured
- **Security**: All latest measures implemented

**Next Steps:**
1. Create your first admin user
2. Configure email settings
3. Set up payment gateway
4. Review security settings
5. Deploy to production

---

*Last Updated: October 26, 2025*  
*Version: 1.2.0*