<!--
  File: metainflu/adminpanel/frontend/vendor/src/App.vue
  Purpose: The main App component for the vendor panel. It provides a modern,
  mobile-responsive layout optimized for vendor operations with progressive web app features.
-->
<template>
  <div id="app" class="vendor-app">
    <!-- Loading Screen -->
    <VendorLoadingScreen v-if="isLoading" />
    
    <!-- Login/Landing Page Layout -->
    <div v-else-if="isAuthPage" class="auth-layout">
      <router-view></router-view>
    </div>
    
    <!-- Main Vendor Dashboard Layout -->
    <div v-else class="main-layout">
      <!-- Mobile Header -->
      <VendorMobileHeader 
        v-if="isMobile" 
        :is-sidebar-open="isSidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />
      
      <!-- Desktop/Tablet Layout -->
      <div class="desktop-layout">
        <!-- Sidebar -->
        <VendorSidebar 
          :class="{
            'sidebar-mobile-open': isMobile && isSidebarOpen,
            'sidebar-mobile-closed': isMobile && !isSidebarOpen
          }"
          @close-mobile="closeMobileSidebar"
        />
        
        <!-- Main Content Area -->
        <div class="main-content">
          <!-- Desktop Navbar -->
          <VendorNavbar v-if="!isMobile" />
          
          <!-- Page Content -->
          <main class="page-content">
            <!-- Breadcrumb Navigation -->
            <VendorBreadcrumb v-if="showBreadcrumb" />
            
            <!-- Route Content -->
            <div class="route-container">
              <router-view v-slot="{ Component }">
                <transition name="page-fade" mode="out-in">
                  <component :is="Component" />
                </transition>
              </router-view>
            </div>
          </main>
          
          <!-- Mobile Bottom Navigation -->
          <VendorBottomNav v-if="isMobile" />
        </div>
      </div>
      
      <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="isMobile && isSidebarOpen" 
        class="sidebar-overlay"
        @click="closeMobileSidebar"
      ></div>
    </div>
    
    <!-- Global Notifications -->
    <VendorNotifications />
    
    <!-- PWA Install Prompt -->
    <VendorPWAPrompt />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import VendorSidebar from './components/VendorSidebar.vue';
import VendorNavbar from './components/VendorNavbar.vue';
import VendorMobileHeader from './components/VendorMobileHeader.vue';
import VendorBottomNav from './components/VendorBottomNav.vue';
import VendorBreadcrumb from './components/VendorBreadcrumb.vue';
import VendorLoadingScreen from './components/VendorLoadingScreen.vue';
import VendorNotifications from './components/VendorNotifications.vue';
import VendorPWAPrompt from './components/VendorPWAPrompt.vue';

export default {
  name: 'VendorApp',
  components: {
    VendorSidebar,
    VendorNavbar,
    VendorMobileHeader,
    VendorBottomNav,
    VendorBreadcrumb,
    VendorLoadingScreen,
    VendorNotifications,
    VendorPWAPrompt
  },
  setup() {
    const route = useRoute();
    const isLoading = ref(true);
    const isSidebarOpen = ref(false);
    const screenWidth = ref(window.innerWidth);
    
    // Computed properties
    const isMobile = computed(() => screenWidth.value < 768);
    const isTablet = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024);
    
    const isAuthPage = computed(() => {
      const authRoutes = ['Login', 'VendorLanding', 'Register', 'ForgotPassword'];
      return authRoutes.includes(route.name);
    });
    
    const showBreadcrumb = computed(() => {
      const noBreadcrumbRoutes = ['Dashboard', 'Login', 'VendorLanding'];
      return !noBreadcrumbRoutes.includes(route.name);
    });
    
    // Methods
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };
    
    const closeMobileSidebar = () => {
      if (isMobile.value) {
        isSidebarOpen.value = false;
      }
    };
    
    const handleResize = () => {
      screenWidth.value = window.innerWidth;
      // Auto-close mobile sidebar on desktop
      if (!isMobile.value) {
        isSidebarOpen.value = false;
      }
    };
    
    const initializeApp = async () => {
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      isLoading.value = false;
    };
    
    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('resize', handleResize);
      initializeApp();
    });
    
    // Watch for route changes to close mobile sidebar
    watch(route, () => {
      closeMobileSidebar();
    });
    
    return {
      isLoading,
      isSidebarOpen,
      isMobile,
      isTablet,
      isAuthPage,
      showBreadcrumb,
      toggleSidebar,
      closeMobileSidebar
    };
  }
};
</script>

<style scoped>
.vendor-app {
  @apply min-h-screen bg-gray-50 font-sans;
}

/* Auth Layout */
.auth-layout {
  @apply min-h-screen;
}

/* Main Layout */
.main-layout {
  @apply flex flex-col h-screen;
}

.desktop-layout {
  @apply flex flex-1 overflow-hidden;
}

/* Sidebar Styles */
.sidebar-mobile-open {
  @apply fixed inset-y-0 left-0 z-50 transform translate-x-0 transition-transform duration-300 ease-in-out;
}

.sidebar-mobile-closed {
  @apply fixed inset-y-0 left-0 z-50 transform -translate-x-full transition-transform duration-300 ease-in-out;
}

/* Main Content */
.main-content {
  @apply flex flex-col flex-1 overflow-hidden;
}

.page-content {
  @apply flex-1 overflow-auto;
  padding: 1rem;
}

@screen md {
  .page-content {
    padding: 2rem;
  }
}

.route-container {
  @apply max-w-7xl mx-auto;
}

/* Sidebar Overlay */
.sidebar-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-40;
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 767px) {
  .main-content {
    padding-bottom: 4rem; /* Space for bottom navigation */
  }
}

/* PWA Optimizations */
@media (display-mode: standalone) {
  .vendor-app {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .vendor-app {
    @apply bg-gray-900;
  }
}

/* High DPI Display Optimization */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .vendor-app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>

<!-- Global Styles -->
<style>
/* Vendor Brand Colors */
:root {
  --vendor-primary: #3b82f6;
  --vendor-primary-dark: #2563eb;
  --vendor-secondary: #10b981;
  --vendor-accent: #f59e0b;
  --vendor-danger: #ef4444;
  --vendor-warning: #f97316;
  --vendor-info: #06b6d4;
  --vendor-success: #10b981;
  --vendor-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles for accessibility */
.focus-ring:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Vendor-specific button styles */
.btn-vendor-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.btn-vendor-secondary {
  @apply bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2;
}

/* Card styles */
.vendor-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.vendor-card-header {
  @apply border-b border-gray-200 pb-4 mb-4;
}

/* Mobile-first animations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>