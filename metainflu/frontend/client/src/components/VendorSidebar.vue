<template>
  <aside class="vendor-sidebar">
    <div class="vendor-sidebar-sticky">
      <h3 class="sidebar-title">Vendor Menu</h3>
      <nav class="sidebar-nav">
        <router-link to="/vendor-panel">Dashboard</router-link>
        <router-link to="/add-product">Add Product</router-link>
        <router-link to="/view-sales">View Sales</router-link>
        <router-link to="/invoices">Invoices</router-link>
        <router-link to="/returns">Returns</router-link>
      </nav>
    </div>
  </aside>
</template>

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
