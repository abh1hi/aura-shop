<template>
  <aside :class="['fixed inset-y-0 left-0 z-50 flex-shrink-0 w-64 bg-surface transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0', isOpen ? 'translate-x-0' : '-translate-x-full']">
    <div class="flex items-center justify-between p-4 border-b border-border">
      <h2 class="text-xl font-bold text-text-primary">Vendor Panel</h2>
      <button @click="$emit('close-sidebar')" class="p-2 rounded-full hover:bg-gray-100 lg:hidden">
        <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <router-link v-for="item in navItems" :key="item.name" :to="item.path" class="flex items-center px-4 py-2.5 text-text-secondary rounded-lg hover:bg-primary-light hover:text-primary"
        active-class="bg-primary-light text-primary font-semibold">
        <component :is="item.icon" class="w-6 h-6 mr-3" />
        <span>{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-border">
      <button @click="logout" class="flex items-center w-full px-4 py-2.5 text-danger rounded-lg hover:bg-red-50">
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { globalState } from '../main.js';
import authService from '../services/authService';
import { HomeIcon, ChartBarIcon, ClipboardDocumentListIcon, CubeIcon, UserIcon, BellIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';

defineProps({ isOpen: { type: Boolean, required: true } });
const emit = defineEmits(['close-sidebar']);
const router = useRouter();

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'My Tasks', path: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Products', path: '/products', icon: CubeIcon },
  { name: 'Invoices', path: '/invoices', icon: DocumentTextIcon },
  { name: 'Notifications', path: '/notifications', icon: BellIcon },
  { name: 'Account', path: '/account', icon: UserIcon },
];

const logout = () => {
  authService.logout();
  globalState.isLoggedIn = false;
  globalState.user = null;
  emit('close-sidebar');
  router.push({ name: 'Login' });
};
</script>
