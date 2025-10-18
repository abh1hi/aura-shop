<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-gray-surface shadow-lg border-t border-gray-border lg:hidden z-40">
    <ul class="flex justify-around py-3">
      <li v-for="item in navItems" :key="item.name">
        <router-link
          :to="item.path"
          :class="['flex flex-col items-center text-xs',
                   route.path === item.path ? 'text-primary-blue font-semibold' : 'text-gray-text']"
        >
          <component :is="item.icon" class="w-6 h-6 mb-1" />
          <span>{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
// Icons (placeholder)
import { HomeIcon, ChartBarIcon, ClipboardDocumentListIcon, CubeIcon } from '@heroicons/vue/24/outline';

const route = useRoute();

const navItems = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'Tasks', path: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Products', path: '/products', icon: CubeIcon },
];
</script>