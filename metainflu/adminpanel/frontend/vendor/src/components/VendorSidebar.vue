<template>
  <aside class="w-[280px] hidden md:flex flex-col gap-3 p-3">
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
    <nav class="grouped">
      <button v-for="item in nav" :key="item.name" @click="go(item.to)" class="row w-full text-left">
        <component :is="item.icon" class="h-5 w-5 mr-3 text-[color:var(--text-tertiary)]" />
        <span class="text-[15px] text-[color:var(--text)]">{{ item.label }}</span>
        <span class="ml-auto text-[12px] text-[color:var(--text-tertiary)]" v-if="item.badge">{{ item.badge }}</span>
      </button>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { HomeIcon, ChartBarIcon, ShoppingBagIcon, PlusCircleIcon, ClipboardDocumentListIcon, DocumentTextIcon, EyeIcon, UserIcon, BellIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'VendorSidebar',
  setup() {
    const router = useRouter();
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

    const go = (to) => router.push(to);
    const formatCurrency = (v) => new Intl.NumberFormat('en-IN').format(v);

    return { vendorProfile, monthlyRevenue, pendingOrders, nav, go, formatCurrency };
  },
  components: { HomeIcon, ChartBarIcon, ShoppingBagIcon, PlusCircleIcon, ClipboardDocumentListIcon, DocumentTextIcon, EyeIcon, UserIcon, BellIcon }
};
</script>
