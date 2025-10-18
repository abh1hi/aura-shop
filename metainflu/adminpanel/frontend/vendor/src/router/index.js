/*
  File: metainflu/adminpanel/frontend/vendor/src/router/index.js
  Purpose: Defines navigation routes for the mobile-first vendor panel.
  New routes added for Dashboard, Reports, and MyTasks.
*/
import { createRouter, createWebHistory } from 'vue-router';

// Import auth pages
import VendorLogin from '../components/VendorLogin.vue';
import VendorRegister from '../components/VendorRegister.vue';
import ForgotPassword from '../components/ForgotPassword.vue';

// Import core application pages
import VendorPanel from '../pages/VendorPanel.vue';          // New Dashboard
import ReportsDashboard from '../pages/ReportsDashboard.vue'; // New Reports Page
import MyTasks from '../pages/MyTasks.vue';                   // New Tasks Page
import ManageProducts from '../pages/ManageProducts.vue';
import AddProduct from '../pages/AddProduct.vue';
import EditProduct from '../pages/EditProduct.vue';

const routes = [
  // Authentication Routes
  { path: '/login', name: 'Login', component: VendorLogin, meta: { title: 'Vendor Login' } },
  { path: '/register', name: 'Register', component: VendorRegister, meta: { title: 'Vendor Register' } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { title: 'Forgot Password' } },

  // Main Application Routes (Requires Auth)
  {
    path: '/',
    name: 'Dashboard',
    component: VendorPanel,
    meta: { requiresAuth: true, title: 'Dashboard' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsDashboard,
    meta: { requiresAuth: true, title: 'Reports Dashboard' }
  },
  {
    path: '/tasks',
    name: 'MyTasks',
    component: MyTasks,
    meta: { requiresAuth: true, title: 'My Tasks' }
  },
  {
    path: '/products',
    name: 'ManageProducts',
    component: ManageProducts,
    meta: { requiresAuth: true, title: 'Manage Products' }
  },
  {
    path: '/products/add',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true, title: 'Add Product' }
  },
  {
    path: '/products/edit/:id',
    name: 'EditProduct',
    component: EditProduct,
    meta: { requiresAuth: true, title: 'Edit Product' }
  },

  // 404/Catch-all redirection
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory('/vendor/'),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  // Prefer the global store exposed on window to avoid circular imports
  const store = (typeof window !== 'undefined' && window.__globalStore) ? window.__globalStore : { isLoggedIn: false };

  // Update page title (for native/browser title bar)
  document.title = to.meta.title ? `${to.meta.title} | Subtracker Vendor` : 'Subtracker Vendor Panel';

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next({ name: 'Login' });
  } else if (['Login', 'Register', 'ForgotPassword'].includes(to.name) && store.isLoggedIn) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
