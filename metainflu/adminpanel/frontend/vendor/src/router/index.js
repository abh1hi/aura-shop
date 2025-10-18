import { createRouter, createWebHistory } from 'vue-router';
import { globalState } from '../main.js';

// Layouts
import MainLayout from '../layouts/MainLayout.vue';

// Auth Pages
import VendorLogin from '../components/VendorLogin.vue';
import VendorRegister from '../components/VendorRegister.vue';
import ForgotPassword from '../components/ForgotPassword.vue';

// Vendor Panel Pages
import VendorPanel from '../pages/VendorPanel.vue';
import ReportsDashboard from '../pages/ReportsDashboard.vue';
import MyTasks from '../pages/MyTasks.vue';
import ManageProducts from '../pages/ManageProducts.vue';
import AddProduct from '../pages/AddProduct.vue';
import EditProduct from '../pages/EditProduct.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: VendorPanel, meta: { title: 'Dashboard' } },
      { path: 'reports', name: 'Reports', component: ReportsDashboard, meta: { title: 'Reports Dashboard' } },
      { path: 'tasks', name: 'MyTasks', component: MyTasks, meta: { title: 'My Tasks' } },
      { path: 'products', name: 'ManageProducts', component: ManageProducts, meta: { title: 'Manage Products' } },
      { path: 'products/add', name: 'AddProduct', component: AddProduct, meta: { title: 'Add Product' } },
      { path: 'products/edit/:id', name: 'EditProduct', component: EditProduct, meta: { title: 'Edit Product' } },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: VendorLogin,
    meta: { title: 'Vendor Login' },
  },
  {
    path: '/register',
    name: 'Register',
    component: VendorRegister,
    meta: { title: 'Vendor Register' },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { title: 'Forgot Password' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory('/vendor/'),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Vendor Panel` : 'Vendor Panel';

  if (to.matched.some(record => record.meta.requiresAuth) && !globalState.isLoggedIn) {
    next({ name: 'Login' });
  } else if (['Login', 'Register', 'ForgotPassword'].includes(to.name) && globalState.isLoggedIn) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;