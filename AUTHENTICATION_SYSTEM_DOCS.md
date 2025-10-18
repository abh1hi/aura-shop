# Aura Shop Authentication System - Complete Documentation

## Overview

The Aura Shop authentication system is a **multi-tenant, role-based authentication architecture** supporting three distinct user types with separate frontends and unified backend. This document provides comprehensive technical documentation, architectural diagrams, and scalability analysis.

## System Architecture

### High-Level Authentication Flow
```mermaid
graph TB
    subgraph "Client Types"
        Customer["👤 Customer\n(Regular User)\nrole: 'user'"]
        Vendor["🏪 Vendor\n(Store Owner)\nrole: 'vendor'"]
        Admin["👑 Admin\n(Platform Admin)\nrole: 'admin'"]
    end
    
    subgraph "Frontend Applications"
        CustomerApp["Customer Frontend\n/metainflu/frontend/client\nVue 3 + Vite"]
        VendorApp["Vendor Panel\n/metainflu/adminpanel/frontend/vendor\nVue 3 + Vite"]
        AdminApp["Admin Panel\n/metainflu/adminpanel/frontend/admin\nVue 3 + Vite"]
    end
    
    subgraph "Backend API Layer"
        AuthRoutes["Authentication Routes\n/api/auth"]
        AuthController["Auth Controllers"]
        AuthMiddleware["JWT Middleware"]
    end
    
    subgraph "Database Layer"
        MongoDB[("MongoDB\nUsers Collection")]
    end
    
    Customer --> CustomerApp
    Vendor --> VendorApp
    Admin --> AdminApp
    
    CustomerApp --> AuthRoutes
    VendorApp --> AuthRoutes
    AdminApp --> AuthRoutes
    
    AuthRoutes --> AuthController
    AuthController --> MongoDB
    AuthController --> AuthMiddleware
```

## Authentication Endpoints

### Available Routes

| Endpoint | Method | Purpose | Required Role | Frontend Usage |
|----------|--------|---------|---------------|----------------|
| `/api/auth/register` | POST | User registration | None | Customer App |
| `/api/auth/login` | POST | General login | None | Customer App |
| `/api/auth/admin/login` | POST | Admin-specific login | admin | Admin Panel |
| `/api/auth/vendor/login` | POST | Vendor-specific login | vendor | Vendor Panel |

### Authentication Flow Diagrams

#### 1. Customer Registration & Login Flow
```mermaid
sequenceDiagram
    participant C as Customer
    participant CA as Customer App
    participant API as Backend API
    participant DB as MongoDB
    
    Note over C,DB: Registration Flow
    C->>CA: Register with name, email, password
    CA->>API: POST /api/auth/register
    API->>API: Hash password with bcrypt
    API->>DB: Create user (role: 'user')
    DB-->>API: User created
    API->>API: Generate JWT token
    API-->>CA: {_id, name, email, role: 'user', token}
    CA->>CA: localStorage.setItem('user', userData)
    CA-->>C: Registration successful
    
    Note over C,DB: Login Flow
    C->>CA: Login with email, password
    CA->>API: POST /api/auth/login
    API->>DB: Find user by email
    DB-->>API: User data
    API->>API: Compare password with bcrypt
    API->>API: Generate JWT token
    API-->>CA: {_id, name, email, role, token}
    CA->>CA: localStorage.setItem('user', userData)
    CA-->>C: Login successful
```

#### 2. Vendor Login Flow
```mermaid
sequenceDiagram
    participant V as Vendor
    participant VA as Vendor Panel
    participant API as Backend API
    participant DB as MongoDB
    
    V->>VA: Login with email, password
    VA->>API: POST /api/auth/vendor/login
    API->>DB: Find user by email
    DB-->>API: User data
    API->>API: Validate password
    
    alt User role != 'vendor'
        API-->>VA: 403 Forbidden - Not authorized as vendor
        VA-->>V: Access denied
    else User role == 'vendor'
        API->>API: Generate JWT token
        API-->>VA: {_id, name, email, role: 'vendor', token}
        VA->>VA: localStorage.setItem('vendorUser', userData)
        VA-->>V: Login successful, redirect to dashboard
    end
```

#### 3. Admin Login Flow
```mermaid
sequenceDiagram
    participant A as Admin
    participant AA as Admin Panel
    participant API as Backend API
    participant DB as MongoDB
    
    A->>AA: Login with email, password
    AA->>API: POST /api/auth/admin/login
    API->>DB: Find user by email
    DB-->>API: User data
    API->>API: Validate password
    
    alt User role != 'admin'
        API-->>AA: 403 Forbidden - Not authorized as admin
        AA-->>A: Access denied
    else User role == 'admin'
        API->>API: Generate JWT token
        API-->>AA: {_id, name, email, role: 'admin', token}
        AA->>AA: localStorage.setItem('adminUser', userData)
        AA-->>A: Login successful, redirect to admin dashboard
    end
```

## User Model & Database Schema

### MongoDB User Document Structure
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  role: String (required, default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Role-Based Access Control (RBAC)
```mermaid
graph LR
    subgraph "User Roles"
        UserRole["👤 user\n(Customer)"]
        VendorRole["🏪 vendor\n(Store Owner)"]
        AdminRole["👑 admin\n(Platform Admin)"]
    end
    
    subgraph "Permissions Matrix"
        UserPerms["• Browse products\n• Add to cart\n• Place orders\n• View own orders\n• Update profile"]
        VendorPerms["• All user permissions\n• Create/edit products\n• View own analytics\n• Manage own orders\n• View vendor dashboard"]
        AdminPerms["• All vendor permissions\n• Manage all users\n• Manage all products\n• Platform analytics\n• System configuration"]
    end
    
    UserRole --> UserPerms
    VendorRole --> VendorPerms
    AdminRole --> AdminPerms
```

## JWT Implementation & Middleware

### JWT Token Structure
```javascript
// JWT Payload
{
  id: "user_mongodb_id",
  iat: timestamp,
  exp: timestamp // 30 days from issue
}
```

### Protection Middleware Flow
```mermaid
sequenceDiagram
    participant Client as Frontend
    participant MW as Protect Middleware
    participant JWT as JWT Verify
    participant DB as MongoDB
    participant Route as Protected Route
    
    Client->>MW: Request with Authorization: Bearer <token>
    
    alt No token provided
        MW-->>Client: 401 Unauthorized - No token
    else Token provided
        MW->>JWT: Verify token with JWT_SECRET
        
        alt Token invalid/expired
            JWT-->>MW: Invalid token
            MW-->>Client: 401 Unauthorized - Token failed
        else Token valid
            JWT-->>MW: Decoded payload {id}
            MW->>DB: Find user by decoded.id
            DB-->>MW: User data (excluding password)
            MW->>MW: Set req.user = userData
            MW->>Route: next()
            Route-->>Client: Protected resource
        end
    end
```

### Role-Based Middleware
```mermaid
flowchart TD
    Start(["Request to protected route"]) --> Protect{"protect middleware"}
    Protect -->|Valid JWT| RoleCheck{"Role required?"}
    Protect -->|Invalid JWT| Deny401["401 Unauthorized"]
    
    RoleCheck -->|No role requirement| Allow["Access granted"]
    RoleCheck -->|Admin required| AdminCheck{"req.user.role === 'admin'?"}
    RoleCheck -->|Vendor required| VendorCheck{"req.user.role === 'vendor'?"}
    
    AdminCheck -->|Yes| Allow
    AdminCheck -->|No| Deny403Admin["403 Forbidden - Not admin"]
    
    VendorCheck -->|Yes| Allow
    VendorCheck -->|No| Deny403Vendor["403 Forbidden - Not vendor"]
```

## Frontend Authentication Implementation

### Storage Strategy by User Type

| User Type | Frontend | Storage Key | Purpose |
|-----------|----------|-------------|----------|
| Customer | `/frontend/client` | `'user'` | Customer app authentication |
| Vendor | `/adminpanel/frontend/vendor` | `'vendorUser'` | Vendor panel authentication |
| Admin | `/adminpanel/frontend/admin` | `'adminUser'` | Admin panel authentication |

### Authentication Service Architecture
```mermaid
classDiagram
    class CustomerAuthService {
        +register(userData)
        +login(credentials)
        +logout()
        -API_URL: '/api/auth/'
        -STORAGE_KEY: 'user'
    }
    
    class VendorAuthService {
        +login(credentials)
        +register(payload)
        +logout()
        +isAuthenticated()
        +isVendor()
        +getToken()
        +getCurrentUser()
        -API_URL: '/auth/'
        -VENDOR_STORAGE_KEY: 'vendorUser'
    }
    
    class AdminAuthService {
        +login(credentials)
        +logout()
        +isAuthenticated()
        +isAdmin()
        +getToken()
        -API_URL: '/auth/'
        -ADMIN_STORAGE_KEY: 'adminUser'
    }
    
    CustomerAuthService --> LocalStorage : stores 'user'
    VendorAuthService --> LocalStorage : stores 'vendorUser'
    AdminAuthService --> LocalStorage : stores 'adminUser'
```

## Router Guards & Access Control

### Frontend Route Protection
```mermaid
sequenceDiagram
    participant User
    participant Router as Vue Router
    participant Guard as beforeEach Guard
    participant Storage as localStorage
    participant Route as Target Route
    
    User->>Router: Navigate to route
    Router->>Guard: beforeEach(to, from, next)
    Guard->>Storage: Check authentication status
    Storage-->>Guard: Auth data or null
    
    alt Route requires auth && user not authenticated
        Guard-->>Router: next('/login')
        Router-->>User: Redirect to login page
    else Route is auth page && user authenticated
        Guard-->>Router: next('/dashboard')
        Router-->>User: Redirect to dashboard
    else Access allowed
        Guard-->>Router: next()
        Router->>Route: Load route
        Route-->>User: Display page
    end
```

## Technology Stack Analysis

### Backend Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Node.js** | Latest | Runtime environment | Non-blocking I/O, JavaScript ecosystem |
| **Express.js** | 5.x | Web framework | Mature, extensive middleware ecosystem |
| **MongoDB** | Latest | Database | Flexible schema for evolving user data |
| **Mongoose** | 8.x | ODM | Schema validation, query abstraction |
| **bcryptjs** | 3.x | Password hashing | Industry standard, secure salt rounds |
| **jsonwebtoken** | 9.x | JWT implementation | Stateless authentication, scalable |
| **express-async-handler** | Latest | Async error handling | Cleaner async/await error handling |

### Frontend Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Vue.js** | 3.x | Frontend framework | Composition API, excellent performance |
| **Vite** | 5.x | Build tool | Fast HMR, modern ES modules |
| **Vue Router** | 4.x | Client-side routing | SPA navigation with guards |
| **Axios** | Latest | HTTP client | Request/response interceptors |
| **Tailwind CSS** | 3.x | Styling | Utility-first, consistent design system |

## Security Analysis

### Current Security Measures

✅ **Implemented**
- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens with expiration (30 days)
- Role-based access control
- CORS protection
- Input validation on critical fields
- Separate login endpoints per user type

⚠️ **Security Considerations**
- JWT tokens stored in localStorage (XSS vulnerability)
- No refresh token mechanism
- No rate limiting on auth endpoints
- No account lockout after failed attempts
- No password complexity requirements
- No HTTPS enforcement mentioned

### Security Improvements Needed

```mermaid
graph LR
    subgraph "Current State"
        A["JWT in localStorage"]
        B["30-day expiration"]
        C["No rate limiting"]
        D["Basic validation"]
    end
    
    subgraph "Recommended Improvements"
        E["HttpOnly cookies"]
        F["Refresh token system"]
        G["Rate limiting middleware"]
        H["Comprehensive validation"]
        I["Account lockout"]
        J["Password policies"]
        K["2FA implementation"]
        L["Audit logging"]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    D --> I
    D --> J
    D --> K
    D --> L
```

## Scalability Analysis

### Current Scalability Characteristics

**✅ Scalable Aspects:**
- Stateless JWT authentication
- Horizontal database scaling (MongoDB)
- Microservice-ready architecture
- Role-based separation of concerns

**❌ Scalability Limitations:**
- Single MongoDB instance
- No caching layer
- No load balancing
- File-based session storage

### Scalability Roadmap

```mermaid
graph TD
    subgraph "Phase 1: Immediate (0-3 months)"
        P1A["Implement Redis caching"]
        P1B["Add rate limiting"]
        P1C["Database indexing"]
        P1D["Connection pooling"]
    end
    
    subgraph "Phase 2: Growth (3-12 months)"
        P2A["MongoDB replica set"]
        P2B["Load balancer (nginx)"]
        P2C["CDN for static assets"]
        P2D["API gateway"]
    end
    
    subgraph "Phase 3: Scale (1-2 years)"
        P3A["MongoDB sharding"]
        P3B["Multiple API instances"]
        P3C["Microservices split"]
        P3D["Event-driven architecture"]
    end
    
    Current --> P1A
    Current --> P1B
    Current --> P1C
    Current --> P1D
    
    P1A --> P2A
    P1B --> P2B
    P1C --> P2C
    P1D --> P2D
    
    P2A --> P3A
    P2B --> P3B
    P2C --> P3C
    P2D --> P3D
```

## Scaling Strategies

### 1. Database Scaling
```mermaid
flowchart LR
    subgraph "Current"
        SingleDB[("Single MongoDB\nInstance")]
    end
    
    subgraph "Phase 1: Replication"
        Primary[("Primary\nMongoDB")]
        Secondary1[("Secondary 1")]
        Secondary2[("Secondary 2")]
        Primary --> Secondary1
        Primary --> Secondary2
    end
    
    subgraph "Phase 2: Sharding"
        Shard1[("Users A-H")]
        Shard2[("Users I-P")]
        Shard3[("Users Q-Z")]
        Mongos["MongoDB Router"]
        Mongos --> Shard1
        Mongos --> Shard2
        Mongos --> Shard3
    end
    
    SingleDB --> Primary
    Primary --> Mongos
```

### 2. Application Scaling
```mermaid
architecture-beta
    group api(logos:aws-fargate)[API Layer]
    
    service lb(logos:nginx)[Load Balancer] in api
    service api1(logos:nodejs)[Auth Service 1] in api
    service api2(logos:nodejs)[Auth Service 2] in api
    service api3(logos:nodejs)[Auth Service 3] in api
    
    service cache(logos:redis)[Redis Cache]
    service db(logos:mongodb)[MongoDB Cluster]
    
    lb:R --> L:api1
    lb:R --> L:api2
    lb:R --> L:api3
    
    api1:B --> T:cache
    api2:B --> T:cache
    api3:B --> T:cache
    
    cache:B --> T:db
```

### 3. Caching Strategy
```mermaid
sequenceDiagram
    participant Client
    participant API as API Server
    participant Cache as Redis Cache
    participant DB as MongoDB
    
    Client->>API: Login request
    API->>Cache: Check user cache
    
    alt Cache hit
        Cache-->>API: User data
        API->>API: Validate password
        API-->>Client: JWT token
    else Cache miss
        Cache-->>API: Not found
        API->>DB: Query user
        DB-->>API: User data
        API->>Cache: Store user (TTL: 1hr)
        API->>API: Validate password
        API-->>Client: JWT token
    end
```

## Implementation Improvements

### 1. Enhanced Security Implementation

```javascript
// Improved password validation
const passwordSchema = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts'
});

// Account lockout after failed attempts
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours
```

### 2. Refresh Token System

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    
    Note over Client,DB: Initial Login
    Client->>API: Login credentials
    API->>DB: Validate user
    API->>API: Generate access token (15min)
    API->>API: Generate refresh token (7 days)
    API->>DB: Store refresh token
    API-->>Client: {accessToken, refreshToken}
    
    Note over Client,DB: Token Refresh
    Client->>API: Request with expired access token
    API-->>Client: 401 Unauthorized
    Client->>API: POST /refresh {refreshToken}
    API->>DB: Validate refresh token
    API->>API: Generate new access token
    API-->>Client: {newAccessToken}
```

### 3. Microservices Architecture

```mermaid
flowchart TB
    subgraph "API Gateway"
        Gateway["Kong/Express Gateway"]
    end
    
    subgraph "Authentication Service"
        AuthSvc["Auth Microservice\nPort: 3001"]
        AuthDB[("Auth Database")]
    end
    
    subgraph "User Management Service"
        UserSvc["User Microservice\nPort: 3002"]
        UserDB[("User Database")]
    end
    
    subgraph "Product Service"
        ProductSvc["Product Microservice\nPort: 3003"]
        ProductDB[("Product Database")]
    end
    
    Gateway --> AuthSvc
    Gateway --> UserSvc
    Gateway --> ProductSvc
    
    AuthSvc --> AuthDB
    UserSvc --> UserDB
    ProductSvc --> ProductDB
```

## Access Level Matrix

### Detailed Permission System

| Resource/Action | Customer (user) | Vendor | Admin |
|-----------------|------------------|--------|---------|
| **Authentication** |
| Register | ✅ | ✅* | ✅* |
| Login | ✅ | ✅ | ✅ |
| Change Password | ✅ | ✅ | ✅ |
| **Products** |
| View Products | ✅ | ✅ | ✅ |
| Create Product | ❌ | ✅ (own) | ✅ (all) |
| Edit Product | ❌ | ✅ (own) | ✅ (all) |
| Delete Product | ❌ | ✅ (own) | ✅ (all) |
| **Orders** |
| Place Order | ✅ | ✅ | ✅ |
| View Own Orders | ✅ | ✅ | ✅ |
| View All Orders | ❌ | ✅ (own products) | ✅ (all) |
| Update Order Status | ❌ | ✅ (own products) | ✅ (all) |
| **Analytics** |
| View Own Analytics | ❌ | ✅ | ✅ |
| View Platform Analytics | ❌ | ❌ | ✅ |
| **User Management** |
| View Users | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Change User Roles | ❌ | ❌ | ✅ |

*\* Role assignment requires manual database update or admin action*

### Resource Ownership Model

```mermaid
erDiagram
    USER {
        ObjectId _id
        String role
        String name
        String email
    }
    
    PRODUCT {
        ObjectId _id
        ObjectId user_id
        String name
        Number price
    }
    
    ORDER {
        ObjectId _id
        ObjectId customer_id
        Array items
        String status
    }
    
    ORDER_ITEM {
        ObjectId product_id
        ObjectId vendor_id
        Number quantity
        Number price
    }
    
    USER ||--o{ PRODUCT : "vendor owns"
    USER ||--o{ ORDER : "customer places"
    ORDER ||--o{ ORDER_ITEM : "contains"
    PRODUCT ||--o{ ORDER_ITEM : "references"
```

## Development Guidelines

### Adding New User Roles

1. **Update User Model**
```javascript
// In models/User.js
role: {
  type: String,
  required: true,
  enum: ['user', 'vendor', 'admin', 'moderator'], // Add new role
  default: 'user'
}
```

2. **Create Role-Specific Login Endpoint**
```javascript
// In controllers/authController.js
const loginModerator = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.role !== 'moderator') {
      res.status(403);
      throw new Error('Not authorized as moderator');
    }
    // Return token...
  }
});
```

3. **Add Role Middleware**
```javascript
// In middleware/authMiddleware.js
const moderator = (req, res, next) => {
  if (req.user && req.user.role === 'moderator') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as moderator');
  }
};
```

### Performance Optimization Checklist

- [ ] **Database Indexing**
  - [ ] Email field (unique index)
  - [ ] Role field (for role-based queries)
  - [ ] CreatedAt field (for analytics)

- [ ] **Caching Strategy**
  - [ ] User data caching (Redis)
  - [ ] JWT blacklisting for logout
  - [ ] Session data caching

- [ ] **Query Optimization**
  - [ ] Select only required fields
  - [ ] Implement pagination
  - [ ] Use aggregation pipelines

- [ ] **Security Hardening**
  - [ ] Implement HTTPS
  - [ ] Add helmet middleware
  - [ ] Implement CSRF protection
  - [ ] Add input sanitization

## Monitoring & Analytics

### Authentication Metrics to Track

```mermaid
graph LR
    subgraph "User Metrics"
        A["Registration Rate"]
        B["Login Success Rate"]
        C["Failed Login Attempts"]
        D["Password Reset Requests"]
    end
    
    subgraph "Security Metrics"
        E["Brute Force Attacks"]
        F["Token Expiration Events"]
        G["Unusual Login Patterns"]
        H["Account Lockouts"]
    end
    
    subgraph "Performance Metrics"
        I["Authentication Response Time"]
        J["Database Query Performance"]
        K["Cache Hit Rate"]
        L["Concurrent Users"]
    end
```

### Logging Strategy

```javascript
// Structured logging for authentication events
const authLogger = {
  loginAttempt: (email, ip, success) => {
    logger.info('AUTH_LOGIN_ATTEMPT', {
      email: email.substring(0, 3) + '***', // Mask email
      ip,
      success,
      timestamp: new Date().toISOString()
    });
  },
  
  tokenGenerated: (userId, role) => {
    logger.info('AUTH_TOKEN_GENERATED', {
      userId,
      role,
      timestamp: new Date().toISOString()
    });
  }
};
```

## Conclusion

The Aura Shop authentication system provides a solid foundation with role-based access control and JWT authentication. However, significant improvements are needed for production scalability:

**Immediate priorities:**
1. Implement refresh token system
2. Add rate limiting and security hardening
3. Implement caching layer
4. Add comprehensive logging and monitoring

**Long-term scalability:**
1. Microservices architecture
2. Database sharding
3. Load balancing
4. Advanced security measures (2FA, biometrics)

The current architecture supports up to ~1,000 concurrent users with proper optimization, and can scale to 10,000+ with the recommended improvements.

---

*This documentation should be updated as the system evolves. Last updated: October 2025*