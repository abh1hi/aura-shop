// Main entry point for the Vendor Panel
// This file serves as the module index for the vendor webapp

// Import and re-export all main components
export { default as App } from './src/App.vue';
export { default as router } from './src/router/index.js';

// Import and re-export all page components
export { default as VendorPanel } from './src/pages/VendorPanel.vue';
export { default as Analytics } from './src/pages/Analytics.vue';
export { default as ManageProducts } from './src/pages/ManageProducts.vue';
export { default as AddProduct } from './src/pages/AddProduct.vue';
export { default as EditProduct } from './src/pages/EditProduct.vue';
export { default as OrderFulfillment } from './src/pages/OrderFulfillment.vue';
export { default as Invoices } from './src/pages/Invoices.vue';
export { default as ViewSales } from './src/pages/ViewSales.vue';
export { default as Account } from './src/pages/Account.vue';
export { default as VendorLanding } from './src/pages/VendorLanding.vue';

// Import and re-export vendor components
export { default as VendorNavbar } from './src/components/VendorNavbar.vue';
export { default as VendorSidebar } from './src/components/VendorSidebar.vue';
export { default as HelloWorld } from './src/components/HelloWorld.vue';

// Import and re-export services
export { default as authService } from './src/services/authService.js';

// Import and re-export styles
import './src/index.css';
import './src/style.css';

// Configuration exports
export { default as viteConfig } from './vite.config.js';
export { default as tailwindConfig } from './tailwind.config.js';
export { default as postcssConfig } from './postcss.config.js';

// Package information
export const packageInfo = {
  name: 'vendor-webapp',
  version: '1.0.0',
  description: 'Vue.js based vendor webapp for Aura Shop',
  main: 'index.js',
  type: 'module',
  dependencies: {
    vue: '^3.4.21',
    'vue-router': '^4.5.1'
  },
  devDependencies: {
    '@vitejs/plugin-vue': '^5.0.4',
    autoprefixer: '^10.4.19',
    postcss: '^8.4.38',
    tailwindcss: '^3.4.3',
    vite: '^5.2.0'
  }
};

// Utility functions for the vendor panel
export const utils = {
  // Initialize the vendor app
  initializeApp: () => {
    const { createApp } = require('vue');
    const App = require('./src/App.vue').default;
    const router = require('./src/router').default;
    
    return createApp(App).use(router);
  },
  
  // Get all available routes
  getRoutes: () => {
    return [
      { name: 'VendorPanel', path: '/', component: 'VendorPanel' },
      { name: 'Analytics', path: '/analytics', component: 'Analytics' },
      { name: 'ManageProducts', path: '/products', component: 'ManageProducts' },
      { name: 'AddProduct', path: '/products/add', component: 'AddProduct' },
      { name: 'EditProduct', path: '/products/edit/:id', component: 'EditProduct' },
      { name: 'OrderFulfillment', path: '/orders', component: 'OrderFulfillment' },
      { name: 'Invoices', path: '/invoices', component: 'Invoices' },
      { name: 'ViewSales', path: '/sales', component: 'ViewSales' },
      { name: 'Account', path: '/account', component: 'Account' },
      { name: 'VendorLanding', path: '/landing', component: 'VendorLanding' }
    ];
  },
  
  // Get available components
  getComponents: () => {
    return {
      layout: ['VendorNavbar', 'VendorSidebar'],
      pages: ['VendorPanel', 'Analytics', 'ManageProducts', 'AddProduct', 'EditProduct', 'OrderFulfillment', 'Invoices', 'ViewSales', 'Account', 'VendorLanding'],
      common: ['HelloWorld']
    };
  }
};

// Development utilities
export const devUtils = {
  // Start development server
  startDev: () => {
    console.log('Starting Vendor Webapp development server...');
    console.log('Available at: http://localhost:5173');
  },
  
  // Build for production
  build: () => {
    console.log('Building Vendor Webapp for production...');
  },
  
  // Preview production build
  preview: () => {
    console.log('Previewing production build...');
  }
};

// Export default configuration
export default {
  packageInfo,
  utils,
  devUtils
};