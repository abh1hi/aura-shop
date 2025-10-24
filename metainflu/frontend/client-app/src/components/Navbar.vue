<template>
  <header :class="['fixed w-full z-50 transition-all duration-300 ease-in-out', { 'bg-white/80 backdrop-blur-sm shadow-md': isScrolled || !isTransparentPath }]">
    <!-- Desktop Navbar -->
    <div class="hidden lg:block">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <router-link to="/" class="text-3xl font-bold text-gray-800">AURA</router-link>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex lg:items-center lg:space-x-8">
            <router-link to="/shop" class="nav-link">Shop</router-link>
            <router-link to="/about" class="nav-link">About</router-link>
            <router-link to="/contact" class="nav-link">Contact</router-link>
          </div>

          <!-- Icons and Auth -->
          <div class="flex items-center space-x-5">
            <button class="nav-link">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <router-link to="/cart" class="nav-link relative">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{{ cartCount }}</span>
            </router-link>
            <template v-if="isLoggedIn">
              <router-link to="/account" class="nav-link">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </router-link>
              <a href="#" @click.prevent="logout" class="nav-link">Logout</a>
            </template>
            <template v-else>
              <router-link to="/login" class="nav-link text-sm">Login</router-link>
              <router-link to="/register" class="register-btn">Register</router-link>
            </template>
          </div>
        </div>
      </div>
      <!-- Breadcrumb -->
      <div v-if="breadcrumbs.length > 1" class="container mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="inline-flex items-center">
              <router-link :to="breadcrumb.to" class="text-sm font-medium text-gray-700 hover:text-gray-900">
                <span v-if="index !== 0" class="mr-2">/</span>
                {{ breadcrumb.text }}
              </router-link>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Mobile Navbar -->
    <div class="lg:hidden">
      <!-- Top Bar -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-safe-top">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <router-link to="/" class="text-2xl font-bold text-gray-800">AURA</router-link>
          </div>
          <!-- Search and Menu -->
          <div class="flex items-center space-x-4">
            <button class="nav-link">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="nav-link">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Breadcrumb -->
      <div v-if="breadcrumbs.length > 1" class="container mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="inline-flex items-center">
              <router-link :to="breadcrumb.to" class="text-xs font-medium text-gray-600 hover:text-gray-800">
                <span v-if="index !== 0" class="mr-1">/</span>
                {{ breadcrumb.text }}
              </router-link>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Mobile Menu Overlay -->
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/50 z-40" @click="isMobileMenuOpen = false"></div>
      
      <!-- Mobile Menu Sidebar -->
      <div :class="['fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50', isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full']">
        <div class="p-5">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-bold">Menu</h2>
            <button @click="isMobileMenuOpen = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close menu">
              <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <router-link to="/shop" class="mobile-nav-link" @click="isMobileMenuOpen = false">Shop</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="isMobileMenuOpen = false">About</router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="isMobileMenuOpen = false">Contact</router-link>
          <div class="border-t my-4"></div>
          <template v-if="isLoggedIn">
            <router-link to="/account" class="mobile-nav-link" @click="isMobileMenuOpen = false">Account</router-link>
            <a href="#" @click.prevent="logout" class="mobile-nav-link">Logout</a>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-nav-link" @click="isMobileMenuOpen = false">Login</router-link>
            <router-link to="/register" class="mobile-nav-link" @click="isMobileMenuOpen = false">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>

  <!-- Bottom Nav -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-[0_-2px_5px_rgba(0,0,0,0.1)] pb-safe-bottom lg:hidden z-50">
    <div class="flex justify-around h-16 items-center">
      <router-link to="/" class="bottom-nav-link">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span class="text-xs">Home</span>
      </router-link>
      <router-link to="/shop" class="bottom-nav-link">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <span class="text-xs">Shop</span>
      </router-link>
      <router-link to="/cart" class="bottom-nav-link relative">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <span class="text-xs">Cart</span>
        <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </router-link>
      <router-link to="/account" class="bottom-nav-link">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span class="text-xs">Account</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '../composables/useCart';
import { globalState } from '../main';

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const route = useRoute();

// Cart functionality
const { cartCount, initializeCart } = useCart();

// Authentication state
const isLoggedIn = computed(() => globalState.isLoggedIn);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // Initialize cart if user is logged in
  if (isLoggedIn.value) {
    initializeCart();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const logout = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Update global state
  globalState.isLoggedIn = false;
  globalState.user = null;
  
  isMobileMenuOpen.value = false;
  
  // Redirect to home or login
  window.location.href = '/';
};

const isTransparentPath = computed(() => {
  return route.path === '/';
});

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(i => i);
  const crumbs = [{ text: 'Home', to: '/' }];
  let path = '';
  pathArray.forEach((pathName, index) => {
    path += `/${pathName}`;
    const crumb = {
      text: pathName.charAt(0).toUpperCase() + pathName.slice(1),
      to: path
    };
    crumbs.push(crumb);
  });
  return crumbs;
});
</script>

<style scoped>
.pt-safe-top {
  padding-top: env(safe-area-inset-top);
}
.pb-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
.nav-link {
  color: #333;
  transition: color 0.3s;
  text-decoration: none;
  font-weight: 500;
}
.nav-link:hover {
  color: #c19a6b;
}
.register-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  background: #333;
  color: white;
  font-weight: 600;
  transition: 0.3s;
}
.register-btn:hover {
  background: #c19a6b;
  color: white;
}
.mobile-nav-link {
  display: block;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  text-decoration: none;
}
.mobile-nav-link:hover {
  color: #c19a6b;
}
.bottom-nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  text-decoration: none;
}
.bottom-nav-link.router-link-exact-active {
  color: #c19a6b;
}
</style>