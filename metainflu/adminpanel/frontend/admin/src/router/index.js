

// File: frontend/admin/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import AdminDashboard from '../pages/AdminDashboard.vue';
import AdminInfluencers from '../pages/AdminInfluencers.vue';
import AdminCampaigns from '../pages/AdminCampaigns.vue';
import AdminPayments from '../pages/AdminPayments.vue';

const routes = [
  {
    path: '/',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/influencers',
    name: 'AdminInfluencers',
    component: AdminInfluencers,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;