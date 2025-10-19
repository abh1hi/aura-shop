/*
  File: metainflu/adminpanel/frontend/admin/src/router/index.js
  Purpose: This file defines the navigation routes for the admin panel Vue application.
  It maps URL paths to their corresponding page components.
*/
import { createRouter, createWebHistory } from 'vue-router';
import AdminDashboard from '../pages/AdminDashboard.vue';
import AdminUsers from '../pages/AdminUsers.vue';
import AdminProducts from '../pages/AdminProducts.vue';
import AdminCampaigns from '../pages/AdminCampaigns.vue';
import AdminPayments from '../pages/AdminPayments.vue';
import AdminLogin from '../pages/AdminLogin.vue';
import AdminCategories from '../pages/AdminCategories.vue';
import AdminHeroBanners from '../pages/AdminHeroBanners.vue';
import AdminFeaturedCollections from '../pages/AdminFeaturedCollections.vue';

const routes = [
  {
    path: '/',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/users',
    name: 'AdminUsers',
    component: AdminUsers,
  },
  {
    path: '/products',
    name: 'AdminProducts',
    component: AdminProducts,
  },
  {
    path: '/categories',
    name: 'AdminCategories',
    component: AdminCategories,
  },
  {
    path: '/campaigns',
    name: 'AdminCampaigns',
    component: AdminCampaigns,
  },
  {
    path: '/payments',
    name: 'AdminPayments',
    component: AdminPayments,
  },
  {
    path: '/hero-banners',
    name: 'AdminHeroBanners',
    component: AdminHeroBanners,
  },
  {
    path: '/featured-collections',
    name: 'AdminFeaturedCollections',
    component: AdminFeaturedCollections,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;