# 🌐 Aura Shop API - Complete Documentation

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🚀 Quick Start](#-quick-start)
- [🔐 Authentication](#-authentication)
- [📦 Products API](#-products-api)
- [🛒 Shopping Cart API](#-shopping-cart-api)
- [📋 Orders API](#-orders-api)
- [🏷️ Categories API](#️-categories-api)
- [🏪 Vendor API](#-vendor-api)
- [👑 Admin API](#-admin-api)
- [👤 Users API](#-users-api)
- [📈 Analytics API](#-analytics-api)
- [🔍 Search API](#-search-api)
- [📱 Mobile API](#-mobile-api)
- [🛠️ Utilities & Health](#️-utilities--health)
- [🚨 Error Handling](#-error-handling)
- [📄 Response Formats](#-response-formats)
- [📊 Rate Limiting](#-rate-limiting)
- [📝 SDK Examples](#-sdk-examples)
- [🚀 Integration Guides](#-integration-guides)

## 🎯 Overview

The Aura Shop API is a **RESTful web service** that provides comprehensive e-commerce functionality. Built with Node.js and Express, it supports multiple user types (customers, vendors, admins) with role-based access control and real-time features.

### 🏆 API Features

- **RESTful Design**: Standard HTTP methods and status codes
- **JWT Authentication**: Secure, stateless authentication
- **Role-Based Access**: Granular permissions for different user types
- **Real-Time Updates**: WebSocket support for live data
- **Comprehensive Search**: Full-text search with filtering
- **Mobile Optimized**: Endpoints designed for mobile applications
- **Rate Limited**: Protection against abuse and overuse
- **Well Documented**: Complete examples and integration guides

### 🌐 Base URL

```
Development: http://localhost:5000/api
Production:  https://api.aurashop.com/api
```

### 📊 API Versioning

Currently using **v1** (no version prefix required). Future versions will use:
```
/api/v2/endpoint
```

## 🚀 Quick Start

### 🛠️ Prerequisites

- API Base URL: `http://localhost:5000/api`
- Content-Type: `application/json`
- Authentication: Bearer token in Authorization header

### 📱 Basic Example

```javascript
// 1. Register a new user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePassword123!'
  })
});

const userData = await registerResponse.json();
const token = userData.token;

// 2. Fetch products
const productsResponse = await fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const products = await productsResponse.json();

// 3. Add item to cart
const cartResponse = await fetch('/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: products[0]._id,
    quantity: 1
  })
});
```

## 🔐 Authentication

### 📋 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | User login | ❌ |
| `POST` | `/auth/admin/login` | Admin login | ❌ |
| `POST` | `/auth/vendor/login` | Vendor login | ❌ |
| `POST` | `/auth/logout` | Logout (future) | ✅ |
| `POST` | `/auth/refresh` | Refresh token (future) | ✅ |
| `POST` | `/auth/forgot-password` | Password reset (future) | ❌ |

### 👤 User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2025-10-21T10:30:00.000Z",
  "updatedAt": "2025-10-21T10:30:00.000Z"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters (8+ recommended)

### 🔑 User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "lastLogin": "2025-10-21T11:00:00.000Z"
}
```

### 🏪 Vendor Login

**Endpoint:** `POST /api/auth/vendor/login`

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "VendorPassword123!"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Vendor Store",
  "email": "vendor@example.com",
  "role": "vendor",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "vendorInfo": {
    "businessName": "Tech Store Pro",
    "verified": true
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "Not authorized as vendor",
  "error": "INSUFFICIENT_PERMISSIONS",
  "code": 403
}
```

### 👑 Admin Login

**Endpoint:** `POST /api/auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "System Administrator",
  "email": "admin@example.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "permissions": ["users:manage", "products:manage", "system:configure"]
}
```

### 🔒 Using Authentication

**Header Format:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**JavaScript Example:**
```javascript
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  return fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    }
  });
};

// Usage
const response = await apiCall('/products', {
  method: 'GET'
});
```

## 📦 Products API

### 📋 Product Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| `GET` | `/products` | List products with filters | ❌ | - |
| `GET` | `/products/:id` | Get product details | ❌ | - |
| `POST` | `/products` | Create new product | ✅ | vendor+ |
| `PUT` | `/products/:id` | Update product | ✅ | owner/admin |
| `DELETE` | `/products/:id` | Delete product | ✅ | owner/admin |
| `GET` | `/products/search` | Search products | ❌ | - |
| `GET` | `/products/featured` | Get featured products | ❌ | - |
| `POST` | `/products/:id/review` | Add product review | ✅ | user+ |

### 📄 Product Schema

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "brand": "TechPro",
  "modelNumber": "TP-WH-2025",
  "gtin": "1234567890123",
  "categories": ["507f1f77bcf86cd799439020"],
  "variants": [
    {
      "sku": "TP-WH-2025-BLK",
      "name": "Black",
      "price": 299.99,
      "comparePrice": 399.99,
      "stock": 50,
      "weight": 0.3,
      "attributes": {
        "color": "Black",
        "size": "Standard"
      },
      "images": ["image1.jpg", "image2.jpg"]
    }
  ],
  "images": [
    {
      "url": "https://cdn.aurashop.com/products/headphones-1.jpg",
      "altText": "Premium Wireless Headphones - Main View",
      "position": 1
    }
  ],
  "attributes": {
    "connectivity": "Bluetooth 5.0",
    "batteryLife": "30 hours",
    "features": ["Noise Cancellation", "Quick Charge"]
  },
  "dimensions": {
    "length": 20,
    "width": 18,
    "height": 8,
    "unit": "cm"
  },
  "technicalSpecs": [
    {
      "name": "Frequency Response",
      "value": "20Hz - 20kHz",
      "unit": "Hz"
    }
  ],
  "user": "507f1f77bcf86cd799439012", // Vendor ID
  "tags": ["wireless", "headphones", "premium", "noise-cancelling"],
  "ratings": {
    "average": 4.5,
    "count": 128,
    "distribution": {
      "5": 75,
      "4": 35,
      "3": 12,
      "2": 4,
      "1": 2
    }
  },
  "seo": {
    "title": "Premium Wireless Headphones - Noise Cancelling | TechPro",
    "description": "Experience superior sound quality with TechPro wireless headphones",
    "keywords": ["wireless headphones", "noise cancelling", "bluetooth"]
  },
  "status": "active",
  "featured": true,
  "createdAt": "2025-10-21T10:30:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z"
}
```

### 📅 List Products

**Endpoint:** `GET /api/products`

**Query Parameters:**
```
page=1              // Page number (default: 1)
limit=20            // Items per page (default: 20, max: 100)
category=electronics // Filter by category ID or name
minPrice=50         // Minimum price filter
maxPrice=500        // Maximum price filter
brand=TechPro       // Filter by brand
tags=wireless,premium // Filter by tags (comma-separated)
sort=price          // Sort by: price, name, rating, created (default: created)
order=asc           // Sort order: asc, desc (default: desc)
featured=true       // Show only featured products
status=active       // Filter by status (active, inactive, draft)
search=headphones   // Search in name and description
```

**Request Example:**
```http
GET /api/products?category=electronics&minPrice=100&maxPrice=500&sort=price&order=asc&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Premium Wireless Headphones",
      "description": "High-quality wireless headphones...",
      "variants": [
        {
          "sku": "TP-WH-2025-BLK",
          "price": 299.99,
          "comparePrice": 399.99,
          "stock": 50
        }
      ],
      "images": [
        {
          "url": "https://cdn.aurashop.com/products/headphones-1.jpg",
          "altText": "Premium Wireless Headphones"
        }
      ],
      "ratings": {
        "average": 4.5,
        "count": 128
      },
      "featured": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "appliedFilters": {
      "category": "electronics",
      "priceRange": [100, 500]
    },
    "availableFilters": {
      "brands": ["TechPro", "AudioMax", "SoundWave"],
      "priceRanges": [
        {"min": 0, "max": 100, "count": 15},
        {"min": 100, "max": 300, "count": 23},
        {"min": 300, "max": 500, "count": 9}
      ]
    }
  }
}
```

### 🔍 Get Single Product

**Endpoint:** `GET /api/products/:id`

**Request Example:**
```http
GET /api/products/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones with advanced noise cancellation technology...",
    "brand": "TechPro",
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "name": "Electronics",
        "slug": "electronics"
      }
    ],
    "variants": [
      {
        "sku": "TP-WH-2025-BLK",
        "name": "Black",
        "price": 299.99,
        "comparePrice": 399.99,
        "stock": 50,
        "isDefault": true
      },
      {
        "sku": "TP-WH-2025-WHT",
        "name": "White",
        "price": 309.99,
        "comparePrice": 399.99,
        "stock": 32,
        "isDefault": false
      }
    ],
    "images": [
      {
        "url": "https://cdn.aurashop.com/products/headphones-1.jpg",
        "altText": "Premium Wireless Headphones - Main View",
        "position": 1
      }
    ],
    "ratings": {
      "average": 4.5,
      "count": 128,
      "distribution": {
        "5": 75,
        "4": 35,
        "3": 12,
        "2": 4,
        "1": 2
      }
    },
    "vendor": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Tech Store Pro",
      "businessName": "Tech Store Pro LLC",
      "verified": true
    },
    "relatedProducts": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Wireless Earbuds Pro",
        "price": 199.99,
        "image": "earbuds-1.jpg"
      }
    ],
    "reviews": {
      "recent": [
        {
          "_id": "507f1f77bcf86cd799439030",
          "user": {
            "name": "Alex Johnson",
            "verified": true
          },
          "rating": 5,
          "title": "Excellent sound quality!",
          "content": "These headphones exceed my expectations...",
          "createdAt": "2025-10-20T15:30:00.000Z"
        }
      ],
      "summary": {
        "totalReviews": 128,
        "averageRating": 4.5
      }
    }
  }
}
```

### ➕ Create Product

**Endpoint:** `POST /api/products`  
**Auth Required:** ✅ (Vendor or Admin)

**Request Body:**
```json
{
  "name": "Smart Watch Series X",
  "description": "Advanced fitness tracking with heart rate monitoring",
  "brand": "FitTech",
  "modelNumber": "FT-SW-X1",
  "categories": ["wearables", "fitness"],
  "variants": [
    {
      "sku": "FT-SW-X1-42MM-BLK",
      "name": "42mm Black",
      "price": 399.99,
      "comparePrice": 499.99,
      "stock": 25,
      "attributes": {
        "size": "42mm",
        "color": "Black",
        "band": "Sport Band"
      },
      "isDefault": true
    }
  ],
  "images": [
    {
      "url": "https://cdn.aurashop.com/products/smartwatch-1.jpg",
      "altText": "Smart Watch Series X - 42mm Black",
      "position": 1
    }
  ],
  "attributes": {
    "waterResistance": "50m",
    "batteryLife": "18 hours",
    "compatibility": ["iOS", "Android"]
  },
  "tags": ["smartwatch", "fitness", "health"],
  "featured": false,
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Smart Watch Series X",
    "slug": "smart-watch-series-x",
    "user": "507f1f77bcf86cd799439012",
    "status": "active",
    "createdAt": "2025-10-21T12:00:00.000Z",
    "updatedAt": "2025-10-21T12:00:00.000Z"
  }
}
```

### ✏️ Update Product

**Endpoint:** `PUT /api/products/:id`  
**Auth Required:** ✅ (Product Owner or Admin)

**Request Body** (partial update):
```json
{
  "name": "Smart Watch Series X Pro",
  "variants": [
    {
      "sku": "FT-SW-X1-42MM-BLK",
      "price": 379.99,
      "stock": 30
    }
  ],
  "featured": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Smart Watch Series X Pro",
    "featured": true,
    "updatedAt": "2025-10-21T12:30:00.000Z"
  }
}
```

### 🗑️ Delete Product

**Endpoint:** `DELETE /api/products/:id`  
**Auth Required:** ✅ (Product Owner or Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "deletedAt": "2025-10-21T13:00:00.000Z"
  }
}
```

## 🛒 Shopping Cart API

### 📋 Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/cart` | Get user's cart | ✅ |
| `POST` | `/cart/add` | Add item to cart | ✅ |
| `PUT` | `/cart/update` | Update cart item | ✅ |
| `DELETE` | `/cart/remove/:itemId` | Remove item from cart | ✅ |
| `DELETE` | `/cart/clear` | Clear entire cart | ✅ |
| `POST` | `/cart/merge` | Merge guest cart (future) | ✅ |

### 📄 Cart Schema

```json
{
  "_id": "507f1f77bcf86cd799439025",
  "user": "507f1f77bcf86cd799439011",
  "items": [
    {
      "_id": "507f1f77bcf86cd799439026",
      "product": {
        "_id": "507f1f77bcf86cd799439020",
        "name": "Premium Wireless Headphones",
        "brand": "TechPro",
        "images": [
          {
            "url": "headphones-1.jpg",
            "altText": "Premium Wireless Headphones"
          }
        ]
      },
      "variant": {
        "sku": "TP-WH-2025-BLK",
        "name": "Black",
        "price": 299.99,
        "comparePrice": 399.99,
        "stock": 50
      },
      "quantity": 2,
      "unitPrice": 299.99,
      "totalPrice": 599.98,
      "addedAt": "2025-10-21T10:30:00.000Z",
      "updatedAt": "2025-10-21T11:00:00.000Z"
    }
  ],
  "summary": {
    "totalItems": 2,
    "subtotal": 599.98,
    "tax": 47.98,
    "shipping": 9.99,
    "discount": 0,
    "total": 657.95
  },
  "appliedCoupons": [],
  "shippingAddress": null,
  "createdAt": "2025-10-21T10:30:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z"
}
```

### 📅 Get Cart

**Endpoint:** `GET /api/cart`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439025",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439026",
        "product": {
          "_id": "507f1f77bcf86cd799439020",
          "name": "Premium Wireless Headphones",
          "slug": "premium-wireless-headphones",
          "images": [
            {
              "url": "https://cdn.aurashop.com/products/headphones-1.jpg",
              "altText": "Premium Wireless Headphones"
            }
          ],
          "availability": {
            "inStock": true,
            "stockLevel": "high"
          }
        },
        "variant": {
          "sku": "TP-WH-2025-BLK",
          "name": "Black",
          "price": 299.99,
          "comparePrice": 399.99,
          "stock": 50,
          "available": true
        },
        "quantity": 2,
        "unitPrice": 299.99,
        "totalPrice": 599.98,
        "addedAt": "2025-10-21T10:30:00.000Z"
      }
    ],
    "summary": {
      "totalItems": 2,
      "subtotal": 599.98,
      "tax": 47.98,
      "shipping": 9.99,
      "discount": 0,
      "total": 657.95,
      "currency": "USD"
    },
    "messages": [
      {
        "type": "info",
        "message": "Free shipping on orders over $75"
      }
    ]
  }
}
```

### ➕ Add to Cart

**Endpoint:** `POST /api/cart/add`

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439020",
  "variantSku": "TP-WH-2025-BLK",
  "quantity": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "item": {
      "_id": "507f1f77bcf86cd799439026",
      "product": {
        "name": "Premium Wireless Headphones",
        "images": [{...}]
      },
      "quantity": 1,
      "unitPrice": 299.99,
      "totalPrice": 299.99
    },
    "cart": {
      "totalItems": 3,
      "subtotal": 899.97,
      "total": 965.94
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Insufficient stock",
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "details": {
      "requestedQuantity": 5,
      "availableStock": 2,
      "productName": "Premium Wireless Headphones"
    }
  }
}
```

### ✏️ Update Cart Item

**Endpoint:** `PUT /api/cart/update`

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439026",
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": {
    "item": {
      "_id": "507f1f77bcf86cd799439026",
      "quantity": 3,
      "totalPrice": 899.97
    },
    "cart": {
      "totalItems": 3,
      "subtotal": 899.97,
      "total": 965.94
    }
  }
}
```

### 🗑️ Remove from Cart

**Endpoint:** `DELETE /api/cart/remove/:itemId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "removedItemId": "507f1f77bcf86cd799439026",
    "cart": {
      "totalItems": 1,
      "subtotal": 299.99,
      "total": 332.94
    }
  }
}
```

## 📋 Orders API

### 📋 Order Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| `GET` | `/orders` | List user's orders | ✅ | user+ |
| `GET` | `/orders/:id` | Get order details | ✅ | owner/admin |
| `POST` | `/orders` | Create new order | ✅ | user+ |
| `PUT` | `/orders/:id/pay` | Mark order as paid | ✅ | owner |
| `PUT` | `/orders/:id/status` | Update order status | ✅ | vendor/admin |
| `PUT` | `/orders/:id/cancel` | Cancel order | ✅ | owner/admin |
| `GET` | `/orders/:id/track` | Track order shipment | ✅ | owner |

### 📄 Order Schema

```json
{
  "_id": "507f1f77bcf86cd799439030",
  "orderNumber": "AUR-2025-001234",
  "user": "507f1f77bcf86cd799439011",
  "status": "processing",
  "paymentStatus": "paid",
  "fulfillmentStatus": "unfulfilled",
  "items": [
    {
      "_id": "507f1f77bcf86cd799439031",
      "product": {
        "_id": "507f1f77bcf86cd799439020",
        "name": "Premium Wireless Headphones",
        "images": [{...}]
      },
      "variant": {
        "sku": "TP-WH-2025-BLK",
        "name": "Black"
      },
      "quantity": 2,
      "unitPrice": 299.99,
      "totalPrice": 599.98,
      "vendor": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Tech Store Pro"
      }
    }
  ],
  "pricing": {
    "subtotal": 599.98,
    "tax": 47.98,
    "shipping": 9.99,
    "discount": 50.00,
    "total": 607.95,
    "currency": "USD"
  },
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "company": "",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US",
    "phone": "+1-555-123-4567"
  },
  "billingAddress": {
    "sameAsShipping": true
  },
  "payment": {
    "method": "credit_card",
    "status": "paid",
    "transactionId": "txn_1234567890",
    "gateway": "stripe",
    "paidAt": "2025-10-21T11:00:00.000Z"
  },
  "shipping": {
    "method": "standard",
    "carrier": "FedEx",
    "trackingNumber": "1234567890",
    "estimatedDelivery": "2025-10-25T18:00:00.000Z",
    "shippedAt": "2025-10-22T10:00:00.000Z"
  },
  "timeline": [
    {
      "status": "created",
      "timestamp": "2025-10-21T10:30:00.000Z",
      "description": "Order placed successfully"
    },
    {
      "status": "paid",
      "timestamp": "2025-10-21T11:00:00.000Z",
      "description": "Payment received"
    }
  ],
  "notes": "Please handle with care - fragile items",
  "createdAt": "2025-10-21T10:30:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z"
}
```

### 📅 List Orders

**Endpoint:** `GET /api/orders`

**Query Parameters:**
```
page=1              // Page number
limit=10            // Items per page
status=processing   // Filter by status
paymentStatus=paid  // Filter by payment status
from=2025-10-01     // Date range start (ISO format)
to=2025-10-31       // Date range end (ISO format)
sort=createdAt      // Sort field
order=desc          // Sort order
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "orderNumber": "AUR-2025-001234",
      "status": "processing",
      "paymentStatus": "paid",
      "total": 607.95,
      "currency": "USD",
      "itemCount": 2,
      "createdAt": "2025-10-21T10:30:00.000Z",
      "estimatedDelivery": "2025-10-25T18:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "hasNextPage": true
  }
}
```

### 🔍 Get Order Details

**Endpoint:** `GET /api/orders/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "orderNumber": "AUR-2025-001234",
    "status": "processing",
    "paymentStatus": "paid",
    "fulfillmentStatus": "unfulfilled",
    "items": [
      {
        "product": {
          "name": "Premium Wireless Headphones",
          "brand": "TechPro",
          "images": [{...}]
        },
        "variant": {
          "sku": "TP-WH-2025-BLK",
          "name": "Black"
        },
        "quantity": 2,
        "unitPrice": 299.99,
        "totalPrice": 599.98
      }
    ],
    "pricing": {
      "subtotal": 599.98,
      "tax": 47.98,
      "shipping": 9.99,
      "total": 607.95,
      "currency": "USD"
    },
    "shippingAddress": {...},
    "timeline": [
      {
        "status": "created",
        "timestamp": "2025-10-21T10:30:00.000Z",
        "description": "Order placed successfully"
      },
      {
        "status": "paid",
        "timestamp": "2025-10-21T11:00:00.000Z",
        "description": "Payment received"
      }
    ]
  }
}
```

### ➕ Create Order

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439020",
      "variantSku": "TP-WH-2025-BLK",
      "quantity": 2,
      "unitPrice": 299.99
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US",
    "phone": "+1-555-123-4567"
  },
  "billingAddress": {
    "sameAsShipping": true
  },
  "shipping": {
    "method": "standard"
  },
  "payment": {
    "method": "credit_card",
    "token": "tok_1234567890"
  },
  "notes": "Please handle with care",
  "couponCode": "SAVE10"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "orderNumber": "AUR-2025-001234",
    "status": "pending",
    "paymentStatus": "pending",
    "total": 607.95,
    "currency": "USD",
    "paymentIntent": {
      "id": "pi_1234567890",
      "clientSecret": "pi_1234567890_secret_xyz"
    },
    "createdAt": "2025-10-21T10:30:00.000Z"
  }
}
```

## 🏷️ Categories API

### 📋 Category Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| `GET` | `/categories` | List all categories | ❌ | - |
| `GET` | `/categories/:id` | Get category details | ❌ | - |
| `POST` | `/categories` | Create category | ✅ | admin |
| `PUT` | `/categories/:id` | Update category | ✅ | admin |
| `DELETE` | `/categories/:id` | Delete category | ✅ | admin |
| `GET` | `/categories/:id/products` | Get products in category | ❌ | - |

### 📄 Category Schema

```json
{
  "_id": "507f1f77bcf86cd799439040",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and gadgets",
  "parentId": null,
  "level": 0,
  "position": 1,
  "image": {
    "url": "https://cdn.aurashop.com/categories/electronics.jpg",
    "altText": "Electronics Category"
  },
  "seo": {
    "title": "Electronics - Smartphones, Laptops & More | Aura Shop",
    "description": "Shop the latest electronics including smartphones, laptops, headphones and more.",
    "keywords": ["electronics", "smartphones", "laptops"]
  },
  "isActive": true,
  "productCount": 156,
  "children": [
    {
      "_id": "507f1f77bcf86cd799439041",
      "name": "Smartphones",
      "slug": "smartphones",
      "productCount": 45
    },
    {
      "_id": "507f1f77bcf86cd799439042",
      "name": "Laptops",
      "slug": "laptops", 
      "productCount": 32
    }
  ],
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z"
}
```

### 📅 List Categories

**Endpoint:** `GET /api/categories`

**Query Parameters:**
```
parent=null         // Filter by parent ID (null for root categories)
level=0             // Filter by hierarchy level
active=true         // Filter by active status
withProducts=true   // Include product count
hierarchical=true   // Return nested hierarchy
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "level": 0,
      "position": 1,
      "image": {
        "url": "https://cdn.aurashop.com/categories/electronics.jpg"
      },
      "productCount": 156,
      "children": [
        {
          "_id": "507f1f77bcf86cd799439041",
          "name": "Smartphones",
          "slug": "smartphones",
          "productCount": 45
        }
      ]
    }
  ]
}
```

## 🏪 Vendor API

### 📋 Vendor Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| `GET` | `/vendor/dashboard` | Get vendor dashboard data | ✅ | vendor |
| `GET` | `/vendor/products` | Get vendor's products | ✅ | vendor |
| `GET` | `/vendor/orders` | Get vendor's orders | ✅ | vendor |
| `GET` | `/vendor/analytics` | Get sales analytics | ✅ | vendor |
| `GET` | `/vendor/profile` | Get vendor profile | ✅ | vendor |
| `PUT` | `/vendor/profile` | Update vendor profile | ✅ | vendor |
| `GET` | `/vendor/payouts` | Get payout history | ✅ | vendor |

### 📈 Vendor Dashboard

**Endpoint:** `GET /api/vendor/dashboard`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalProducts": 24,
      "activeProducts": 20,
      "totalOrders": 156,
      "pendingOrders": 8,
      "totalRevenue": 12450.75,
      "monthlyRevenue": 3250.25,
      "averageOrderValue": 79.81
    },
    "recentOrders": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "orderNumber": "AUR-2025-001234",
        "customer": "John D.",
        "total": 299.99,
        "status": "processing",
        "createdAt": "2025-10-21T10:30:00.000Z"
      }
    ],
    "topProducts": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "name": "Premium Wireless Headphones",
        "sales": 45,
        "revenue": 13499.55
      }
    ],
    "analytics": {
      "salesChart": {
        "labels": ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5"],
        "data": [150, 200, 175, 225, 300]
      },
      "categoryBreakdown": [
        {
          "category": "Electronics",
          "percentage": 65.5,
          "revenue": 8154.24
        }
      ]
    },
    "notifications": [
      {
        "type": "order",
        "message": "New order #AUR-2025-001234 received",
        "timestamp": "2025-10-21T11:30:00.000Z",
        "read": false
      }
    ]
  }
}
```

### 📈 Vendor Analytics

**Endpoint:** `GET /api/vendor/analytics`

**Query Parameters:**
```
period=30d          // Time period: 7d, 30d, 90d, 1y
startDate=2025-10-01 // Custom date range start
endDate=2025-10-31   // Custom date range end
metrics=revenue,orders // Specific metrics to include
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-09-21T00:00:00.000Z",
      "end": "2025-10-21T23:59:59.000Z",
      "days": 30
    },
    "summary": {
      "totalRevenue": 3250.25,
      "totalOrders": 42,
      "averageOrderValue": 77.39,
      "conversionRate": 3.2,
      "returnRate": 1.8,
      "profitMargin": 24.5
    },
    "trends": {
      "revenueGrowth": 15.3,
      "orderGrowth": 8.7,
      "customerGrowth": 12.1
    },
    "charts": {
      "dailyRevenue": {
        "labels": ["2025-10-01", "2025-10-02", "..."],
        "data": [120.50, 85.25, 156.75]
      },
      "productPerformance": [
        {
          "productId": "507f1f77bcf86cd799439020",
          "name": "Premium Wireless Headphones",
          "revenue": 1200.75,
          "units": 4,
          "growth": 25.3
        }
      ],
      "categoryBreakdown": [
        {
          "category": "Electronics",
          "revenue": 2100.50,
          "percentage": 64.6
        }
      ]
    },
    "topCustomers": [
      {
        "customerId": "507f1f77bcf86cd799439011",
        "name": "John D.",
        "totalOrders": 3,
        "totalSpent": 645.50,
        "lastOrder": "2025-10-20T15:30:00.000Z"
      }
    ]
  }
}
```

## 👑 Admin API

### 📋 Admin Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| `GET` | `/admin/dashboard` | Get admin dashboard | ✅ | admin |
| `GET` | `/admin/users` | Manage users | ✅ | admin |
| `GET` | `/admin/orders` | View all orders | ✅ | admin |
| `GET` | `/admin/products` | Manage all products | ✅ | admin |
| `GET` | `/admin/analytics` | Platform analytics | ✅ | admin |
| `GET` | `/admin/reports` | Generate reports | ✅ | admin |
| `POST` | `/admin/users/:id/role` | Change user role | ✅ | admin |
| `PUT` | `/admin/settings` | Update platform settings | ✅ | admin |

### 📈 Admin Dashboard

**Endpoint:** `GET /api/admin/dashboard`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 1250,
      "totalVendors": 45,
      "totalProducts": 890,
      "totalOrders": 3420,
      "platformRevenue": 125450.75,
      "monthlyRevenue": 34250.25,
      "activeUsers": 456,
      "conversionRate": 3.8
    },
    "growth": {
      "users": 12.5,
      "vendors": 8.3,
      "orders": 15.7,
      "revenue": 22.4
    },
    "recentActivity": [
      {
        "type": "user_registration",
        "description": "New user registered: john@example.com",
        "timestamp": "2025-10-21T11:45:00.000Z"
      },
      {
        "type": "order_placed",
        "description": "Order #AUR-2025-001234 placed (\$299.99)",
        "timestamp": "2025-10-21T11:30:00.000Z"
      }
    ],
    "topVendors": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Tech Store Pro",
        "revenue": 8450.25,
        "orders": 156,
        "growth": 18.5
      }
    ],
    "systemHealth": {
      "apiResponseTime": 95,
      "databaseConnections": 12,
      "errorRate": 0.1,
      "uptime": 99.9
    },
    "alerts": [
      {
        "type": "warning",
        "message": "High API response time detected",
        "severity": "medium",
        "timestamp": "2025-10-21T10:15:00.000Z"
      }
    ]
  }
}
```

### 👥 User Management

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
```
page=1              // Page number
limit=20            // Items per page
role=user           // Filter by role
status=active       // Filter by status
search=john         // Search by name or email
sortBy=createdAt    // Sort field
sortOrder=desc      // Sort order
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "emailVerified": true,
      "totalOrders": 5,
      "totalSpent": 1250.75,
      "lastLogin": "2025-10-21T10:30:00.000Z",
      "createdAt": "2025-09-15T14:20:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 63,
    "totalItems": 1250,
    "itemsPerPage": 20
  },
  "summary": {
    "totalUsers": 1250,
    "activeUsers": 1180,
    "inactiveUsers": 70,
    "byRole": {
      "user": 1180,
      "vendor": 65,
      "admin": 5
    }
  }
}
```

## 🚨 Error Handling

### 📄 Standard Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "type": "ValidationError",
    "details": {
      "field": "email",
      "value": "invalid-email",
      "constraint": "Must be a valid email address"
    }
  },
  "timestamp": "2025-10-21T12:00:00.000Z",
  "path": "/api/auth/register",
  "requestId": "req_1234567890"
}
```

### 📈 HTTP Status Codes

| Status Code | Description | When Used |
|-------------|-------------|----------|
| `200` | OK | Successful GET, PUT requests |
| `201` | Created | Successful POST requests |
| `204` | No Content | Successful DELETE requests |
| `400` | Bad Request | Invalid request data |
| `401` | Unauthorized | Authentication required/failed |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists |
| `422` | Unprocessable Entity | Validation errors |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side errors |

### 🛡️ Common Error Codes

| Error Code | Description | Example |
|------------|-------------|----------|
| `VALIDATION_ERROR` | Request validation failed | Invalid email format |
| `AUTHENTICATION_REQUIRED` | No authentication provided | Missing Authorization header |
| `INVALID_CREDENTIALS` | Login credentials invalid | Wrong email/password |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions | Regular user accessing admin route |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist | Product ID not found |
| `DUPLICATE_RESOURCE` | Resource already exists | Email already registered |
| `INSUFFICIENT_STOCK` | Not enough inventory | Requesting more than available stock |
| `PAYMENT_FAILED` | Payment processing failed | Credit card declined |
| `RATE_LIMIT_EXCEEDED` | Too many requests | API rate limit hit |

### 📝 Error Examples

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "type": "ValidationError",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Authentication required",
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "type": "AuthenticationError",
    "details": {
      "reason": "No authorization header provided"
    }
  }
}
```

**Permission Error (403):**
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "type": "PermissionError",
    "details": {
      "required": ["admin"],
      "current": "user"
    }
  }
}
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "type": "RateLimitError",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetTime": "2025-10-21T12:15:00.000Z"
    }
  }
}
```

## 📄 Response Formats

### ✅ Success Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully", // Optional
  "data": {...}, // Response payload
  "meta": {      // Optional metadata
    "timestamp": "2025-10-21T12:00:00.000Z",
    "version": "1.0",
    "requestId": "req_1234567890"
  }
}
```

### 📅 List Response Format

```json
{
  "success": true,
  "data": [...], // Array of items
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "filters": {
    "applied": {...},
    "available": {...}
  }
}
```

### 📊 Metadata Response Format

```json
{
  "success": true,
  "data": {...},
  "meta": {
    "totalCount": 156,
    "processedAt": "2025-10-21T12:00:00.000Z",
    "source": "database",
    "cached": false,
    "version": "1.0"
  }
}
```

## 📊 Rate Limiting

### 📈 Rate Limit Rules

| Endpoint Category | Requests per Minute | Requests per Hour | Burst Limit |
|-------------------|--------------------|--------------------|-------------|
| **Authentication** | 5 | 20 | 10 |
| **Product Browsing** | 60 | 1000 | 100 |
| **Cart Operations** | 30 | 500 | 50 |
| **Order Management** | 10 | 100 | 20 |
| **Admin Operations** | 100 | 2000 | 200 |
| **Search & Filters** | 30 | 600 | 60 |
| **File Uploads** | 5 | 50 | 10 |

### 📄 Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1698758400
X-RateLimit-Policy: 60;w=60
```

### 🚨 Rate Limit Response

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "limit": 60,
      "remaining": 0,
      "resetTime": "2025-10-21T12:15:00.000Z",
      "retryAfter": 900
    }
  }
}
```

## 📝 SDK Examples

### 👍 JavaScript/Node.js

```javascript
class AuraShopAPI {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }

  // Authentication
  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    this.setToken(response.data.token);
    return response.data;
  }

  async login(credentials) {
    const response = await this.client.post('/auth/login', credentials);
    this.setToken(response.data.token);
    return response.data;
  }

  // Products
  async getProducts(filters = {}) {
    const response = await this.client.get('/products', { params: filters });
    return response.data;
  }

  async getProduct(id) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  // Cart
  async addToCart(productId, variantSku, quantity = 1) {
    const response = await this.client.post('/cart/add', {
      productId,
      variantSku,
      quantity
    });
    return response.data;
  }

  async getCart() {
    const response = await this.client.get('/cart');
    return response.data;
  }

  // Orders
  async createOrder(orderData) {
    const response = await this.client.post('/orders', orderData);
    return response.data;
  }

  async getOrders(filters = {}) {
    const response = await this.client.get('/orders', { params: filters });
    return response.data;
  }

  // Utility methods
  setToken(token) {
    this.token = token;
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    delete this.client.defaults.headers['Authorization'];
  }
}

// Usage
const api = new AuraShopAPI('http://localhost:5000/api');

// Register and login
const user = await api.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePassword123!'
});

// Browse products
const products = await api.getProducts({
  category: 'electronics',
  minPrice: 100,
  maxPrice: 500
});

// Add to cart
const cartItem = await api.addToCart(
  products.data[0]._id,
  products.data[0].variants[0].sku,
  2
);

// Create order
const order = await api.createOrder({
  // order data
});
```

### 🐍 Python

```python
import requests
import json
from typing import Dict, Optional, List

class AuraShopAPI:
    def __init__(self, base_url: str, token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json'
        })
        if token:
            self.set_token(token)
    
    def set_token(self, token: str):
        """Set authentication token"""
        self.token = token
        self.session.headers['Authorization'] = f'Bearer {token}'
    
    def clear_token(self):
        """Clear authentication token"""
        self.token = None
        self.session.headers.pop('Authorization', None)
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make API request"""
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, **kwargs)
        
        if not response.ok:
            raise Exception(f"API Error {response.status_code}: {response.text}")
        
        return response.json()
    
    # Authentication methods
    def register(self, user_data: Dict) -> Dict:
        """Register new user"""
        result = self._request('POST', '/auth/register', json=user_data)
        if result.get('token'):
            self.set_token(result['token'])
        return result
    
    def login(self, credentials: Dict) -> Dict:
        """Login user"""
        result = self._request('POST', '/auth/login', json=credentials)
        if result.get('token'):
            self.set_token(result['token'])
        return result
    
    # Product methods
    def get_products(self, filters: Dict = None) -> Dict:
        """Get products with optional filters"""
        params = filters or {}
        return self._request('GET', '/products', params=params)
    
    def get_product(self, product_id: str) -> Dict:
        """Get single product"""
        return self._request('GET', f'/products/{product_id}')
    
    # Cart methods
    def add_to_cart(self, product_id: str, variant_sku: str, quantity: int = 1) -> Dict:
        """Add item to cart"""
        data = {
            'productId': product_id,
            'variantSku': variant_sku,
            'quantity': quantity
        }
        return self._request('POST', '/cart/add', json=data)
    
    def get_cart(self) -> Dict:
        """Get current cart"""
        return self._request('GET', '/cart')
    
    # Order methods
    def create_order(self, order_data: Dict) -> Dict:
        """Create new order"""
        return self._request('POST', '/orders', json=order_data)
    
    def get_orders(self, filters: Dict = None) -> Dict:
        """Get user orders"""
        params = filters or {}
        return self._request('GET', '/orders', params=params)

# Usage example
api = AuraShopAPI('http://localhost:5000/api')

# Register
user = api.register({
    'name': 'John Doe',
    'email': 'john@example.com',
    'password': 'SecurePassword123!'
})

# Get products
products = api.get_products({
    'category': 'electronics',
    'limit': 10
})

# Add to cart
cart_result = api.add_to_cart(
    products['data'][0]['_id'],
    products['data'][0]['variants'][0]['sku'],
    2
)

print(f"Added to cart: {cart_result['message']}")
```

### 🐱 cURL Examples

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'

# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }' | jq -r '.token')

# Get products
curl -X GET "http://localhost:5000/api/products?category=electronics&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "507f1f77bcf86cd799439020",
    "variantSku": "TP-WH-2025-BLK",
    "quantity": 1
  }'

# Get cart
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @order.json
```

## 🚀 Integration Guides

### 🎨 Frontend Integration (React)

```jsx
// hooks/useAuraShop.js
import { useState, useEffect, createContext, useContext } from 'react';
import { AuraShopAPI } from '../services/api';

const AuraShopContext = createContext();

export function AuraShopProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const api = new AuraShopAPI('http://localhost:5000/api');
  
  useEffect(() => {
    // Initialize from localStorage
    const token = localStorage.getItem('aurashop_token');
    if (token) {
      api.setToken(token);
      loadUserData();
    } else {
      setLoading(false);
    }
  }, []);
  
  const loadUserData = async () => {
    try {
      const [userResponse, cartResponse] = await Promise.all([
        api.getCurrentUser(),
        api.getCart()
      ]);
      
      setUser(userResponse.data);
      setCart(cartResponse.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    const response = await api.login(credentials);
    localStorage.setItem('aurashop_token', response.token);
    setUser(response);
    await loadCart();
    return response;
  };
  
  const logout = () => {
    api.clearToken();
    localStorage.removeItem('aurashop_token');
    setUser(null);
    setCart(null);
  };
  
  const addToCart = async (productId, variantSku, quantity = 1) => {
    const response = await api.addToCart(productId, variantSku, quantity);
    setCart(response.data.cart);
    return response;
  };
  
  const value = {
    api,
    user,
    cart,
    loading,
    login,
    logout,
    addToCart,
    isAuthenticated: !!user
  };
  
  return (
    <AuraShopContext.Provider value={value}>
      {children}
    </AuraShopContext.Provider>
  );
}

export function useAuraShop() {
  const context = useContext(AuraShopContext);
  if (!context) {
    throw new Error('useAuraShop must be used within AuraShopProvider');
  }
  return context;
}

// components/ProductList.jsx
import { useState, useEffect } from 'react';
import { useAuraShop } from '../hooks/useAuraShop';

export function ProductList({ category }) {
  const { api, addToCart } = useAuraShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProducts();
  }, [category]);
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts({ category });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = async (product) => {
    try {
      await addToCart(
        product._id,
        product.variants[0].sku,
        1
      );
      alert('Added to cart successfully!');
    } catch (error) {
      alert('Failed to add to cart: ' + error.message);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product._id} className="border rounded-lg p-4">
          <img 
            src={product.images[0]?.url} 
            alt={product.name}
            className="w-full h-48 object-cover mb-4"
          />
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-xl font-bold mb-4">
            ${product.variants[0]?.price}
          </p>
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 📱 Mobile Integration (React Native)

```jsx
// services/AuraShopAPI.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuraShopAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const token = await AsyncStorage.getItem('aurashop_token');
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...options
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      await AsyncStorage.setItem('aurashop_token', response.token);
    }
    
    return response;
  }

  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/products?${params}`);
  }
}

// components/ProductScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { AuraShopAPI } from '../services/AuraShopAPI';

const api = new AuraShopAPI('http://localhost:5000/api');

export function ProductScreen({ route }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.getProducts({ category });
      setProducts(response.data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      await api.request('/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id,
          variantSku: product.variants[0].sku,
          quantity: 1
        })
      });
      Alert.alert('Success', 'Added to cart!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.images[0]?.url }}
        style={styles.productImage}
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>
        ${item.variants[0]?.price}
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  productList: {
    padding: 16
  },
  productCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  productPrice: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 8
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
```

---

## 🎆 Conclusion

This comprehensive API documentation provides everything needed to integrate with the Aura Shop e-commerce platform. The RESTful API supports:

- **Complete E-commerce Functionality**: From product browsing to order completion
- **Multi-User Support**: Customer, vendor, and admin roles with appropriate permissions
- **Scalable Architecture**: Designed for growth with proper caching and rate limiting
- **Developer-Friendly**: Clear documentation with examples in multiple languages
- **Mobile-Ready**: Optimized endpoints for mobile applications
- **Secure**: JWT authentication with role-based access control

**Getting Started:**
1. Set up your development environment
2. Register for API access
3. Implement authentication flow
4. Integrate core functionality (products, cart, orders)
5. Add advanced features as needed

**Support & Resources:**
- **API Status**: [status.aurashop.com](https://status.aurashop.com)
- **Developer Portal**: [developers.aurashop.com](https://developers.aurashop.com)
- **Support Email**: [api-support@aurashop.com](mailto:api-support@aurashop.com)
- **Community Forum**: [forum.aurashop.com](https://forum.aurashop.com)

---

*This API documentation is continuously updated. For the latest version, visit our developer portal.*

**Last Updated**: October 21, 2025  
**API Version**: 1.0  
**Documentation Version**: 2.0
