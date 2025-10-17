/*
  File: metainflu/adminpanel/frontend/vendor/src/router/index.js
  Purpose: This file defines the navigation routes for the vendor panel Vue application.
  It maps URL paths to their corresponding page components.
*/

import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/authService.js';

// Import page components
import VendorPanel from '../pages/VendorPanel.vue';
import Analytics from '../pages/Analytics.vue';
import ManageProducts from '../pages/ManageProducts.vue';
import AddProduct from '../pages/AddProduct.vue';
import EditProduct from '../pages/EditProduct.vue';
import OrderFulfillment from '../pages/OrderFulfillment.vue';
import Invoices from '../pages/Invoices.vue';
import ViewSales from '../pages/ViewSales.vue';
import Account from '../pages/Account.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: VendorPanel,
    meta: { 
      title: 'Vendor Dashboard',
      requiresAuth: true,
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: { 
      title: 'Sales Analytics',
      requiresAuth: true,
      breadcrumb: 'Analytics'
    }
  },
  {
    path: '/products',
    name: 'ManageProducts',
    component: ManageProducts,
    meta: { 
      title: 'Manage Products',
      requiresAuth: true,
      breadcrumb: 'Products'
    }
  },
  {
    path: '/products/add',
    name: 'AddProduct',
    component: AddProduct,
    meta: { 
      title: 'Add New Product',
      requiresAuth: true,
      breadcrumb: 'Add Product',
      parent: 'ManageProducts'
    }
  },
  {
    path: '/products/edit/:id',
    name: 'EditProduct',
    component: EditProduct,
    props: true,
    meta: { 
      title: 'Edit Product',
      requiresAuth: true,
      breadcrumb: 'Edit Product',
      parent: 'ManageProducts'
    }
  },
  {
    path: '/orders',
    name: 'OrderFulfillment',
    component: OrderFulfillment,
    meta: { 
      title: 'Order Fulfillment',
      requiresAuth: true,
      breadcrumb: 'Orders'
    }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: Invoices,
    meta: { 
      title: 'Invoices',
      requiresAuth: true,
      breadcrumb: 'Invoices'
    }
  },
  {
    path: '/sales',
    name: 'ViewSales',
    component: ViewSales,
    meta: { 
      title: 'View Sales',
      requiresAuth: true,
      breadcrumb: 'Sales'
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { 
      title: 'Account Settings',
      requiresAuth: true,
      breadcrumb: 'Account'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/LoginForm.vue'),
    meta: { 
      title: 'Login',
      requiresAuth: false,
      hideNavigation: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue'),
    meta: { 
      title: '404 - Page Not Found',
      requiresAuth: false
    }
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory('/vendor/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - Aura Shop Vendor` : 'Aura Shop Vendor Panel';
  
  // Check authentication requirement
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authService.isAuthenticated();
    const isVendor = await authService.isVendor();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      next({ 
        name: 'Login', 
        query: { redirect: to.fullPath } 
      });
      return;
    }
    
    if (!isVendor) {
      // Redirect to unauthorized page if not a vendor
      next({ 
        name: 'Unauthorized'
      });
      return;
    }
  }
  
  // Redirect authenticated users away from login page
  if (to.name === 'Login') {
    const isAuthenticated = await authService.isAuthenticated();
    if (isAuthenticated) {
      next({ name: 'Dashboard' });
      return;
    }
  }
  
  next();
});

// After navigation
router.afterEach((to, from) => {
  // Track page views for analytics
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_TRACKING_ID', {
      page_path: to.path,
      page_title: to.meta.title
    });
  }
  
  // Update breadcrumbs
  updateBreadcrumbs(to);
});

// Helper function to update breadcrumbs
function updateBreadcrumbs(route) {
  const breadcrumbs = [];
  
  // Add home/dashboard
  breadcrumbs.push({
    text: 'Dashboard',
    to: { name: 'Dashboard' }
  });
  
  // Add parent route if exists
  if (route.meta.parent) {
    const parentRoute = routes.find(r => r.name === route.meta.parent);
    if (parentRoute) {
      breadcrumbs.push({
        text: parentRoute.meta.breadcrumb,
        to: { name: parentRoute.name }
      });
    }
  }
  
  // Add current route (if not dashboard)
  if (route.name !== 'Dashboard') {
    breadcrumbs.push({
      text: route.meta.breadcrumb || route.name,
      to: null // Current page, no link
    });
  }
  
  // Store breadcrumbs in router for components to access
  router.currentBreadcrumbs = breadcrumbs;
}

// Export route configuration for external use
export const routeConfig = {
  baseUrl: '/vendor/',
  routes: routes.map(route => ({
    name: route.name,
    path: route.path,
    title: route.meta?.title,
    requiresAuth: route.meta?.requiresAuth,
    breadcrumb: route.meta?.breadcrumb
  }))
};

// Export navigation helpers
export const navigationHelpers = {
  // Get all main navigation routes (excluding login, 404, etc.)
  getMainRoutes: () => {
    return routes.filter(route => 
      route.meta?.requiresAuth && 
      !route.meta?.hideNavigation &&
      !route.meta?.parent
    );
  },
  
  // Get product-related routes
  getProductRoutes: () => {
    return routes.filter(route => 
      route.path.startsWith('/products')
    );
  },
  
  // Check if route exists
  routeExists: (routeName) => {
    return routes.some(route => route.name === routeName);
  },
  
  // Get route by name
  getRoute: (routeName) => {
    return routes.find(route => route.name === routeName);
  }
};

export default router;