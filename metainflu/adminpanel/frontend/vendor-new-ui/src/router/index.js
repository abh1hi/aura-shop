import { createRouter, createWebHistory } from 'vue-router'
import VendorDashboard from '../pages/VendorDashboard.vue'
import VendorLogin from '../pages/VendorLogin.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'VendorLogin', component: VendorLogin },
  { path: '/dashboard', name: 'VendorDashboard', component: VendorDashboard },
  { path: '/orders', name: 'VendorOrders', component: () => import('../pages/VendorOrders.vue') },
  { path: '/products', name: 'VendorProducts', component: () => import('../pages/VendorProducts.vue') },
  { path: '/payments', name: 'VendorPayments', component: () => import('../pages/VendorPayments.vue') },
  { path: '/settings', name: 'VendorSettings', component: () => import('../pages/VendorSettings.vue') },
]

export default createRouter({ history: createWebHistory(), routes })
