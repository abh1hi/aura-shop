<template>
  <div class="vendor-panel-layout">
    <VendorSidebar />
    <main class="vendor-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import VendorSidebar from '../components/VendorSidebar.vue';
</script>

<style scoped>
.vendor-panel-layout {
  display: flex;
}

.vendor-content {
  flex-grow: 1;
  padding: 2rem;
}
</style>
