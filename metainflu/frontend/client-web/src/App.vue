<template>
  <div 
    id="app" 
    :class="[
      'app-container',
      deviceClass,
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
  document.body.classList.add(deviceClass.value)
  
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
  document.body.classList.remove(deviceClass.value)
})
</script>

<style>
/* Enhanced CSS Reset and Base Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

:root {
  /* Enhanced CSS Custom Properties for responsive design */
  --primary-50: #f8f9fa;
  --primary-500: #1a1a1a;
  --primary-900: #000000;
  
  --secondary-50: #ffffff;
  --secondary-500: #64748b;
  --secondary-900: #0f172a;
  
  --accent-50: #fef7ed;
  --accent-500: #c5a47e;
  --accent-900: #8b6914;
  
  --surface-50: #ffffff;
  --surface-100: #f8fafc;
  --surface-200: #f1f5f9;
  --surface-300: #e2e8f0;
  
  /* Responsive font sizes */
  --font-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --font-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --font-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
  --font-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem);
  
  /* Responsive spacing */
  --space-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 1rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 2rem);
  --space-lg: clamp(1.5rem, 1rem + 2.5vw, 4rem);
  --space-xl: clamp(2rem, 1.5rem + 2.5vw, 5rem);
  
  /* Viewport height for mobile browsers */
  --vh: 1vh;
  
  /* Safe area insets for notched devices */
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-right: env(safe-area-inset-right);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --safe-area-inset-left: env(safe-area-inset-left);
}

/* Enhanced CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  scroll-behavior: smooth;
  /* Prevent horizontal scroll on mobile */
  overflow-x: hidden;
  /* Better text rendering */
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
  background-color: var(--surface-50);
  color: var(--primary-500);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  /* Prevent pull-to-refresh on mobile */
  overscroll-behavior: none;
}

/* App Container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  position: relative;
  overflow-x: hidden;
}

/* Device-specific layout classes */
.mobile-layout {
  background-color: var(--surface-100);
}

.tablet-layout {
  background-color: var(--surface-50);
}

.desktop-layout {
  background-color: var(--surface-50);
}

.touch-device {
  /* Enhanced touch targets */
  --min-touch-target: 44px;
}

/* Navigation containers */
.desktop-navbar,
.mobile-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Main Content Areas */
.main-content {
  flex-grow: 1;
  position: relative;
  z-index: 1;
}

.mobile-main {
  flex-grow: 1;
  min-height: calc(100vh - 60px); /* Account for mobile header */
  min-height: calc(calc(var(--vh, 1vh) * 100) - 60px);
  padding-bottom: 80px; /* Account for bottom navigation */
}

.desktop-main {
  flex-grow: 1;
  padding-top: 80px; /* Account for fixed navbar */
}

/* Safe area handling for notched devices */
.safe-top {
  padding-top: var(--safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: var(--safe-area-inset-bottom);
}

.safe-left {
  padding-left: var(--safe-area-inset-left);
}

.safe-right {
  padding-right: var(--safe-area-inset-right);
}

/* Footer */
.desktop-footer {
  margin-top: auto;
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding-bottom: var(--safe-area-inset-bottom);
}

/* Route Loading */
.route-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--surface-300);
  border-top: 3px solid var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced Transitions */
/* Mobile slide transitions */
.slide-mobile-enter-active,
.slide-mobile-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-mobile-enter-from {
  transform: translateX(100%);
}

.slide-mobile-leave-to {
  transform: translateX(-100%);
}

/* Tablet fade transitions */
.fade-tablet-enter-active,
.fade-tablet-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-tablet-enter-from,
.fade-tablet-leave-to {
  opacity: 0;
}

/* Desktop subtle fade */
.fade-desktop-enter-active,
.fade-desktop-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-desktop-enter-from,
.fade-desktop-leave-to {
  opacity: 0;
}

/* Responsive Utilities */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-sm);
}

/* Responsive container sizes */
@media (min-width: 640px) {
  .container { max-width: 640px; padding: 0 var(--space-md); }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}

/* Button Styles */
.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-500);
  color: var(--surface-50);
  padding: var(--space-sm) var(--space-md);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-base);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  font-family: inherit;
  min-height: var(--min-touch-target, 44px);
  touch-action: manipulation;
}

.cta-button:hover {
  background-color: var(--secondary-500);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.cta-button:active {
  transform: translateY(0);
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accent-500);
  outline-offset: 2px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--surface-100);
}

::-webkit-scrollbar-thumb {
  background: var(--surface-300);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-500);
}

/* Print styles */
@media print {
  .mobile-navbar,
  .desktop-navbar,
  .mobile-bottom-nav,
  .desktop-footer {
    display: none !important;
  }
  
  .main-content {
    padding: 0 !important;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --primary-500: #000000;
    --surface-50: #ffffff;
    --surface-300: #000000;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-500: #ffffff;
    --primary-900: #000000;
    --secondary-500: #94a3b8;
    --surface-50: #0f172a;
    --surface-100: #1e293b;
    --surface-200: #334155;
    --surface-300: #475569;
  }
}

/* Device-specific optimizations */

/* Mobile-specific styles */
@media (max-width: 767px) {
  .container {
    padding: 0 1rem;
  }
  
  /* Improve tap targets on mobile */
  button, 
  input[type="button"], 
  input[type="submit"], 
  a {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Prevent horizontal scroll */
  body {
    overflow-x: hidden;
  }
}

/* Tablet-specific styles */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 2rem;
  }
  
  /* Optimize for tablet touch targets */
  button,
  input[type="button"],
  input[type="submit"],
  a {
    min-height: 48px;
  }
}

/* Desktop-specific styles */
@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
  
  /* Hover effects only for devices with precise pointers */
  @media (hover: hover) and (pointer: fine) {
    .cta-button:hover {
      background-color: var(--secondary-500);
      transform: translateY(-2px);
    }
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .cta-button:hover {
    transform: none;
    box-shadow: none;
  }
  
  .cta-button:active {
    background-color: var(--secondary-500);
    transform: scale(0.98);
  }
  
  /* Larger touch targets for touch devices */
  button,
  input[type="button"],
  input[type="submit"],
  a {
    min-height: 48px;
    min-width: 48px;
  }
}
</style>