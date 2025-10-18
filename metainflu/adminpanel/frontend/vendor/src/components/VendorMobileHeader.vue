<template>
  <header class="bg-surface p-4 flex items-center justify-between border-b border-border lg:hidden sticky top-0 z-30">
    <button @click="$emit('toggle-sidebar')" class="p-2 -ml-2 text-text-primary">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
    </button>
    <h1 class="text-lg font-semibold text-text-primary">{{ route.meta.title || 'Dashboard' }}</h1>
    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
      <img :src="globalState.user?.avatar || 'https://api.dicebear.com/8.x/initials/svg?seed=JD'" alt="User Avatar" class="w-full h-full object-cover">
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { globalState } from '../main.js';

defineEmits(['toggle-sidebar']);
const route = useRoute();
</script>