<!--
  File: metainflu/adminpanel/frontend/admin/src/pages/AdminUsers.vue
  Purpose: This Vue component creates a page for viewing all users in the admin panel.
  It fetches and displays a list of users and their roles.
-->
<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Manage Users</h2>
    <div class="bg-white p-6 rounded-xl shadow-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="user in users" :key="user._id" class="py-4 flex items-center justify-between">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <!-- Display the first initial of the user's name -->
                <span class="font-bold text-indigo-600">{{ user.name.charAt(0) }}</span>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-800">{{ user.name }}</h3>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <!-- Display user role with conditional styling -->
          <span class="px-3 py-1 rounded-full text-sm font-medium" :class="user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ user.role }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// This script handles the logic for fetching user data.
import adminService from '../services/adminService';

export default {
  name: 'AdminUsers',
  data() {
    return {
      users: [],
    };
  },
  async created() {
    // Fetch users when the component is created.
    try {
      // The admin's authentication token is required to fetch the user list.
      // For this to work, log in as an admin on the main website,
      // copy the 'token' from localStorage, and save it as 'adminToken'
      // in the localStorage for the admin panel's domain.
      const token = localStorage.getItem('adminToken');
       if (!token) {
            alert('Admin not authenticated. Please log in as an admin on the main site and set the adminToken.');
            return;
        }
      this.users = await adminService.getUsers(token);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },
};
</script>

