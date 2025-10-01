<!-- File: src/components/Header.vue -->
<template>
  <header>
    <div class="container header-content">
      <a href="#" class="logo">AURA</a>
      <nav :class="{ active: isNavActive }">
        <!-- In a Vue app, these would be <router-link> components -->
        <a href="#" style="color: var(--c5);">Home</a>
        <a href="#">Shop</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
      <div class="header-actions">
        <a href="#"><span>Search</span></a>
        <a href="#"><span>Account</span></a>
        <a href="#"><span>Cart (0)</span></a>
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

const isNavActive = ref(false);

const toggleNav = () => {
  isNavActive.value = !isNavActive.value;
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

nav a:hover {
  color: var(--c5);
}

nav a:hover::after {
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

  .menu-toggle {
    display: block;
  }
}

@media (max-width: 576px) {
  .header-actions a span {
    display: none;
  }

  .header-actions a svg {
    font-size: 1.5rem;
  }
}
</style>

