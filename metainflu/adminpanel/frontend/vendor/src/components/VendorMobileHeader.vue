<template>
  <header class="vendor-mobile-header flex items-center justify-between p-4 bg-white border-b">
    <button @click="$emit('toggle-sidebar')" class="p-2 rounded-md bg-gray-100">
      ☰
    </button>
    <div class="text-lg font-semibold">Aura Vendor</div>
    <div></div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.vendor-mobile-header { }
</style>
