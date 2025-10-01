
// File: frontend/admin/src/App.vue
<template>
  <div class="flex">
    <AdminSidebar />
    <div class="flex-1">
      <AdminNavbar />
      <div class="p-8">
        <router-view></router-view>
      </div>
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
};
</script>
