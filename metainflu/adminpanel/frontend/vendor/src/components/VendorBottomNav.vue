<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-surface border-t border-border lg:hidden z-40">
    <div class="flex justify-around">
      <router-link v-for="item in navItems" :key="item.name" :to="item.path" class="flex flex-col items-center justify-center w-full py-2 text-text-secondary"
        v-slot="{ isActive }">
        <component :is="isActive ? item.solidIcon : item.outlineIcon" class="w-6 h-6" :class="[isActive ? 'text-primary' : '']" />
        <span class="text-xs mt-1" :class="[isActive ? 'text-primary' : '']">{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { HomeIcon as HomeIconOutline, ChartBarIcon as ChartBarIconOutline, ClipboardDocumentListIcon as ClipboardDocumentListIconOutline, CubeIcon as CubeIconOutline } from '@heroicons/vue/24/outline';
import { HomeIcon as HomeIconSolid, ChartBarIcon as ChartBarIconSolid, ClipboardDocumentListIcon as ClipboardDocumentListIconSolid, CubeIcon as CubeIconSolid } from '@heroicons/vue/24/solid';

const navItems = [
  { name: 'Home', path: '/', outlineIcon: HomeIconOutline, solidIcon: HomeIconSolid },
  { name: 'Reports', path: '/reports', outlineIcon: ChartBarIconOutline, solidIcon: ChartBarIconSolid },
  { name: 'Tasks', path: '/tasks', outlineIcon: ClipboardDocumentListIconOutline, solidIcon: ClipboardDocumentListIconSolid },
  { name: 'Products', path: '/products', outlineIcon: CubeIconOutline, solidIcon: CubeIconSolid },
];
</script>