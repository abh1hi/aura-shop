// File: frontend/client/src/main.js

import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

// Touch gesture library
import Vue3TouchEvents from 'vue3-touch-events'

// Global state for user authentication
const savedUser = localStorage.getItem('user')
export const globalState = reactive({
  isLoggedIn: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : null,
})

// Create the Vue application instance
const app = createApp(App)

// Use plugins
app.use(router)
app.use(Vue3TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400
})

// Fix for Capacitor: Wait for router to be ready before mounting
router.isReady().then(() => {
  app.mount('#app')
}).catch(error => {
  console.error('Router initialization failed:', error)
  // Fallback: mount anyway
  app.mount('#app')
})