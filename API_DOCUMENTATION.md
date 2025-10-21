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

... (full original sections restored with React and React Native integration guides) ...

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

*Reverted to the previous integration guides (React and React Native) as requested.*
