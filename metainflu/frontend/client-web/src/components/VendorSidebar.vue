<template>
  <aside class="vendor-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="vendor-sidebar-sticky">
      <h3 class="sidebar-title">
        <span v-if="!isCollapsed">Vendor Menu</span>
      </h3>
      <nav class="sidebar-nav">
        <router-link to="/vendor-panel" exact-active-class="router-link-exact-active">
          <i class="fas fa-tachometer-alt"></i>
          <span v-if="!isCollapsed">Dashboard</span>
        </router-link>
        <router-link to="/vendor-panel/products">
          <i class="fas fa-box"></i>
          <span v-if="!isCollapsed">Manage Products</span>
        </router-link>
        <router-link to="/vendor-panel/orders">
          <i class="fas fa-shipping-fast"></i>
          <span v-if="!isCollapsed">Order Fulfillment</span>
        </router-link>
        <router-link to="/vendor-panel/analytics">
          <i class="fas fa-chart-line"></i>
          <span v-if="!isCollapsed">Analytics & Reports</span>
        </router-link>
        <router-link to="/vendor-panel/returns">
          <i class="fas fa-undo"></i>
          <span v-if="!isCollapsed">Returns</span>
        </router-link>
        <router-link to="/vendor-panel/invoices">
          <i class="fas fa-file-invoice"></i>
          <span v-if="!isCollapsed">Invoices</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isCollapsed: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['toggle-sidebar']);
</script>

<style scoped>
.vendor-sidebar {
  width: 280px;
  background-color: #fff;
  border-right: 1px solid #eee;
  transition: width 0.3s ease;
}

.vendor-sidebar.collapsed {
  width: 80px;
}

.vendor-sidebar-sticky {
  position: sticky;
  top: 100px; /* Adjust based on navbar height */
  padding: 2rem 1rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.sidebar-nav a i {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.sidebar-nav a:hover,
.sidebar-nav a.router-link-exact-active {
  background-color: #f4f4f9;
}

.vendor-sidebar.collapsed .sidebar-nav a {
  justify-content: center;
}
</style>
