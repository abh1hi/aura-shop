<template>
  <div class="min-h-screen">
    <!-- Mobile-first UI -->
    <div class="ui-mobile">
      <header class="sticky top-0 z-20 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <h1 class="text-lg font-bold">Vendor</h1>
        <button @click="toggleMenu" class="p-2 rounded-lg hover:bg-neutral-100">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </header>
      
      <main class="p-4 space-y-4" @touchstart.capture="touchStart" @touchend.capture="touchEnd">
        <section class="grid grid-cols-2 gap-3">
          <div class="bg-white rounded-xl p-4 shadow-soft">
            <p class="text-xs text-neutral-500">Today Sales</p>
            <p class="text-2xl font-bold">{{ kpis.todaySales }}</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-soft">
            <p class="text-xs text-neutral-500">Orders</p>
            <p class="text-2xl font-bold">{{ kpis.orders }}</p>
          </div>
        </section>
        
        <section class="bg-white rounded-xl p-4 shadow-soft">
          <h2 class="font-semibold mb-2">Recent Orders</h2>
          <ul class="divide-y divide-neutral-200">
            <li v-for="o in recentOrders" :key="o.id" class="py-3 flex items-center justify-between">
              <div>
                <p class="font-medium">#{{ o.id }}</p>
                <p class="text-xs text-neutral-500">{{ o.customer }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">${{ o.total }}</p>
                <p class="text-xs text-neutral-500">{{ o.status }}</p>
              </div>
            </li>
          </ul>
        </section>
      </main>
    </div>

    <!-- Desktop-first UI -->
    <div class="ui-desktop h-screen flex">
      <aside class="w-64 border-r border-neutral-200 p-4 space-y-2 bg-white">
        <div class="text-xl font-bold">Vendor</div>
        <router-link to="/dashboard" class="block px-3 py-2 rounded-lg hover:bg-neutral-100">Dashboard</router-link>
        <router-link to="/orders" class="block px-3 py-2 rounded-lg hover:bg-neutral-100">Orders</router-link>
        <router-link to="/products" class="block px-3 py-2 rounded-lg hover:bg-neutral-100">Products</router-link>
        <router-link to="/payments" class="block px-3 py-2 rounded-lg hover:bg-neutral-100">Payments</router-link>
        <router-link to="/settings" class="block px-3 py-2 rounded-lg hover:bg-neutral-100">Settings</router-link>
      </aside>
      <main class="flex-1 overflow-auto p-6 space-y-6">
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-6 shadow-soft"><p class="text-sm text-neutral-500">Today Sales</p><p class="text-3xl font-bold">{{ kpis.todaySales }}</p></div>
          <div class="bg-white rounded-xl p-6 shadow-soft"><p class="text-sm text-neutral-500">Orders</p><p class="text-3xl font-bold">{{ kpis.orders }}</p></div>
          <div class="bg-white rounded-xl p-6 shadow-soft"><p class="text-sm text-neutral-500">Revenue</p><p class="text-3xl font-bold">{{ kpis.revenue }}</p></div>
          <div class="bg-white rounded-xl p-6 shadow-soft"><p class="text-sm text-neutral-500">Payouts</p><p class="text-3xl font-bold">{{ kpis.payouts }}</p></div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-soft">
          <h2 class="font-semibold mb-4">Recent Orders</h2>
          <table class="w-full">
            <thead class="text-left text-sm text-neutral-500">
              <tr><th class="py-2">Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr v-for="o in recentOrders" :key="o.id">
                <td class="py-3 font-medium">#{{ o.id }}</td>
                <td>{{ o.customer }}</td>
                <td>${{ o.total }}</td>
                <td>{{ o.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { vendorApi } from '../services/vendorApi'

export default {
  name: 'VendorDashboard',
  data() {
    return {
      kpis: { todaySales: 0, orders: 0, revenue: 0, payouts: 0 },
      recentOrders: [],
      touchStartY: 0,
    }
  },
  async mounted() {
    try {
      const data = await vendorApi.dashboard()
      this.kpis = data.kpis || this.kpis
      this.recentOrders = data.recentOrders || []
    } catch (e) {
      console.error('Dashboard load failed', e)
    }
  },
  methods: {
    toggleMenu(){/* mobile menu noop placeholder */},
    touchStart(e){ this.touchStartY = e.changedTouches[0].clientY },
    touchEnd(e){
      const dy = e.changedTouches[0].clientY - this.touchStartY
      if (dy > 50) navigator.vibrate?.(20) // Haptic feedback on pull-down
    }
  }
}
</script>
