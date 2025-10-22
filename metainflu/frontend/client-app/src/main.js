// File: frontend/client/src/main.js

import { createApp, reactive } from 'vue'
import App from './App.vue'
import './index.css'

// Touch gesture library
import Vue3TouchEvents from 'vue3-touch-events'

// Global state for user authentication (check localStorage safely)
let savedUser = null
try {
  savedUser = localStorage?.getItem('user')
} catch (e) {
  console.warn('localStorage not available:', e)
}

export const globalState = reactive({
  isLoggedIn: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : null,
})

// Import router after globalState is defined
import router from './router'

// Create the Vue application instance
const app = createApp(App)

// Use plugins
app.use(Vue3TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400
})

// Use router and mount when ready
app.use(router)

// Simple mount without router.isReady() to avoid circular dependency
if (typeof document !== 'undefined') {
  app.mount('#app')
}