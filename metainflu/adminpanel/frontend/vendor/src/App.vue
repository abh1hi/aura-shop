<template>
  <div class="min-h-screen flex flex-col bg-gray-bg">
    <!-- Auth/Landing Layout (Full screen, no header/footer) -->
    <div v-if="isAuthPage" class="flex-1">
      <router-view />
    </div>

    <!-- Main Vendor App Layout (Mobile First) -->
    <div v-else class="flex flex-col flex-1">
      <!-- Mobile Header (Visible on Mobile/Small Screen) -->
      <VendorMobileHeader 
        @toggle-sidebar="isMobileNavOpen = !isMobileNavOpen" 
        class="lg:hidden" 
      />

      <!-- Desktop Sidebar (Can be added here if a desktop layout is needed) -->
      <!-- <VendorSidebar class="hidden lg:flex" /> -->

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <router-view />
      </main>

      <!-- Mobile Sidebar Drawer -->
      <VendorSidebar 
        :is-open="isMobileNavOpen" 
        @close-sidebar="isMobileNavOpen = false" 
        class="lg:hidden" 
      />

      <!-- Mobile Bottom Navigation -->
      <VendorBottomNav class="lg:hidden" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import VendorMobileHeader from './components/VendorMobileHeader.vue';
import VendorSidebar from './components/VendorSidebar.vue';
import VendorBottomNav from './components/VendorBottomNav.vue';

const route = useRoute();
const isMobileNavOpen = ref(false);

const isAuthPage = computed(() => {
  const authRoutes = ['Login', 'Register', 'ForgotPassword'];
  return authRoutes.includes(route.name);
});
</script>

<style scoped>
/* No specific App.vue styling beyond Tailwind classes, as components handle their own */
</style>
