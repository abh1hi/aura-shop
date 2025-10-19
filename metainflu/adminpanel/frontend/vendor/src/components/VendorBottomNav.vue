<template>
  <nav class="bg-gray-surface border-t border-gray-border" role="navigation" aria-label="Primary">
    <ul class="grid grid-cols-5">
      <li v-for="item in items" :key="item.name">
        <RouterLink
          :to="item.to"
          class="flex flex-col items-center justify-center h-14 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <component :is="item.icon" class="h-6 w-6" :class="isActive(item) ? 'text-primary-blue' : 'text-gray-text'" />
          <span class="text-[11px] mt-0.5" :class="isActive(item) ? 'text-primary-blue' : 'text-gray-text'">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
// Placeholder icons; replace with your icon components
const HomeIcon = {
  template: '<svg viewBox="0 0 24 24" class="fill-current"><path d="M12 3l9 8h-3v10h-4V14H10v7H6V11H3z"/></svg>'
};
const TagIcon = { template: '<svg viewBox="0 0 24 24" class="fill-current"><path d="M20 10l-8-8H4v8l8 8 8-8z"/></svg>' };
const ClipboardIcon = { template: '<svg viewBox="0 0 24 24" class="fill-current"><path d="M9 2h6v2h4v18H5V4h4V2z"/></svg>' };
const ChartBarIcon = { template: '<svg viewBox="0 0 24 24" class="fill-current"><path d="M3 21h18v-2H3v2zm2-4h3v-7H5v7zm5 0h3V4h-3v13zm5 0h3V9h-3v8z"/></svg>' };
const UserIcon = { template: '<svg viewBox="0 0 24 24" class="fill-current"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z"/></svg>' };

const items = [
  { name: 'Dashboard', label: 'Home', to: { name: 'Dashboard' }, icon: HomeIcon },
  { name: 'ManageProducts', label: 'Products', to: { name: 'ManageProducts' }, icon: TagIcon },
  { name: 'OrderFulfillment', label: 'Orders', to: { name: 'OrderFulfillment' }, icon: ClipboardIcon },
  { name: 'Reports', label: 'Reports', to: { name: 'Reports' }, icon: ChartBarIcon },
  { name: 'Account', label: 'Account', to: { name: 'Account' }, icon: UserIcon },
];
const isActive = (item) => route.name === item.name;
</script>
