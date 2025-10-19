<template>
  <header :class="['navbar-glass', { 'scrolled': isScrolled }]">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-3xl font-bold text-white">AURA</router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:flex sm:items-center sm:space-x-8">
          <router-link to="/shop" class="nav-link">Shop</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link to="/contact" class="nav-link">Contact</router-link>
        </div>

        <!-- Icons and Auth -->
        <div class="flex items-center space-x-5">
          <button class="nav-link">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          <router-link to="/cart" class="nav-link">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
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

        <!-- Mobile Menu Button -->
        <div class="sm:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="nav-link">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="sm:hidden mobile-menu">
        <div class="flex flex-col items-center justify-center h-full space-y-6">
          <router-link to="/" class="mobile-nav-link" @click="isMobileMenuOpen = false">Home</router-link>
          <router-link to="/shop" class="mobile-nav-link" @click="isMobileMenuOpen = false">Shop</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="isMobileMenuOpen = false">About</router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="isMobileMenuOpen = false">Contact</router-link>
          <div class="border-t border-gray-700 pt-6 w-full max-w-xs mx-auto"></div>
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
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isMobileMenuOpen = ref(false);
const isLoggedIn = ref(false); // Replace with actual auth state
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const logout = () => {
  // Implement logout logic
  isLoggedIn.value = false;
};
</script>

<style scoped>
.navbar-glass {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}

.navbar-glass.scrolled {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
}

.nav-link {
  color: white;
  transition: color 0.3s;
  text-decoration: none;
  font-weight: 500;
}
.nav-link:hover {
  color: #c19a6b; /* Accent color */
}

.register-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  background: white;
  color: black;
  font-weight: 600;
  transition: 0.3s;
}
.register-btn:hover {
  background: #c19a6b;
  color: white;
}

.mobile-menu {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav-link {
  font-size: 1.75rem;
  color: white;
  font-weight: 500;
}
</style>
