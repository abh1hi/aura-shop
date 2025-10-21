<template>
  <div 
    id="app" 
    :class="[
      'app-container',
      ...deviceClass,
      {
        'mobile-layout': isMobileDevice,
        'tablet-layout': isTabletDevice,
        'desktop-layout': isDesktopDevice,
        'touch-device': hasTouchSupport
      }
    ]"
  >
    <!-- Adaptive Navigation - Desktop/Tablet Navbar -->
    <Navbar v-if="!isMobileOnlyRoute" class="desktop-navbar" />
    
    <!-- Mobile Header - Only for mobile-specific routes -->
    <MobileHeader v-if="isMobileOnlyRoute" class="mobile-navbar" />
    
    <!-- Main content area with device-specific classes -->
    <main 
      :class="[
        'main-content',
        {
          'mobile-main': isMobileOnlyRoute,
          'desktop-main': !isMobileOnlyRoute,
          'safe-top': isMobileDevice && hasNotch,
          'safe-bottom': isMobileDevice && hasNotch
        }
      ]"
    >
      <!-- Loading indicator for route transitions -->
      <div v-if="isRouteTransitioning" class="route-loading">
        <div class="loading-spinner"></div>
      </div>
      
      <!-- Route view with adaptive transitions -->
      <router-view v-slot="{ Component, route }">
        <transition 
          :name="getTransitionName(route)" 
          mode="out-in"
          @before-enter="handleRouteTransitionStart"
          @after-enter="handleRouteTransitionEnd"
        >
          <component 
            :is="Component" 
            :key="route.path"
            :device-type="deviceType"
            :screen-size="screenSize"
            class="route-component"
          />
        </transition>
      </router-view>
    </main>
    
    <!-- Adaptive Footer -->
    <Footer v-if="!isMobileOnlyRoute && shouldShowFooter" class="desktop-footer" />
    
    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobileOnlyRoute" class="mobile-bottom-nav" />
    
    <!-- Global Toast Notifications -->
    <NotificationToast />
    
    <!-- PWA Install Prompt -->
    <PWAInstallPrompt v-if="showPWAPrompt" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceDetection } from './composables/useDeviceDetection'
import { useResponsiveBreakpoints } from './composables/useResponsiveBreakpoints'

// Components
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import MobileHeader from './components/MobileHeader.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import NotificationToast from './components/NotificationToast.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'

const route = useRoute()
const router = useRouter()

// Composables for device detection and responsive behavior
const {
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  hasTouchSupport,
  hasNotch,
  deviceType,
  deviceClass
} = useDeviceDetection()

const {
  screenSize,
  isXs,
  isSm,
  isMd,
  isLg,
  isXl
} = useResponsiveBreakpoints()

// Route transition state
const isRouteTransitioning = ref(false)
const showPWAPrompt = ref(false)

// Determine layout type based on route and device
const isMobileOnlyRoute = computed(() => {
  // Routes that should always use mobile layout regardless of device
  const mobileOnlyRoutes = [
    '/',
    '/shop', 
    '/cart', 
    '/account',
    '/product',
    '/checkout'
  ]
  
  return mobileOnlyRoutes.some(mobilePath => 
    route.path === mobilePath || route.path.startsWith('/product/')
  ) && isMobileDevice.value
})

// Routes where footer should be hidden
const shouldShowFooter = computed(() => {
  const noFooterRoutes = ['/checkout', '/login', '/register', '/cart']
  return !noFooterRoutes.includes(route.path)
})

// Adaptive transition names based on device and route
const getTransitionName = (currentRoute) => {
  if (isMobileDevice.value) {
    // Mobile gets slide transitions
    return 'slide-mobile'
  } else if (isTabletDevice.value) {
    // Tablet gets fade transitions
    return 'fade-tablet'
  } else {
    // Desktop gets subtle fade
    return 'fade-desktop'
  }
}

// Handle route transition events
const handleRouteTransitionStart = () => {
  isRouteTransitioning.value = true
}

const handleRouteTransitionEnd = () => {
  isRouteTransitioning.value = false
}

// PWA Installation detection
let deferredPrompt = null

const handlePWAInstall = (event) => {
  event.preventDefault()
  deferredPrompt = event
  showPWAPrompt.value = true
}

// Lifecycle hooks
onMounted(() => {
  // Listen for PWA install prompt
  window.addEventListener('beforeinstallprompt', handlePWAInstall)
  
  // Handle viewport height for mobile browsers
  if (isMobileDevice.value) {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    setViewportHeight()
    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)
  }
  
  // Add device-specific classes to body
  try {
    document.body.classList.add(...deviceClass.value)
  } catch (e) {
    // Fallback: ensure we pass tokens one by one
    deviceClass.value.forEach(cls => document.body.classList.add(cls))
  }
  
  // Prevent zoom on iOS Safari when input focused
  if (isMobileDevice.value) {
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      )
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handlePWAInstall)
  try {
    document.body.classList.remove(...deviceClass.value)
  } catch (e) {
    deviceClass.value.forEach(cls => document.body.classList.remove(cls))
  }
})
</script>

<style>
/* styles unchanged - see previous commit */
</style>