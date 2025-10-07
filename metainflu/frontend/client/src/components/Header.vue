<!-- File: src/components/Header.vue -->
<template>
  <header>
    <div class="container header-content">
      <router-link to="/" class="logo">AURA</router-link>
      <nav :class="{ active: isNavActive }">
        <router-link to="/" @click="closeNav">Home</router-link>
        <router-link to="/shop" @click="closeNav">Shop</router-link>
        <router-link to="/about" @click="closeNav">About</router-link>
        <router-link to="/contact" @click="closeNav">Contact</router-link>
        <router-link to="/customer-service" @click="closeNav">Support</router-link>
      </nav>
      <div class="header-actions">
        <a href="#"><span>Search</span></a>
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
  background-color: rgba(253, 251, 255, 0.8);
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

@media (max-width: 992px) {
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  }

  nav.active {
    transform: translateX(0);
  }
  
  nav a {
      font-size: 1.5rem;
  }

  .menu-toggle {
    display: block;
  }
  
  nav.active + .header-actions + .menu-toggle span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  nav.active + .header-actions + .menu-toggle span:nth-child(2) {
    opacity: 0;
  }
  nav.active + .header-actions + .menu-toggle span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}

@media (max-width: 576px) {
  .header-actions a span {
    display: none;
  }

  .header-actions a svg {
    font-size: 1.5rem;
  }
  .header-actions a {
    font-size: 1rem;
  }
  .header-actions {
      gap: 1rem;
  }
}
</style>

