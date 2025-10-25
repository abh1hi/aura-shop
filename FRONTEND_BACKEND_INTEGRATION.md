# 🔗 Frontend-Backend Integration Guide

This guide provides comprehensive instructions for connecting the Vue.js admin panel frontend with the Node.js backend API, including setup, configuration, and troubleshooting.

## 🚀 Quick Setup

### 1. Start Backend Server

```bash
# Navigate to backend directory
cd metainflu/backend

# Install dependencies (latest versions)
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or code .env

# Start development server
npm run dev
```

**Backend will run on**: `http://localhost:5000`

### 2. Start Frontend Admin Panel

```bash
# Navigate to frontend directory
cd metainflu/adminpanel/frontend/admin-new-ui

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

**Frontend will run on**: `http://localhost:5174`

## 🔧 Configuration

### Backend Configuration (.env)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/aura-shop

# JWT Security
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-different-refresh-token-secret-key
JWT_REFRESH_EXPIRE=7d

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=2

# CORS (Important for frontend connection)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend Configuration (.env.local)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Aura Shop Admin
VITE_APP_VERSION=1.2.0

# Development
VITE_ENABLE_DEVTOOLS=true
```

## 📡 API Endpoints Connection Map

### Authentication Endpoints

| Frontend Action | HTTP Method | Backend Endpoint | Purpose |
|----------------|-------------|------------------|----------|
| Login Form | `POST` | `/api/auth/admin/login` | Admin authentication |
| Auto-login Check | `GET` | `/api/auth/me` | Get current user |
| Token Refresh | `POST` | `/api/auth/refresh` | Refresh expired tokens |
| Logout | `POST` | `/api/auth/logout` | Clear session |
| Password Change | `POST` | `/api/auth/change-password` | Update password |

### Dashboard Endpoints

| Frontend Component | HTTP Method | Backend Endpoint | Data Retrieved |
|-------------------|-------------|------------------|----------------|
| `AdminDashboard.vue` | `GET` | `/api/admin/dashboard` | Stats, recent orders, sales data |
| `AdminAnalytics.vue` | `GET` | `/api/admin/analytics?period=30d` | Revenue, sales trends |

### Product Management Endpoints

| Frontend Action | HTTP Method | Backend Endpoint | Purpose |
|----------------|-------------|------------------|----------|
| Load Products | `GET` | `/api/admin/products?page=1&limit=12` | Paginated product list |
| Create Product | `POST` | `/api/admin/products` | Add new product |
| Update Product | `PUT` | `/api/admin/products/:id` | Modify existing product |
| Delete Product | `DELETE` | `/api/admin/products/:id` | Remove product |
| Search Products | `GET` | `/api/admin/products?search=query` | Filter products |

### Category Management Endpoints

| Frontend Action | HTTP Method | Backend Endpoint | Purpose |
|----------------|-------------|------------------|----------|
| Load Categories | `GET` | `/api/admin/categories` | Hierarchical category tree |
| Create Category | `POST` | `/api/admin/categories` | Add new category |
| Update Category | `PUT` | `/api/admin/categories/:id` | Modify category |
| Delete Category | `DELETE` | `/api/admin/categories/:id` | Remove category |

## 🛠️ Integration Architecture

```mermaid
sequenceDiagram
    participant Frontend as Vue.js Admin Panel
    participant Service as AdminService
    participant Backend as Express API
    participant Auth as Auth Middleware
    participant DB as MongoDB
    
    Note over Frontend,DB: Authentication Flow
    Frontend->>Service: login(credentials)
    Service->>Backend: POST /api/auth/admin/login
    Backend->>Auth: Validate credentials
    Auth->>DB: Find user & verify
    DB-->>Auth: User data
    Auth-->>Backend: JWT tokens
    Backend-->>Service: Success + tokens
    Service-->>Frontend: Store tokens + user data
    
    Note over Frontend,DB: Protected Resource Access
    Frontend->>Service: getProducts()
    Service->>Service: Add JWT token to header
    Service->>Backend: GET /api/admin/products
    Backend->>Auth: Verify JWT token
    Auth->>Backend: User authenticated
    Backend->>DB: Query products
    DB-->>Backend: Product data
    Backend-->>Service: JSON response
    Service-->>Frontend: Display products
```

## 🎯 Frontend Service Integration

### AdminService Configuration

The `AdminService` class handles all API communication:

```javascript
// File: src/services/adminService.js
class AdminService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      withCredentials: true
    })
    
    this.setupInterceptors()
  }
  
  // Automatic token handling
  setupInterceptors() {
    this.api.interceptors.request.use(config => {
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    
    // Automatic token refresh on 401
    this.api.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await this.refreshToken()
          return this.api(error.config) // Retry request
        }
        return Promise.reject(error)
      }
    )
  }
}
```

### State Management Integration

Using Pinia for centralized state management:

```javascript
// File: src/stores/auth.js
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  
  const login = async (credentials) => {
    try {
      const response = await authService.loginAdmin(credentials)
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    }
  }
  
  return { user, isAuthenticated, login }
})
```

## 🔒 Security Integration

### 1. JWT Token Handling

```javascript
// Automatic token attachment
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 2. Input Validation (Client-Side)

```javascript
// Validation before API call
const createProduct = async (productData) => {
  // Client validation
  const validatedData = validateData(productData, 'product')
  
  // API call with validated data
  const response = await adminService.createProduct(validatedData)
  return response
}
```

### 3. Error Handling

```javascript
// Centralized error handling
const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Redirect to login
    router.push('/login')
  } else if (error.response?.status === 403) {
    // Show access denied message
    toast.error('Access denied')
  } else {
    // Show generic error
    toast.error(error.message || 'An error occurred')
  }
}
```

## 🧪 Testing the Integration

### 1. Backend API Tests

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test API info
curl http://localhost:5000/api/info

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123!@#"}'
```

### 2. Frontend Connection Test

```javascript
// In browser console
fetch('http://localhost:5000/api/info')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err))
```

### 3. Full Integration Test

1. **Open Admin Panel**: http://localhost:5174
2. **Check API Status**: Should show "connected" in login page
3. **Test Login**: Use test credentials
4. **Navigate Dashboard**: Should load data from backend
5. **Test CRUD Operations**: Create, read, update, delete products

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Solution**: Check `CORS_ORIGINS` in backend `.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

#### 2. Network Errors
```
Network Error: Unable to connect to server
```

**Solutions**:
- Ensure backend is running on port 5000
- Check if MongoDB is running
- Verify firewall settings

#### 3. Authentication Failures
```
401 Unauthorized: Token failed
```

**Solutions**:
- Check JWT_SECRET in backend `.env`
- Clear browser localStorage
- Verify token format

#### 4. Validation Errors
```
400 Bad Request: Validation error
```

**Solutions**:
- Check frontend validation schemas match backend
- Verify required fields are being sent
- Check data types and formats

### Debug Commands

```bash
# Backend debugging
cd metainflu/backend
DEBUG=* npm run dev  # Verbose logging

# Frontend debugging
cd metainflu/adminpanel/frontend/admin-new-ui
npm run dev -- --debug  # Enable Vue devtools
```

### Network Inspection

1. **Open Browser DevTools**
2. **Go to Network tab**
3. **Perform actions** (login, load products, etc.)
4. **Check request/response** details

**Expected Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-CSRF-Token: abc123... (for protected routes)
```

**Expected Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-10-26T21:00:00.000Z"
}
```

## 📊 Data Flow Examples

### Product Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant ProductForm as Product Form
    participant Validation as Frontend Validation
    participant Service as AdminService
    participant API as Backend API
    participant Database as MongoDB
    
    User->>ProductForm: Fill product details
    ProductForm->>Validation: Validate input
    Validation->>ProductForm: Validation result
    
    alt Validation Success
        ProductForm->>Service: createProduct(data)
        Service->>Service: Sanitize data
        Service->>API: POST /api/admin/products
        API->>API: Server validation
        API->>Database: Save product
        Database-->>API: Product saved
        API-->>Service: Success response
        Service-->>ProductForm: Product created
        ProductForm-->>User: Success message
    else Validation Error
        Validation-->>User: Show errors
    end
```

### Authentication Flow

```mermaid
stateDiagram-v2
    [*] --> LoginForm: User visits admin panel
    LoginForm --> Validating: Submit credentials
    Validating --> BackendAuth: Client validation passed
    Validating --> LoginForm: Validation errors
    
    BackendAuth --> TokenStorage: Login successful
    BackendAuth --> LoginForm: Login failed
    
    TokenStorage --> Dashboard: Tokens stored
    Dashboard --> ProtectedRoutes: Navigation
    
    ProtectedRoutes --> TokenRefresh: Token expired
    TokenRefresh --> ProtectedRoutes: New token
    TokenRefresh --> LoginForm: Refresh failed
    
    ProtectedRoutes --> [*]: Logout
```

## 🔐 Security Implementation

### Frontend Security Measures

1. **Input Sanitization**:
```javascript
import DOMPurify from 'dompurify'

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}
```

2. **XSS Prevention**:
```vue
<!-- Use v-text instead of v-html when possible -->
<p v-text="userInput"></p>

<!-- If HTML is needed, sanitize first -->
<div v-html="sanitizedHtml"></div>
```

3. **CSRF Protection**:
```javascript
// Automatically handled by AdminService
axios.defaults.headers.common['X-CSRF-Token'] = getCsrfToken()
```

### Backend Security Validation

1. **Input Validation**:
```javascript
// Every endpoint has validation
router.post('/products',
  validateRequest(validationSchemas.createProduct),
  createProduct
)
```

2. **Authentication Check**:
```javascript
// All admin routes protected
router.use(protect)      // JWT verification
router.use(authorize('admin'))  // Role check
```

3. **Data Sanitization**:
```javascript
// MongoDB injection prevention
app.use(mongoSanitize())
app.use(advancedSanitize)
```

## 🔄 Real-time Features

### Auto-refresh Data

```javascript
// Auto-refresh dashboard data every 30 seconds
setInterval(async () => {
  if (isAuthenticated.value && !document.hidden) {
    await fetchDashboardData()
  }
}, 30000)
```

### WebSocket Integration (Future)

```javascript
// Real-time order updates
const socket = io(import.meta.env.VITE_API_BASE_URL)

socket.on('newOrder', (order) => {
  // Update UI with new order
  orders.value.unshift(order)
  showNotification('New order received!')
})
```

## 📱 Component Integration Examples

### AdminDashboard.vue Connection

```vue
<script setup>
import { ref, onMounted } from 'vue'
import adminService from '../services/adminService.js'

const dashboardData = ref(null)
const isLoading = ref(false)

const fetchDashboardData = async () => {
  try {
    isLoading.value = true
    const response = await adminService.getDashboardData()
    dashboardData.value = response.data
  } catch (error) {
    console.error('Dashboard fetch failed:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
```

### AdminProducts.vue Connection

```vue
<script setup>
import { ref, onMounted } from 'vue'
import adminService from '../services/adminService.js'
import { useProductValidation } from '../composables/useValidation.js'

const products = ref([])
const { validateProduct } = useProductValidation()

const createProduct = async (productData) => {
  try {
    // Frontend validation
    const validatedData = validateProduct(productData)
    if (!validatedData) return
    
    // API call
    const response = await adminService.createProduct(validatedData)
    
    // Update local state
    products.value.unshift(response.data)
    
    toast.success('Product created successfully!')
  } catch (error) {
    toast.error(error.message)
  }
}
</script>
```

## 🚦 Error Handling Strategy

### Frontend Error Handling

```javascript
// Global error handler in main.js
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Global Error:', error)
  
  // Send to monitoring service in production
  if (import.meta.env.PROD) {
    // Sentry.captureException(error)
  }
}

// API error handler in services
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return new ValidationError(data.errors || [data.message])
      case 401:
        authStore.logout()
        return new AuthError('Authentication required')
      case 403:
        return new AuthError('Access denied')
      case 429:
        return new RateLimitError(data.message)
      default:
        return new APIError(data.message || 'Server error')
    }
  }
  
  return new NetworkError('Unable to connect to server')
}
```

### Backend Error Handling

```javascript
// Consistent error response format
const sendErrorResponse = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  })
}

// Global error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error)
  
  if (error.name === 'ValidationError') {
    return sendErrorResponse(res, 400, 'Validation failed', error.details)
  }
  
  if (error.name === 'UnauthorizedError') {
    return sendErrorResponse(res, 401, 'Authentication required')
  }
  
  sendErrorResponse(res, 500, 'Internal server error')
})
```

## 📈 Performance Optimization

### Frontend Optimizations

1. **Lazy Loading**:
```javascript
// Route-based code splitting
const AdminProducts = () => import('../pages/AdminProducts.vue')
```

2. **Request Debouncing**:
```javascript
// Debounce search requests
const debouncedSearch = debounce((query) => {
  searchProducts(query)
}, 300)
```

3. **Caching**:
```javascript
// Cache frequently accessed data
const categoryCache = new Map()

const getCategories = async () => {
  if (categoryCache.has('all')) {
    return categoryCache.get('all')
  }
  
  const categories = await adminService.getCategories()
  categoryCache.set('all', categories)
  return categories
}
```

### Backend Optimizations

1. **Database Indexing**:
```javascript
// Optimized queries with indexes
Product.find(filter)
  .populate('categories', 'name')
  .sort({ createdAt: -1 })
  .limit(20)
```

2. **Pagination**:
```javascript
// Efficient pagination
const skip = (page - 1) * limit
Product.find().skip(skip).limit(limit)
```

## 🚀 Deployment Configuration

### Production Environment Variables

**Backend (.env)**:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/aura-shop-prod
CORS_ORIGINS=https://admin.yourapp.com,https://yourapp.com
JWT_SECRET=production-secret-key-32-chars-minimum
```

**Frontend (.env.production)**:
```env
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_APP_ENV=production
```

### Build Commands

```bash
# Backend production build
cd metainflu/backend
npm ci --production
npm start

# Frontend production build
cd metainflu/adminpanel/frontend/admin-new-ui
npm run build
```

## ✅ Integration Checklist

### Pre-Development
- [ ] Backend server running on port 5000
- [ ] MongoDB connected and accessible
- [ ] Environment variables configured
- [ ] CORS origins include frontend URL

### During Development
- [ ] API endpoints return expected JSON format
- [ ] Authentication flows work correctly
- [ ] Validation works on both frontend and backend
- [ ] Error messages are user-friendly
- [ ] Loading states provide feedback

### Testing
- [ ] All CRUD operations work
- [ ] Authentication and authorization function
- [ ] Error handling is graceful
- [ ] Performance is acceptable
- [ ] Security measures are active

### Production Ready
- [ ] Environment variables are production-safe
- [ ] HTTPS is configured
- [ ] CSRF protection is enabled
- [ ] Rate limiting is active
- [ ] Monitoring is set up

---

**🎉 Integration Complete!**

Your Vue.js admin panel is now securely connected to the Node.js backend with comprehensive validation, error handling, and security measures.

**Next Steps**:
1. Test all functionality thoroughly
2. Add more features as needed
3. Set up production deployment
4. Implement monitoring and logging

---

*Last Updated: October 26, 2025*  
*Integration Guide v1.2.0*