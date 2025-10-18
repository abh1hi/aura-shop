<template>
  <header class="bg-gray-surface p-4 flex items-center justify-between shadow-soft lg:hidden sticky top-0 z-40">
    <button @click="$emit('toggle-sidebar')" class="p-2 -ml-2 text-gray-dark-text">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
    </button>
    <h1 class="text-lg font-semibold text-gray-dark-text">{{ route.meta.title || 'Dashboard' }}</h1>
    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
      <img :src="store.user?.avatar || 'https://api.dicebear.com/8.x/initials/svg?seed=JD'" alt="User Avatar" class="w-full h-full object-cover">
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { inject } from 'vue';

const route = useRoute();
const store = inject('store');

defineEmits(['toggle-sidebar']);
</script>