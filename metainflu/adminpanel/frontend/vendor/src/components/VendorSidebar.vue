<template>
  <aside class="hidden md:flex flex-col gap-3 p-3" :class="wrapperClass">
    <!-- Profile Card -->
    <div class="card p-3">
      <div class="flex items-center gap-3">
        <img :src="vendorProfile.avatar" alt="" class="h-10 w-10 rounded-full" />
        <div>
          <div class="text-[15px] font-semibold text-[color:var(--text)]">{{ vendorProfile.name }}</div>
          <div class="text-[12px] text-[color:var(--text-tertiary)]">{{ vendorProfile.businessName }}</div>
        </div>
      </div>
    </div>

    <!-- Navigation (grouped) -->
    <nav class="grouped" role="navigation" aria-label="Primary">
      <RouterLink
        v-for="item in nav"
        :key="item.name"
        :to="item.to"
        class="row items-center"
        :class="linkClass(item)"
      >
        <component :is="item.icon" class="h-5 w-5 mr-3" :class="iconClass(item)" />
        <span class="text-[15px]">{{ item.label }}</span>
        <span v-if="item.badge" class="ml-auto text-[12px] px-2 py-0.5 rounded-full" :class="badgeClass(item)">{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <!-- Quick KPIs -->
    <div class="grid grid-cols-2 gap-3">
      <div class="card p-3">
        <div class="text-[11px] text-[color:var(--text-tertiary)]">This Month</div>
        <div class="text-[17px] font-semibold text-[color:var(--text)]">₹{{ formatCurrency(monthlyRevenue) }}</div>
      </div>
      <div class="card p-3">
        <div class="text-[11px] text-[color:var(--text-tertiary)]">Pending</div>
        <div class="text-[17px] font-semibold text-[color:var(--text)]">{{ pendingOrders }}</div>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { HomeIcon, ChartBarIcon, ShoppingBagIcon, PlusCircleIcon, ClipboardDocumentListIcon, DocumentTextIcon, EyeIcon, UserIcon, BellIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'VendorSidebar',
  components: { RouterLink, HomeIcon, ChartBarIcon, ShoppingBagIcon, PlusCircleIcon, ClipboardDocumentListIcon, DocumentTextIcon, EyeIcon, UserIcon, BellIcon },
  setup() {
    const route = useRoute();

    const vendorProfile = ref({ name: 'Rajesh Kumar', businessName: 'Kumar Electronics', avatar: '/images/vendor-avatar.jpg' });
    const monthlyRevenue = ref(125000);
    const pendingOrders = ref(23);

    const nav = ref([
      { name: 'dashboard', label: 'Dashboard', to: { name: 'Dashboard' }, icon: 'HomeIcon' },
      { name: 'analytics', label: 'Analytics', to: { name: 'Analytics' }, icon: 'ChartBarIcon' },
      { name: 'products', label: 'Manage Products', to: { name: 'ManageProducts' }, icon: 'ShoppingBagIcon' },
      { name: 'add', label: 'Add Product', to: { name: 'AddProduct' }, icon: 'PlusCircleIcon' },
      { name: 'orders', label: 'Orders', to: { name: 'OrderFulfillment' }, icon: 'ClipboardDocumentListIcon', badge: pendingOrders.value ? String(pendingOrders.value) : null },
      { name: 'invoices', label: 'Invoices', to: { name: 'Invoices' }, icon: 'DocumentTextIcon' },
      { name: 'sales', label: 'Sales', to: { name: 'ViewSales' }, icon: 'EyeIcon' },
      { name: 'account', label: 'Account', to: { name: 'Account' }, icon: 'UserIcon' },
      { name: 'notifications', label: 'Notifications', to: { name: 'Notifications' }, icon: 'BellIcon' }
    ]);

    const isActive = (to) => {
      if (to.name && route.name) return route.name === to.name;
      return route.path === (typeof to === 'string' ? to : to.path);
    };

    const linkClass = (item) => ({
      'bg-black/5': isActive(item.to),
      'text-[color:var(--text)]': isActive(item.to),
      'text-[color:var(--text)] hover:bg-black/3': !isActive(item.to),
      'rounded-none': true
    });

    const iconClass = (item) => ({
      'text-[color:var(--primary)]': isActive(item.to),
      'text-[color:var(--text-tertiary)]': !isActive(item.to)
    });

    const badgeClass = (item) => ({
      'bg-[color:var(--primary)] text-white': isActive(item.to),
      'bg-black/10 text-[color:var(--text)]': !isActive(item.to)
    });

    const formatCurrency = (v) => new Intl.NumberFormat('en-IN').format(v);

    // Sticky sidebar and width control
    const wrapperClass = computed(() => 'w-[280px] sticky top-14 self-start');

    return { vendorProfile, monthlyRevenue, pendingOrders, nav, linkClass, iconClass, badgeClass, formatCurrency, wrapperClass };
  }
};
</script>
