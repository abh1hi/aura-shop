<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <router-link to="/" class="navbar-logo">AURA</router-link>

      <!-- Desktop Navigation -->
      <div class="nav-links-desktop">
        <router-link to="/">Home</router-link>
        <router-link to="/shop">Shop</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/contact">Contact</router-link>
      </div>

      <!-- Desktop Auth Links -->
      <div class="nav-auth-desktop">
        <template v-if="globalState.isLoggedIn">
          <router-link v-if="globalState.user && globalState.user.role === 'vendor'" to="/vendor-panel">Vendor Panel</router-link>
          <router-link to="/account">Account</router-link>
          <a href="#" @click.prevent="logout">Logout</a>
        </template>
        <template v-else>
          <router-link to="/login">Login</router-link>
          <router-link to="/register" class="register-btn">Register</router-link>
        </template>
      </div>

      <!-- Mobile Navigation Toggle -->
      <button class="nav-toggle-mobile" @click="toggleMobileNav">
        <svg v-if="!isMobileNavOpen" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <!-- Mobile Navigation Menu -->
      <div class="nav-links-mobile-overlay" :class="{ open: isMobileNavOpen }" @click="closeMobileNav"></div>
      <div class="nav-links-mobile" :class="{ open: isMobileNavOpen }" v-touch:swipe.right="closeMobileNav">
        <router-link to="/" @click="closeMobileNav">Home</router-link>
        <router-link to="/shop" @click="closeMobileNav">Shop</router-link>
        <router-link to="/about" @click="closeMobileNav">About</router-link>
        <router-link to="/contact" @click="closeMobileNav">Contact</router-link>
        <hr>
        <template v-if="globalState.isLoggedIn">
          <router-link v-if="globalState.user && globalState.user.role === 'vendor'" to="/vendor-panel" @click="closeMobileNav">Vendor Panel</router-link>
          <router-link to="/account" @click="closeMobileNav">Account</router-link>
          <a href="#" @click.prevent="logoutAndCloseNav">Logout</a>
        </template>
        <template v-else>
          <router-link to="/login" @click="closeMobileNav">Login</router-link>
          <router-link to="/register" @click="closeMobileNav">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileNavOpen = ref(false);

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
};

const logout = () => {
  localStorage.removeItem('user');
  globalState.isLoggedIn = false;
  globalState.user = null;
  router.push('/login');
};

const logoutAndCloseNav = () => {
  logout();
  closeMobileNav();
}
</script>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  font-size: 1.75rem;
  font-weight: 700;
  color: #000;
  text-decoration: none;
}

/* Desktop Navigation */
.nav-links-desktop {
  display: flex;
  gap: 2rem;
}

.nav-links-desktop a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.nav-links-desktop a:hover {
  color: #000;
}

.nav-auth-desktop {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-auth-desktop a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-auth-desktop a:hover {
  color: #000;
}

.register-btn {
  background-color: #000;
  color: #fff !important;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}

/* Mobile Navigation */
.nav-toggle-mobile {
  display: none; /* Hidden on desktop */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1000;
}

.nav-links-mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 998;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-links-mobile-overlay.open {
  display: block;
  opacity: 1;
}

.nav-links-mobile {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background-color: #fff;
  padding: 2rem;
  box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  z-index: 999;
  transition: right 0.3s ease;
}

.nav-links-mobile.open {
  right: 0;
}

.nav-links-mobile a {
  font-size: 1.5rem;
  padding: 1rem 0;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.nav-links-mobile a:hover {
  background-color: #f4f4f9;
}

.nav-links-mobile hr {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .nav-links-desktop, .nav-auth-desktop {
    display: none;
  }

  .nav-toggle-mobile {
    display: block;
  }
}
</style>
