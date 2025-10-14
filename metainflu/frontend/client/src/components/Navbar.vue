<template>
  <header class="bg-white/70 backdrop-blur-lg sticky top-0 z-40">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold text-gray-800">AURA</router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:flex sm:items-center sm:space-x-8">
          <router-link to="/" class="text-gray-500 hover:text-gray-900 transition-colors">Home</router-link>
          <router-link to="/shop" class="text-gray-500 hover:text-gray-900 transition-colors">Shop</router-link>
          <router-link to="/about" class="text-gray-500 hover:text-gray-900 transition-colors">About</router-link>
          <router-link to="/contact" class="text-gray-500 hover:text-gray-900 transition-colors">Contact</router-link>
        </div>

        <!-- Icons and Auth -->
        <div class="flex items-center space-x-4">
          <button class="text-gray-500 hover:text-gray-900">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          <router-link to="/cart" class="text-gray-500 hover:text-gray-900">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </router-link>
          
          <div class="hidden sm:flex items-center space-x-4">
            <template v-if="globalState.isLoggedIn">
              <router-link to="/account" class="text-gray-500 hover:text-gray-900">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </router-link>
              <a href="#" @click.prevent="logout" class="text-gray-500 hover:text-gray-900">Logout</a>
            </template>
            <template v-else>
              <router-link to="/login" class="text-sm font-medium text-gray-500 hover:text-gray-900">Login</router-link>
              <router-link to="/register" class="text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 px-3 py-2 rounded-md">Register</router-link>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <div class="sm:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-gray-500 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-4 space-y-1">
          <router-link to="/" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" @click="isMobileMenuOpen = false">Home</router-link>
          <router-link to="/shop" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" @click="isMobileMenuOpen = false">Shop</router-link>
          <router-link to="/about" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" @click="isMobileMenuOpen = false">About</router-link>
          <router-link to="/contact" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" @click="isMobileMenuOpen = false">Contact</router-link>
          
          <div class="border-t border-gray-200 pt-4 pb-3">
            <template v-if="globalState.isLoggedIn">
              <div class="flex items-center px-4">
                <div class="ml-3">
                  <div class="text-base font-medium text-gray-800">{{ globalState.user.name }}</div>
                  <div class="text-sm font-medium text-gray-500">{{ globalState.user.email }}</div>
                </div>
              </div>
              <div class="mt-3 space-y-1">
                <router-link to="/account" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="isMobileMenuOpen = false">Account</router-link>
                <a href="#" @click.prevent="logout" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Logout</a>
              </div>
            </template>
            <template v-else>
              <div class="space-y-1">
                <router-link to="/login" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="isMobileMenuOpen = false">Login</router-link>
                <router-link to="/register" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="isMobileMenuOpen = false">Register</router-link>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileMenuOpen = ref(false);

const logout = () => {
  localStorage.removeItem('user');
  globalState.isLoggedIn = false;
  globalState.user = null;
  isMobileMenuOpen.value = false;
  router.push('/login');
};
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>