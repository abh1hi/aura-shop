<!--
  File: metainflu/adminpanel/frontend/admin/src/components/AdminSidebar.vue
  Purpose: This component is the main navigation sidebar for the admin panel.
  It contains router links to all the major sections of the admin dashboard.
-->
<template>
  <div class="bg-gray-800 text-white w-64 min-h-screen p-4">
    <div class="text-2xl font-bold mb-8">Admin Panel</div>
    <nav class="space-y-2">
      <!-- Link to Dashboard -->
      <router-link to="/" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span>Dashboard</span>
      </router-link>
      
      <!-- Content Management Section -->
      <div class="pt-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Content Management</h3>
        
        <!-- Link to Hero Banners Management -->
        <router-link to="/hero-banners" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
          </svg>
          <span>Hero Banners</span>
        </router-link>
        
        <!-- Link to Featured Collections Management -->
        <router-link to="/featured-collections" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span>Featured Collections</span>
        </router-link>
      </div>

      <!-- E-commerce Management Section -->
      <div class="pt-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">E-commerce</h3>
        
        <!-- Link to Products Management -->
        <router-link to="/products" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.993.883L4 8v10a2 2 0 002 2h8a2 2 0 002-2V8l-.007-.117A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 011-1h8a1 1 0 110 2H7a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
          <span>Products</span>
        </router-link>
        
        <!-- Link to Categories Management -->
        <router-link to="/categories" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <span>Categories</span>
        </router-link>
      </div>

      <!-- User & Campaign Management Section -->
      <div class="pt-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">User Management</h3>
        
        <!-- Link to Users Management -->
        <router-link to="/users" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.488 3.488 0 0014.2 13H5.8a3.488 3.488 0 00-1.05-.906A5.972 5.972 0 002 15v3h14z" />
          </svg>
          <span>Users</span>
        </router-link>
        
        <!-- Link to Campaigns Management -->
        <router-link to="/campaigns" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clip-rule="evenodd" />
          </svg>
          <span>Campaigns</span>
        </router-link>
      </div>

      <!-- Financial Management Section -->
      <div class="pt-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Financial</h3>
        
        <!-- Link to Payments Management -->
        <router-link to="/payments" class="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm10 2a1 1 0 110 2h-4a1 1 0 110-2h4zM7 8a1 1 0 100 2h1a1 1 0 100-2H7zm-3 2a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 10-2h1a1 1 0 110 2H5z" />
          </svg>
          <span>Payments</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
};
</script>