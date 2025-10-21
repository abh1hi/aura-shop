# CORS Troubleshooting Guide

## Issue: 401 Unauthorized on OPTIONS Request during Registration

### Problem Description
When trying to register a user, the browser sends a CORS preflight OPTIONS request that returns `401 Unauthorized` instead of `200 OK`. This prevents the actual POST request from being sent.

### Root Cause
The CORS preflight request (OPTIONS) was being intercepted by authentication middleware before it could be handled properly.

### Solutions Applied

#### 1. Enhanced CORS Configuration
```javascript
const corsOptions = {
  origin: [
    // Local development
    'http://localhost:5173',
    'http://127.0.0.1:5173', 
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    // GitHub Codespaces
    'https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev',
    'https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev', // Your backend URL
    // Pattern matching for Codespaces
    /.*\.app\.github\.dev$/,
    /.*\.githubpreview\.dev$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};
```

#### 2. Explicit OPTIONS Handler
```javascript
// Handle preflight requests explicitly
app.options('*', cors(corsOptions));
```

#### 3. Updated Auth Middleware
```javascript
const protect = asyncHandler(async (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }
  // ... rest of auth logic
});
```

### Quick Fixes to Try

#### 1. Restart Your Backend Server
```bash
cd metainflu/backend
npm run dev
# or
node server.js
```

#### 2. Check Your Frontend API Base URL
Make sure your frontend is pointing to the correct backend URL:

```javascript
// In your frontend service files
const API_BASE_URL = 'https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api'
```

#### 3. Test CORS with curl
```bash
# Test OPTIONS request
curl -X OPTIONS \
  -H "Origin: https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api/auth/register

# Should return 200 OK with CORS headers
```

#### 4. Test Registration Directly
```bash
# Test POST request directly
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}' \
  https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api/auth/register
```

### Debugging Steps

#### 1. Check Server Logs
Look for these log messages when making a registration request:
```
2025-10-22T03:00:00.000Z - OPTIONS /api/auth/register
Origin: https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev
```

#### 2. Verify CORS Headers in Response
The OPTIONS response should include:
```
Access-Control-Allow-Origin: https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
Access-Control-Allow-Credentials: true
```

#### 3. Test API Health Endpoints
```bash
# Test basic connectivity
curl https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/

# Test API status
curl https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api

# Test auth health
curl https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api/auth/health

# Test CORS specifically
curl -H "Origin: https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev" \
     https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api/auth/test-cors
```

### Alternative Solutions

#### If CORS Still Doesn't Work:

1. **Temporary Wildcard Origin** (for development only):
```javascript
const corsOptions = {
  origin: '*', // ONLY for debugging - remove in production!
  credentials: false, // Must be false with wildcard origin
  // ... other options
};
```

2. **Proxy Through Frontend Dev Server**:
```javascript
// In your Vite config (vite.config.js)
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev',
        changeOrigin: true,
        secure: true
      }
    }
  }
}
```

3. **Environment-Specific CORS**:
```javascript
// In server.js
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://your-production-domain.com']
  : [
      'http://localhost:5173',
      'https://improved-goggles-v6pqpqrvvj46cwqr7-5173.app.github.dev',
      /.*\.app\.github\.dev$/
    ];
```

### Environment Variables Check

Make sure these are set in your backend environment:
```bash
# .env file or environment variables
JWT_SECRET=your-secret-key-here
MONGO_URI=your-mongodb-connection-string
NODE_ENV=development
PORT=5000
```

### Frontend Service Configuration

Ensure your frontend API service is configured correctly:

```javascript
// services/api.js or similar
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-backend.com/api'
  : 'https://improved-goggles-v6pqpqrvvj46cwqr7-5000.app.github.dev/api'

// Axios configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});
```

### Expected Behavior After Fixes

1. **OPTIONS Request**: Should return `200 OK` with CORS headers
2. **POST Request**: Should proceed normally to registration
3. **Response**: Should contain user data and JWT token
4. **Network Tab**: Should show successful CORS preflight followed by successful POST

### Still Having Issues?

If the problem persists:

1. **Check GitHub Codespaces Port Visibility**:
   - Make sure port 5000 (backend) is set to **Public**
   - Make sure port 5173 (frontend) is set to **Public**

2. **Verify Exact URLs**:
   - Copy the exact URLs from your Codespaces tabs
   - Update the CORS origins in `server.js`

3. **Test with Browser DevTools**:
   - Open Network tab
   - Look for the OPTIONS request
   - Check response headers
   - Verify status code

4. **Check Server Console**:
   - Should show incoming OPTIONS and POST requests
   - Should show origin headers
   - Should show any errors

The fixes in this branch should resolve your CORS registration issue. Restart your backend server and try registration again!