

// File: frontend/admin/src/components/AdminNavbar.vue
<template>
  <div class="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>
    <div class="flex items-center space-x-4">
      <span class="text-gray-600">Admin User</span>
      <button class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Log Out</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminNavbar',
};
</script>

