// File: frontend/client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
import Contact from '../pages/Contact.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Account from '../pages/Account.vue';
import Cart from '../pages/Cart.vue';
import Checkout from '../pages/Checkout.vue';
import OrderPlaced from '../pages/OrderPlaced.vue';
import CustomerService from '../pages/CustopmerService.vue';
import LiveChat from '../pages/LiveChat.vue';
import Shop from '../pages/Shop.vue';

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
    path: '/account',
    name: 'Account',
    component: Account,
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
  },
  {
    path: '/order-placed',
    name: 'OrderPlaced',
    component: OrderPlaced,
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
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;

