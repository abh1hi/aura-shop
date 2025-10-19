<template>
  <div id="app" :class="{ 'mobile-layout': isMobileRoute }">
    <!-- Traditional navbar for desktop pages -->
    <Navbar v-if="!isMobileRoute" />
    
    <!-- Main content area -->
    <main :class="['main-content', { 'mobile-main': isMobileRoute }]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Traditional footer for desktop pages -->
    <Footer v-if="!isMobileRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

// Determine if current route should use mobile layout
const isMobileRoute = computed(() => {
  const mobileRoutes = ['/', '/shop', '/cart', '/account', '/product']
  return mobileRoutes.some(mobilePath => 
    route.path === mobilePath || route.path.startsWith('/product/')
  )
})
</script>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

:root {
  /* Original theme colors */
  --c1: #FFB2E6;
  --c2: #F7AEF8;
  --c3: #E382F9;
  --c4: #B388EB;
  --c5: #9A52FF;
  --c6: #8447FF;
  --c7: #72DDF7;
  
  /* Modern mobile-first colors */
  --primary: #1a1a1a;
  --secondary: #64748b;
  --accent: #c19a6b;
  --background: #ffffff;
  --surface: #f8fafc;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  
  /* Legacy variables for backward compatibility */
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
  --light-gray: #f8fafc;
}

/* CSS Reset and Base Styles */
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
}

body {
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* App Layout */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app.mobile-layout {
  background-color: var(--surface);
}

/* Main Content */
.main-content {
  flex-grow: 1;
}

.main-content.mobile-main {
  flex-grow: 1;
  min-height: 100vh;
}

/* Utility Classes */
.container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section {
  padding: 6rem 0;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 4rem;
  color: var(--text-primary);
}

/* Buttons */
.cta-button {
  background-color: var(--primary);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.cta-button:hover {
  background-color: var(--secondary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.cta-button:active {
  transform: translateY(0);
}

/* Page Headers */
.page-header {
  padding: 6rem 0;
  background-color: var(--surface);
  text-align: center;
}

.page-header h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0;
  }
  
  .section {
    padding: 3rem 0;
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .page-header {
    padding: 3rem 0;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}

/* Touch-friendly interactions */
@media (hover: none) and (pointer: coarse) {
  .cta-button:hover {
    transform: none;
    box-shadow: none;
  }
  
  .cta-button:active {
    background-color: var(--secondary);
    transform: scale(0.98);
  }
}

/* Scrollbar styling for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--surface);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .mobile-header,
  .bottom-navigation,
  .filter-sidebar {
    display: none !important;
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

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --primary: #000000;
    --background: #ffffff;
    --text-primary: #000000;
    --border: #000000;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --primary: #ffffff;
    --secondary: #94a3b8;
    --background: #0f172a;
    --surface: #1e293b;
    --border: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
  }
}
</style>