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

... (unchanged sections above) ...

## 📝 SDK Examples

### 👍 JavaScript/Node.js

```javascript
// SDK client remains the same as before
```

## 🚀 Integration Guides

### 🎨 Frontend Integration (Vue 3)

```bash
# Install dependencies
npm install axios pinia vue-router
```

```javascript
// src/services/api.js
import axios from 'axios';

export class AuraShopAPI {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  setToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('aurashop_token', token);
  }

  clearToken() {
    delete this.client.defaults.headers.common['Authorization'];
    localStorage.removeItem('aurashop_token');
  }

  // Auth
  register(data) { return this.client.post('/auth/register', data).then(r => r.data); }
  login(data) { return this.client.post('/auth/login', data).then(r => r.data); }

  // Products
  getProducts(params) { return this.client.get('/products', { params }).then(r => r.data); }
  getProduct(id) { return this.client.get(`/products/${id}`).then(r => r.data); }

  // Cart
  getCart() { return this.client.get('/cart').then(r => r.data); }
  addToCart(productId, variantSku, quantity=1) {
    return this.client.post('/cart/add', { productId, variantSku, quantity }).then(r => r.data);
  }

  // Orders
  createOrder(payload) { return this.client.post('/orders', payload).then(r => r.data); }
}

export const api = new AuraShopAPI('/api');
```

```javascript
// src/stores/auth.js (Pinia)
import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: localStorage.getItem('aurashop_token') || null, loading: false, error: null }),
  getters: {
    isAuthenticated: state => !!state.token,
    userRole: state => state.user?.role || 'guest'
  },
  actions: {
    async init() {
      const token = this.token;
      if (token) api.setToken(token);
    },
    async register(payload) {
      this.loading = true; this.error = null;
      try {
        const data = await api.register(payload);
        this.user = data; this.token = data.token; api.setToken(data.token);
        return data;
      } catch (e) { this.error = e.message || 'Register failed'; throw e; }
      finally { this.loading = false; }
    },
    async login(payload) {
      this.loading = true; this.error = null;
      try {
        const data = await api.login(payload);
        this.user = data; this.token = data.token; api.setToken(data.token);
        return data;
      } catch (e) { this.error = e.message || 'Login failed'; throw e; }
      finally { this.loading = false; }
    },
    logout() {
      this.user = null; this.token = null; api.clearToken();
    }
  }
});
```

```javascript
// src/stores/cart.js (Pinia)
import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [], summary: null, loading: false }),
  getters: {
    itemCount: state => state.items.reduce((s,i)=>s+i.quantity,0),
    subtotal: state => state.summary?.subtotal || 0
  },
  actions: {
    async fetchCart() {
      this.loading = true;
      try { const res = await api.getCart(); this.items = res.data.items; this.summary = res.data.summary; }
      finally { this.loading = false; }
    },
    async add(productId, variantSku, qty=1) {
      const res = await api.addToCart(productId, variantSku, qty);
      await this.fetchCart();
      return res;
    }
  }
});
```

```javascript
// src/router/index.js (Vue Router)
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Product from '@/pages/Product.vue';
import Cart from '@/pages/Cart.vue';
import Login from '@/pages/Login.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/', component: Home },
  { path: '/product/:id', component: Product, props: true },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/login', component: Login }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next({ path: '/login', query: { redirect: to.fullPath } });
  next();
});

export default router;
```

```vue
<!-- src/pages/Home.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div v-for="p in products" :key="p._id" class="border rounded-lg p-4">
      <img :src="p.images?.[0]?.url" :alt="p.name" class="w-full h-48 object-cover mb-4" />
      <h3 class="text-lg font-semibold">{{ p.name }}</h3>
      <p class="text-gray-600 mb-2">{{ p.description }}</p>
      <p class="text-xl font-bold mb-4">{{ p.variants?.[0]?.price }}</p>
      <RouterLink :to="{ path: '/product/'+p._id }" class="bg-blue-500 text-white px-4 py-2 rounded">View</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from '@/services/api';

const products = ref([]);

onMounted(async () => {
  const res = await api.getProducts({ limit: 12 });
  products.value = res.data;
});
</script>
```

```vue
<!-- src/pages/Product.vue -->
<template>
  <div v-if="product" class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
    <img :src="product.images?.[0]?.url" :alt="product.name" class="w-full rounded" />
    <div>
      <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
      <p class="mb-4 text-gray-600">{{ product.description }}</p>
      <p class="text-xl font-semibold mb-4">{{ product.variants?.[0]?.price }}</p>
      <button @click="add()" class="bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/services/api';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const cart = useCartStore();
const product = ref(null);

onMounted(async () => {
  const res = await api.getProduct(route.params.id);
  product.value = res.data;
});

const add = async () => {
  const v = product.value.variants?.[0];
  await cart.add(product.value._id, v.sku, 1);
};
</script>
```

```vue
<!-- src/pages/Login.vue -->
<template>
  <form @submit.prevent="submit" class="max-w-sm mx-auto space-y-4">
    <input v-model="email" type="email" placeholder="Email" class="w-full border p-2 rounded" />
    <input v-model="password" type="password" placeholder="Password" class="w-full border p-2 rounded" />
    <button class="w-full bg-black text-white p-2 rounded">Login</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const submit = async () => {
  await auth.login({ email: email.value, password: password.value });
  router.push(route.query.redirect || '/');
};
</script>
```

### 📱 Mobile Integration (Vue + Capacitor)

```bash
# Add Capacitor to Vue app
npm install @capacitor/core @capacitor/cli
npx cap init "Aura Shop" com.aurashop.app

# Add platforms
npx cap add android
npx cap add ios

# Build and sync
npm run build
npx cap sync
```

```javascript
// Example: using Capacitor Storage for token persistence
import { Storage } from '@capacitor/storage';

export async function setToken(token) {
  await Storage.set({ key: 'aurashop_token', value: token });
}

export async function getToken() {
  const { value } = await Storage.get({ key: 'aurashop_token' });
  return value;
}
```

---

This section now provides Vue 3 integration examples for web and Vue + Capacitor for mobile. Replace paths if your project structure differs.
