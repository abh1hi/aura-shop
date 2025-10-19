<template>
  <div class="min-h-screen flex flex-col bg-gray-bg text-gray-dark-text">
    <VendorMobileHeader
      v-if="!isAuthPage"
      class="lg:hidden sticky top-0 z-30 backdrop-blur border-b border-gray-border"
      :title="routeTitle"
      @toggle-sidebar="isMobileNavOpen = !isMobileNavOpen"
    />

    <main id="main" class="flex-1 overflow-y-auto pb-20 lg:pb-0" role="main">
      <router-view />
    </main>

    <VendorSidebar :is-open="isMobileNavOpen" @close-sidebar="isMobileNavOpen=false" class="lg:hidden" />

    <VendorBottomNav v-if="!isAuthPage" class="lg:hidden fixed bottom-0 inset-x-0 z-40" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import VendorMobileHeader from './components/VendorMobileHeader.vue';
import VendorBottomNav from './components/VendorBottomNav.vue';
import VendorSidebar from './components/VendorSidebar.vue';

const route = useRoute();
const isMobileNavOpen = ref(false);
const isAuthPage = computed(() => ['Login', 'Register', 'ForgotPassword'].includes(route.name));
const routeTitle = computed(() => route.meta?.title || 'Vendor');
</script>
