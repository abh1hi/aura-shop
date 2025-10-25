import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../pages/AdminDashboard.vue'
import AdminLogin from '../pages/AdminLogin.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/analytics',
    name: 'AdminAnalytics',
    component: () => import('../pages/AdminAnalytics.vue')
  },
  {
    path: '/hero-banners',
    name: 'AdminHeroBanners',
    component: () => import('../pages/AdminHeroBanners.vue')
  },
  {
    path: '/featured-collections',
    name: 'AdminFeaturedCollections',
    component: () => import('../pages/AdminFeaturedCollections.vue')
  },
  {
    path: '/products',
    name: 'AdminProducts',
    component: () => import('../pages/AdminProducts.vue')
  },
  {
    path: '/categories',
    name: 'AdminCategories',
    component: () => import('../pages/AdminCategories.vue')
  },
  {
    path: '/users',
    name: 'AdminUsers',
    component: () => import('../pages/AdminUsers.vue')
  },
  {
    path: '/campaigns',
    name: 'AdminCampaigns',
    component: () => import('../pages/AdminCampaigns.vue')
  },
  {
    path: '/influencers',
    name: 'AdminInfluencers',
    component: () => import('../pages/AdminInfluencers.vue')
  },
  {
    path: '/payments',
    name: 'AdminPayments',
    component: () => import('../pages/AdminPayments.vue')
  },
  {
    path: '/settings',
    name: 'AdminSettings',
    component: () => import('../pages/AdminSettings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
