<template>
  <div id="app">
    <Navbar />
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

:root {
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

/* Main Content */
.main-content {
  flex-grow: 1;
  padding-top: 5rem; /* Add padding to account for fixed navbar */
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