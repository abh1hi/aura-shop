import { createRouter, createWebHistory } from 'vue-router';
import { globalState } from '../main.js';
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
import Contact from '../pages/Contact.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import Account from '../pages/Account.vue';
import Cart from '../pages/Cart.vue';
import Checkout from '../pages/Checkout.vue';
import OrderPlaced from '../pages/OrderPlaced.vue';
import CustomerService from '../pages/CustopmerService.vue';
import LiveChat from '../pages/LiveChat.vue';
import Shop from '../pages/Shop.vue';

// Import Vendor Pages
import VendorPanelLayout from '../layouts/VendorPanelLayout.vue';
import VendorPanel from '../pages/VendorPanel.vue';
import AddProduct from '../pages/AddProduct.vue'; // <-- Re-added this component
import ManageProducts from '../pages/ManageProducts.vue'; // <-- Existing
import OrderFulfillment from '../pages/OrderFulfillment.vue'; // <-- Existing
import Analytics from '../pages/Analytics.vue'; // <-- Existing
import Returns from '../pages/Returns.vue';
import Invoices from '../pages/Invoices.vue';
import ViewSales from '../pages/ViewSales.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true },
  },
  {
    path: '/order-placed',
    name: 'OrderPlaced',
    component: OrderPlaced,
    meta: { requiresAuth: true },
  },
  {
    path: '/customer-service',
    name: 'CustomerService',
    component: CustomerService,
  },
  {
    path: '/live-chat',
    name: 'LiveChat',
    component: LiveChat,
  },
  {
    path: '/vendor-panel',
    component: VendorPanelLayout,
    meta: { requiresAuth: true, requiresVendor: true },
    children: [
      {
        path: '',
        name: 'VendorPanel',
        component: VendorPanel,
      },
      // --- New/Updated Routes for Vendor Features ---
      {
        // New route for product listing page
        path: 'manage-products',
        name: 'ManageProducts',
        component: ManageProducts,
      },
      {
        // Dedicated route for the Add Product form
        path: 'add-product',
        name: 'AddProduct',
        component: AddProduct,
      },
      {
        path: 'order-fulfillment',
        name: 'OrderFulfillment',
        component: OrderFulfillment,
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: Analytics,
      },
      // Redirection/Cleanup of old routes to the new, richer pages
      {
        path: 'view-sales',
        redirect: { name: 'OrderFulfillment' },
      },
      {
        path: 'invoices',
        redirect: { name: 'Analytics' },
      },
      {
        path: 'returns',
        redirect: { name: 'OrderFulfillment' },
      },
      {
        // Catch-all redirect for outdated /add-product links from the sidebar/navbar
        path: 'add-product-old',
        redirect: { name: 'AddProduct' },
      },
    ],
  },
  // The warnings about missing routes like /sustainability, /faq, and /shipping are due
  // to hardcoded links in Footer/Header that don't match router paths.
  // We should add stub routes or update the external links.
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = globalState.isLoggedIn;
  const userRole = globalState.user ? globalState.user.role : null;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' });
  } else if (to.meta.requiresVendor && userRole !== 'vendor') {
    next({ name: 'Home' }); // Or redirect to an unauthorized page
  } else {
    next();
  }
});

export default router;
