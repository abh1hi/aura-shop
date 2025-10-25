<template>
  <header :class="['fixed w-full z-50 transition-all duration-300 ease-in-out', 
                   { 'bg-white/95 backdrop-blur-md shadow-lg': isScrolled || !isTransparentPath }]">
    
    <!-- Desktop Navbar - Main Bar and Breadcrumbs -->
    <div class="hidden lg:block">
      <!-- Main Content Area (Logo, Links, Icons - Collapses when scrolled) -->
      <div :class="['container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300 ease-in-out', isScrolled ? 'max-h-0' : 'max-h-[64px]']">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo - Left -->
          <div class="flex-shrink-0">
            <router-link to="/" :class="['text-3xl font-serif tracking-wider font-extrabold transition-colors', isScrolled || !isTransparentPath ? 'text-gray-800' : 'text-white']">
              AURA
            </router-link>
          </div>

          <!-- Desktop Navigation - Center -->
          <nav class="hidden lg:flex lg:items-center lg:space-x-8">
            <router-link to="/shop" class="desktop-nav-link">Shop</router-link>
            <router-link to="/about" class="desktop-nav-link">About</router-link>
            <router-link to="/contact" class="desktop-nav-link">Contact</router-link>
          </nav>

          <!-- Icons and Auth - Right -->
          <div class="flex items-center space-x-5">
            <button class="icon-link" aria-label="Search">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <router-link to="/cart" class="icon-link relative" aria-label="Shopping Cart">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ring-2 ring-white">{{ cartCount }}</span>
            </router-link>
            <template v-if="isLoggedIn">
              <router-link to="/account" class="icon-link" aria-label="Account">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors hidden xl:block">Sign In</router-link>
              <router-link to="/register" class="register-btn">Join</router-link>
            </template>
          </div>
        </div>
      </div>
      
      <!-- Desktop Breadcrumb - Secondary Bar (Always visible when crumbs exist) -->
      <div v-if="breadcrumbs.length > 1" class="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center py-2 bg-gray-50/50 rounded-lg backdrop-blur-sm px-4 mb-2 shadow-inner shadow-gray-100" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-2">
            <li v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="inline-flex items-center">
              <router-link :to="breadcrumb.to" :class="['text-sm font-medium transition-colors', index === breadcrumbs.length - 1 ? 'text-gray-800' : 'text-gray-500 hover:text-indigo-600']">
                <span v-if="index !== 0" class="mx-2 text-gray-400">/</span>
                {{ breadcrumb.text }}
              </router-link>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Mobile Navbar (Top Bar) -->
    <!-- Applying pt-safe-top permanently to the mobile container -->
    <div class="lg:hidden pt-safe-top">
      <!-- Top Bar - Collapses when scrolled -->
      <div :class="['container mx-auto px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out', isScrolled ? 'max-h-0' : 'max-h-[64px]']">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <router-link to="/" class="text-2xl font-serif tracking-wider font-extrabold text-gray-800">AURA</router-link>
          </div>
          
          <!-- Utility Icons -->
          <div class="flex items-center space-x-4">
            <button class="icon-link-mobile" aria-label="Search">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="icon-link-mobile" aria-label="Open menu">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Breadcrumb -->
      <!-- Adjusted padding: Uses py-2 when scrolled for centering, pb-2 when top bar is visible -->
      <div v-if="breadcrumbs.length > 1" class="container mx-auto px-4 sm:px-6">
        <nav :class="['flex transition-all duration-300 ease-in-out', isScrolled ? 'py-2' : 'pb-2']" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-0">
            <li v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="inline-flex items-center truncate max-w-[120px]">
              <router-link :to="breadcrumb.to" :class="['text-xs font-medium transition-colors whitespace-nowrap', index === breadcrumbs.length - 1 ? 'text-gray-800' : 'text-gray-500 hover:text-indigo-600']">
                <span v-if="index !== 0" class="mx-1 text-gray-400">/</span>
                {{ breadcrumb.text }}
              </router-link>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Mobile Menu Overlay -->
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/50 z-40" @click="isMobileMenuOpen = false"></div>
      
      <!-- Mobile Menu Sidebar (Drawer) -->
      <div :class="['fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto', isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full']">
        <div class="p-6">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-gray-800">Menu</h2>
            <button @click="isMobileMenuOpen = false" class="p-2 -mr-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-full" aria-label="Close menu">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <router-link to="/shop" class="mobile-nav-link" @click="isMobileMenuOpen = false">Shop</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="isMobileMenuOpen = false">About</router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="isMobileMenuOpen = false">Contact</router-link>
          
          <div class="border-t border-gray-100 my-6"></div>
          
          <template v-if="isLoggedIn">
            <router-link to="/account" class="mobile-nav-link" @click="isMobileMenuOpen = false">Account Dashboard</router-link>
            <a href="#" @click.prevent="logout" class="mobile-nav-link text-red-500 hover:text-red-700">Logout</a>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-nav-link" @click="isMobileMenuOpen = false">Sign In</router-link>
            <router-link to="/register" class="w-full text-center mt-4 register-btn-mobile" @click="isMobileMenuOpen = false">Create Account</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Bottom Navigation Bar (Hidden on Desktop) -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl shadow-indigo-100/50 lg:hidden z-50 pb-safe-bottom">
    <div class="flex justify-around h-16 items-center">
      <router-link to="/" class="bottom-nav-link" aria-label="Home">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span class="text-xs font-medium">Home</span>
      </router-link>
      <router-link to="/shop" class="bottom-nav-link" aria-label="Shop">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        <span class="text-xs font-medium">Shop</span>
      </router-link>
      <router-link to="/cart" class="bottom-nav-link relative" aria-label="Cart">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <span class="text-xs font-medium">Cart</span>
        <span v-if="cartCount > 0" class="absolute -top-1 right-[calc(50%-1.25rem)] bg-indigo-600 text-white rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px] ring-1 ring-white">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </router-link>
      <router-link to="/account" class="bottom-nav-link" aria-label="Account">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span class="text-xs font-medium">Account</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
// These imports are now expected to be defined in your project's file structure
import { useCart } from '../composables/useCart';
import { globalState } from '../main';

// The mock definitions were removed to ensure the component relies on your project's logic.
// Please ensure '../composables/useCart' and '../main' are correctly defined in your project!

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

// Using the actual Vue Router hook for dynamic path tracking
const route = useRoute();

// Cart functionality - Now imported from the composable
const { cartCount, initializeCart } = useCart();

// Authentication state - Now imported from global state
const isLoggedIn = computed(() => globalState.isLoggedIn.value);

const handleScroll = () => {
  // Check if scrolled past 50 pixels
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  if (isLoggedIn.value) {
    initializeCart();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// WATCHER: Toggle 'no-scroll' class on body to prevent background scrolling (for mobile menu)
watch(isMobileMenuOpen, (isOpen) => {
    if (isOpen) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
});

const logout = () => {
  // Mock logout logic:
  console.log('User logged out (mock)');
  globalState.isLoggedIn.value = false;
  globalState.user.value = null;
  
  // Ensure the menu state is false before redirect
  isMobileMenuOpen.value = false;
  
  // In a real app, this would use router.push('/') or location.reload()
  // window.location.href = '/'; 
};

// Controls the header background appearance on the homepage (if path is '/')
const isTransparentPath = computed(() => {
  return route.path === '/';
});

// Breadcrumb logic
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(i => i);
  const crumbs = [{ text: 'Home', to: '/' }];
  let path = '';
  pathArray.forEach((pathName) => {
    path += `/${pathName}`;
    const crumb = {
      // Clean up common path segments for display (e.g., 't-shirts' becomes 'T Shirts')
      text: pathName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      to: path
    };
    crumbs.push(crumb);
  });
  return crumbs;
});
</script>

<style scoped>
/* Safe area styles for modern mobile devices */
.pt-safe-top {
  padding-top: env(safe-area-inset-top, 1rem); /* Fallback to 1rem */
}
.pb-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0.5rem); /* Fallback to 0.5rem */
}

/* --- Desktop Nav Styles (using Tailwind for most) --- */
.desktop-nav-link {
  @apply text-lg font-medium text-gray-700 transition-colors duration-200 p-2 rounded-lg;
  text-decoration: none;
}
.desktop-nav-link:hover {
  @apply text-indigo-600 bg-indigo-50/50;
}
.router-link-exact-active.desktop-nav-link {
  @apply text-indigo-600 font-semibold;
}

.icon-link {
  @apply text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-full;
}

.register-btn {
  @apply px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}

/* --- Mobile Nav Styles --- */
.icon-link-mobile {
  @apply text-gray-700 hover:text-indigo-600 transition-colors p-2;
}

.mobile-nav-link {
  @apply block py-3 text-lg font-medium text-gray-700 transition-colors duration-200 border-b border-gray-100;
  text-decoration: none;
}
.mobile-nav-link:hover {
  @apply text-indigo-600;
}
.router-link-exact-active.mobile-nav-link {
  @apply text-indigo-600 font-semibold;
}

.register-btn-mobile {
  @apply inline-block px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md transition-all duration-300 hover:bg-indigo-700;
}

.bottom-nav-link {
  @apply flex flex-col items-center justify-center text-gray-500 transition-colors duration-200 h-full;
  text-decoration: none;
}
.bottom-nav-link:hover {
  @apply text-indigo-600;
}
.bottom-nav-link.router-link-exact-active {
  @apply text-indigo-600 font-semibold;
}

/* Global CSS for scroll locking (unscoped style is needed for body class) */
</style>
<style>
/* Prevents background content from scrolling when mobile menu is open */
.no-scroll {
    overflow: hidden !important;
    position: fixed;
    width: 100%;
}
</style>
