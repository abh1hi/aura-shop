<!--
  File: metainflu/adminpanel/frontend/admin/src/components/AdminNavbar.vue
  Purpose: This component is the top navigation bar in the admin panel.
  I've added the admin's name and a functional logout button.
-->
<template>
  <div class="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>
    <div class="flex items-center space-x-4">
      <span class="text-gray-600">Welcome, {{ adminName }}</span>
      <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Log Out</button>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'AdminNavbar',
  data() {
    return {
      adminName: ''
    };
  },
  created() {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (adminUser) {
      this.adminName = adminUser.name;
    }
  },
  methods: {
    logout() {
      authService.logout();
      this.$router.push('/login');
    }
  }
};
</script>
