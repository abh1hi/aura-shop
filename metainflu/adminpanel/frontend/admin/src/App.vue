<!--
  File: metainflu/adminpanel/frontend/admin/src/App.vue
  Purpose: The main App component for the admin panel. It conditionally renders
  the main layout (sidebar, navbar) or the login page based on the current route.
-->
<template>
  <div v-if="isLoginPage" class="bg-gray-100">
    <router-view></router-view>
  </div>
  <div v-else class="flex">
    <AdminSidebar />
    <div class="flex-1">
      <AdminNavbar />
      <main class="p-8 bg-gray-50 min-h-screen">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './components/AdminSidebar.vue';
import AdminNavbar from './components/AdminNavbar.vue';

export default {
  name: 'AdminApp',
  components: {
    AdminSidebar,
    AdminNavbar,
  },
  computed: {
    // Check if the current route is the login page to render a different layout.
    isLoginPage() {
      return this.$route.name === 'AdminLogin';
    }
  }
};
</script>
