<!-- File: src/components/Header.vue -->
<template>
  <header>
    <div class="container header-content">
      <router-link to="/" class="logo">AURA</router-link>
      <nav :class="{ 'active': isNavActive }">
        <router-link to="/" @click="closeNav">Home</router-link>
        <router-link to="/shop" @click="closeNav">Shop</router-link>
        <router-link to="/about" @click="closeNav">About</router-link>
        <router-link to="/contact" @click="closeNav">Contact</router-link>
        <router-link to="/customer-service" @click="closeNav">Support</router-link>
      </nav>
      <div class="header-actions">
        <!-- Search is hidden on small screens for cleaner UI -->
        <a href="#" class="hidden sm:inline-block"><span>Search</span></a>
        <template v-if="globalState.isLoggedIn">
            <router-link to="/account"><span>Account</span></router-link>
            <a href="#" @click.prevent="logout"><span>Logout</span></a>
        </template>
        <template v-else>
            <router-link to="/login"><span>Login</span></router-link>
        </template>
        <router-link to="/cart"><span>Cart (0)</span></router-link>
      </div>
      <div class="menu-toggle" @click="toggleNav">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const isNavActive = ref(false);

const toggleNav = () => {
  isNavActive.value = !isNavActive.value;
};

const closeNav = () => {
  if (isNavActive.value) {
    isNavActive.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('user');
  globalState.isLoggedIn = false;
  globalState.user = null;
  closeNav();
  router.push('/login');
};
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  background-color: rgba(253, 251, 255, 0.95); /* Slightly opaque for mobile */
  backdrop-filter: blur(10px);
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--light-gray);
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: 700;
  font-size: 1.8rem;
  text-decoration: none;
  color: var(--c5);
  z-index: 1001;
}

nav {
  display: flex;
  gap: 3rem;
}

nav a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  position: relative;
  transition: color 0.3s;
}

nav a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--c5);
  transition: width 0.3s;
}

nav a:hover,
nav a.router-link-exact-active {
  color: var(--c5);
}

nav a:hover::after,
nav a.router-link-exact-active::after {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-actions a {
  cursor: pointer;
  text-decoration: none;
  color: var(--text-color);
  transition: color 0.3s;
  font-weight: 500;
}

.header-actions a:hover {
  color: var(--c5);
}

.menu-toggle {
  display: none;
  cursor: pointer;
  z-index: 1001;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 2px;
  background-color: var(--text-color);
  margin: 5px 0;
  transition: all 0.3s;
}

/* Tablet and Mobile adjustments */
@media (max-width: 992px) {
    /* Hide desktop nav on tablet/mobile */
    nav {
        display: none;
    }
    
    /* Display mobile nav when active */
    nav.active {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh; /* Use full viewport height */
        background-color: var(--bg-color);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translateX(0);
        transition: none; /* No transition needed for fullscreen overlay */
        padding-top: 60px; /* Space for the logo/toggle */
    }
  
    nav a {
        font-size: 1.8rem;
        padding: 0.75rem 0;
    }

    .menu-toggle {
        display: block;
    }
    
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
}

/* Mobile actions bar adjustments */
@media (max-width: 576px) {
  .header-actions a:not([to="/cart"]) span {
    display: none; /* Hide text for all actions except Cart on small mobile */
  }

  .header-actions a svg {
    /* Assuming you might want icons here, but keeping it simple based on original code */
    font-size: 1.5rem;
  }
  
  .header-actions {
      gap: 1rem;
  }
}
</style>
