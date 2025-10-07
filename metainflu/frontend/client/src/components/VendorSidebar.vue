<template>
  <aside class="vendor-sidebar">
    <div class="vendor-sidebar-sticky">
      <h3 class="sidebar-title">Vendor Menu</h3>
      <nav class="sidebar-nav">
        <!-- Dashboard (Base path of the nested route) -->
        <router-link to="/vendor-panel" exact-active-class="router-link-exact-active">Dashboard</router-link>
        
        <!-- Updated to point to ManageProducts -->
        <router-link to="/vendor-panel/manage-products">Manage Products</router-link>
        
        <!-- Updated to point to OrderFulfillment -->
        <router-link to="/vendor-panel/order-fulfillment">Order Fulfillment</router-link>
        
        <!-- Updated to point to Analytics -->
        <router-link to="/vendor-panel/analytics">Analytics & Reports</router-link>
        
        <!-- Renamed path for Returns -->
        <router-link to="/vendor-panel/returns">Returns</router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup>
// This component now exists in the local state.
</script>

<style scoped>
.vendor-sidebar {
  width: 280px;
  background-color: #fff;
  border-right: 1px solid #eee;
}

.vendor-sidebar-sticky {
  position: sticky;
  top: 100px; /* Adjust based on navbar height */
  padding: 2rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.sidebar-nav a:hover,
.sidebar-nav a.router-link-exact-active {
  background-color: #f4f4f9;
}
</style>
