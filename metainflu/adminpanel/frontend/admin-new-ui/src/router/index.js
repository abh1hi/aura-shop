import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useToast } from 'vue-toastification'

// Import components
import AdminDashboard from '../pages/AdminDashboard.vue'
import AdminLogin from '../pages/AdminLogin.vue'

// Define routes
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: {
      requiresGuest: true,
      title: 'Admin Login'
    }
  },
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Dashboard'
    }
  },
  {
    path: '/analytics',
    name: 'AdminAnalytics',
    component: () => import('../pages/AdminAnalytics.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Analytics'
    }
  },
  {
    path: '/hero-banners',
    name: 'AdminHeroBanners',
    component: () => import('../pages/AdminHeroBanners.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Hero Banners'
    }
  },
  {
    path: '/featured-collections',
    name: 'AdminFeaturedCollections',
    component: () => import('../pages/AdminFeaturedCollections.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Featured Collections'
    }
  },
  {
    path: '/products',
    name: 'AdminProducts',
    component: () => import('../pages/AdminProducts.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Products'
    }
  },
  {
    path: '/products/create',
    name: 'AdminProductCreate',
    component: () => import('../pages/AdminProductForm.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Create Product'
    }
  },
  {
    path: '/products/:id/edit',
    name: 'AdminProductEdit',
    component: () => import('../pages/AdminProductForm.vue'),
    props: true,
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Edit Product'
    }
  },
  {
    path: '/categories',
    name: 'AdminCategories',
    component: () => import('../pages/AdminCategories.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Categories'
    }
  },
  {
    path: '/users',
    name: 'AdminUsers',
    component: () => import('../pages/AdminUsers.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Users'
    }
  },
  {
    path: '/campaigns',
    name: 'AdminCampaigns',
    component: () => import('../pages/AdminCampaigns.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Campaigns'
    }
  },
  {
    path: '/influencers',
    name: 'AdminInfluencers',
    component: () => import('../pages/AdminInfluencers.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Influencers'
    }
  },
  {
    path: '/payments',
    name: 'AdminPayments',
    component: () => import('../pages/AdminPayments.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Payments'
    }
  },
  {
    path: '/orders',
    name: 'AdminOrders',
    component: () => import('../pages/AdminOrders.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Orders'
    }
  },
  {
    path: '/settings',
    name: 'AdminSettings',
    component: () => import('../pages/AdminSettings.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Settings'
    }
  },
  {
    path: '/profile',
    name: 'AdminProfile',
    component: () => import('../pages/AdminProfile.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'vendor'],
      title: 'Profile'
    }
  },
  // Error pages
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../pages/ErrorPages/Forbidden.vue'),
    meta: {
      title: 'Access Denied'
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../pages/ErrorPages/NotFound.vue'),
    meta: {
      title: 'Page Not Found'
    }
  },
  // Catch all route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const toast = useToast()
  
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - Aura Shop Admin` : 'Aura Shop Admin'
  
  try {
    // Initialize auth on first navigation
    if (!authStore.isAuthenticated && !authStore.isLoading) {
      await authStore.initializeAuth()
    }
    
    // Check if route requires authentication
    if (to.meta.requiresAuth) {
      if (!authStore.isLoggedIn) {
        toast.warning('Please log in to access this page')
        return next({
          name: 'AdminLogin',
          query: { redirect: to.fullPath }
        })
      }
      
      // Check role-based access
      if (to.meta.roles && !authStore.hasAnyRole(to.meta.roles)) {
        toast.error('You do not have permission to access this page')
        return next('/403')
      }
      
      // Check email verification for sensitive operations
      if (to.meta.requiresEmailVerification && !authStore.isEmailVerified) {
        toast.warning('Please verify your email to access this page')
        return next('/profile')
      }
    }
    
    // Redirect authenticated users away from login page
    if (to.meta.requiresGuest && authStore.isLoggedIn) {
      return next('/dashboard')
    }
    
    next()
  } catch (error) {
    console.error('Navigation guard error:', error)
    toast.error('Navigation error occurred')
    next('/login')
  }
})

// After navigation
router.afterEach((to, from) => {
  // Log navigation for analytics
  if (import.meta.env.DEV) {
    console.log(`Navigated from ${from.path} to ${to.path}`)
  }
})

// Handle navigation errors
router.onError((error) => {
  console.error('Router error:', error)
  const toast = useToast()
  toast.error('Page loading failed. Please try again.')
})

export default router