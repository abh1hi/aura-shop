import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import App from './App.vue'
import router from './router'
import './index.css'

// Toast notification styles
import 'vue-toastification/dist/index.css'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Toast configuration
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  toastClassName: 'custom-toast',
  bodyClassName: 'custom-toast-body',
  containerClassName: 'custom-toast-container'
}

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Global Error:', error)
  console.error('Component:', instance)
  console.error('Error Info:', info)
  
  // In production, send errors to monitoring service
  if (import.meta.env.PROD) {
    // Example: Send to Sentry, LogRocket, etc.
    // Sentry.captureException(error)
  }
}

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue Warning:', msg)
  console.warn('Trace:', trace)
}

// Use plugins
app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)

// Global properties
app.config.globalProperties.$appName = 'Aura Shop Admin'
app.config.globalProperties.$appVersion = '1.2.0'

// Mount the app
app.mount('#app')