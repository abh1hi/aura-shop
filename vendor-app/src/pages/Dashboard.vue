<template>
  <div class="space-y-4">
    <nav class="flex gap-2">
      <router-link class="ios-button" to="/">Dashboard</router-link>
      <router-link class="ios-button" to="/products">Products</router-link>
      <router-link class="ios-button" to="/orders">Orders</router-link>
      <router-link class="ios-button" to="/profile">Profile</router-link>
    </nav>

    <section class="grid md:grid-cols-3 gap-4">
      <div class="ios-card p-4">
        <h2 class="ios-title text-base">Sales</h2>
        <p class="ios-muted text-sm mt-1">Today</p>
        <div class="text-2xl font-bold mt-3">$2,340</div>
      </div>
      <div class="ios-card p-4">
        <h2 class="ios-title text-base">Orders</h2>
        <p class="ios-muted text-sm mt-1">Pending</p>
        <div class="text-2xl font-bold mt-3">12</div>
      </div>
      <div class="ios-card p-4">
        <h2 class="ios-title text-base">Inventory</h2>
        <p class="ios-muted text-sm mt-1">Low stock</p>
        <div class="text-2xl font-bold mt-3">5</div>
      </div>
    </section>
  </div>
</template>
<script setup>
</script>
