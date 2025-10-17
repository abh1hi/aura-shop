import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Dashboard from '../pages/Dashboard.vue'
import Login from '../pages/Login.vue'
import Products from '../pages/Products.vue'
import Orders from '../pages/Orders.vue'
import Profile from '../pages/Profile.vue'

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/products', name: 'products', component: Products },
  { path: '/orders', name: 'orders', component: Orders },
  { path: '/profile', name: 'profile', component: Profile }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to)=>{
  const auth = useAuthStore()
  if (!to.meta.public && !auth.token) return { name: 'login' }
})

export default router
