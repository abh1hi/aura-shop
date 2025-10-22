import { createRouter, createWebHashHistory } from 'vue-router';

// Import components directly
import Home from '../pages/Home.vue';
import HomeNotLogin from '../pages/HomeNotLogin.vue';
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
import ProductDetail from '../pages/ProductDetail.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    // Use HomeNotLogin as default, redirect in beforeEach if logged in
    component: HomeNotLogin,
  },
  {
    path: '/home-logged-in',
    name: 'HomeLoggedIn', 
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
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
];

// Use createWebHashHistory for better Capacitor compatibility
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Function to get global state safely
function getGlobalState() {
  try {
    // Check if we have localStorage available
    if (typeof localStorage !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return {
        isLoggedIn: !!savedUser,
        user: savedUser ? JSON.parse(savedUser) : null,
      };
    }
  } catch (e) {
    console.warn('Could not access localStorage:', e);
  }
  return { isLoggedIn: false, user: null };
}

router.beforeEach((to, from, next) => {
  const globalState = getGlobalState();
  const isLoggedIn = globalState.isLoggedIn;
  const userRole = globalState.user ? globalState.user.role : null;

  // Redirect to appropriate home page
  if (to.name === 'Home' && isLoggedIn) {
    next({ name: 'HomeLoggedIn' });
    return;
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' });
  } else if (to.meta.requiresVendor && userRole !== 'vendor') {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;