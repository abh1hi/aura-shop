<template>
  <div :class="['fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out', isOpen ? 'translate-x-0' : '-translate-x-full', 'w-full']">
    <!-- Overlay -->
    <div v-if="isOpen" @click="$emit('close-sidebar')" class="absolute inset-0 bg-black bg-opacity-40"></div>

    <!-- Sidebar Content -->
    <div class="relative w-64" style="background:var(--surface);height:100%;box-shadow:var(--shadow-soft);padding:1rem;border-radius:var(--card-radius)" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Subtracker</h2>
        <button @click="$emit('close-sidebar')" class="p-2" style="border-radius:10px">
          <!-- Close Icon -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav style="flex:1;margin-top:0.5rem">
        <ul>
          <li v-for="item in navItems" :key="item.name" style="margin-bottom:0.4rem">
            <router-link :to="item.path" @click="$emit('close-sidebar')" style="display:flex;align-items:center;padding:0.6rem;border-radius:10px;color:var(--text);text-decoration:none">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="mt-auto pt-4" style="border-top:1px solid rgba(15,23,36,0.06);padding-top:0.8rem">
        <button @click="logout" style="display:flex;align-items:center;padding:0.6rem;border-radius:10px;width:100%;background:transparent;color:#e11d48;text-align:left">
          <!-- Logout Icon -->
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { inject } from 'vue';
import { HomeIcon, ChartBarIcon, ClipboardDocumentListIcon, CubeIcon, UserIcon, BellIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'; 

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close-sidebar']);

const route = useRoute();
const router = useRouter();
const store = inject('store');

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
  localStorage.removeItem('vendorAuthToken');
  localStorage.removeItem('vendorUser');
  store.isLoggedIn = false;
  store.user = null;
  emit('close-sidebar');
  router.push({ name: 'Login' });
};
</script>
