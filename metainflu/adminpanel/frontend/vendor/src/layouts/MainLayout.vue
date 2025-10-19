<template>
  <div class="min-h-screen flex bg-gray-100" v-touch:swipe.right="openSidebar" v-touch:swipe.left="closeSidebar">
    <!-- Desktop Sidebar -->
    <VendorSidebar class="hidden lg:flex" />

    <div class="flex-1 flex flex-col">
      <!-- Mobile Header -->
      <VendorMobileHeader @toggle-sidebar="isMobileNavOpen = !isMobileNavOpen" class="lg:hidden" />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6">
        <router-view />
      </main>

      <!-- Mobile Sidebar Drawer -->
      <VendorSidebar :is-open="isMobileNavOpen" @close-sidebar="isMobileNavOpen = false" class="lg:hidden" />

      <!-- Mobile Bottom Navigation -->
      <VendorBottomNav class="lg:hidden" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VendorMobileHeader from '../components/VendorMobileHeader.vue';
import VendorSidebar from '../components/VendorSidebar.vue';
import VendorBottomNav from '../components/VendorBottomNav.vue';

const isMobileNavOpen = ref(false);

const openSidebar = () => {
  isMobileNavOpen.value = true;
};

const closeSidebar = () => {
  isMobileNavOpen.value = false;
};
</script>
