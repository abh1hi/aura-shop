<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Welcome Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Welcome, {{ globalState.user?.name || 'Vendor' }}!</h1>
        <p class="text-text-secondary">Here is your dashboard summary.</p>
      </div>
      <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <img :src="globalState.user?.avatar || 'https://api.dicebear.com/8.x/initials/svg?seed=JD'" alt="User Avatar" class="w-full h-full object-cover">
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card">
        <h2 class="text-sm font-medium text-text-secondary">Total Revenue</h2>
        <p class="text-3xl font-bold text-text-primary mt-2">$ {{ totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="card">
        <h2 class="text-sm font-medium text-text-secondary">Total Orders</h2>
        <p class="text-3xl font-bold text-text-primary mt-2">{{ totalOrders }}</p>
      </div>
      <div class="card">
        <h2 class="text-sm font-medium text-text-secondary">New Customers</h2>
        <p class="text-3xl font-bold text-text-primary mt-2">{{ newCustomers }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-text-primary mb-4">Sales Trend</h2>
        <div class="h-64">
          <LineChart :chart-data="salesTrendData" />
        </div>
      </div>
      <div class="card">
        <h2 class="text-lg font-semibold text-text-primary mb-4">Top Products</h2>
        <div class="h-64">
          <BarChart :chart-data="topProductsData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LineChart from '../components/charts/LineChart.vue';
import BarChart from '../components/charts/BarChart.vue';
import vendorService from '../services/vendorService';
import { globalState } from '../main.js';

const totalRevenue = ref(0);
const totalOrders = ref(0);
const newCustomers = ref(0);

const salesTrendData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales',
      data: [1200, 1900, 3000, 5000, 2300, 3200],
      borderColor: 'var(--primary)',
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
});

const topProductsData = ref({
  labels: ['Product A', 'Product B', 'Product C', 'Product D'],
  datasets: [
    {
      label: 'Units Sold',
      data: [45, 80, 60, 95],
      backgroundColor: 'var(--primary)',
      borderRadius: 4,
    },
  ],
});

onMounted(async () => {
  try {
    const dashboardStats = await vendorService.getVendorDashboardStats();
    totalRevenue.value = dashboardStats.totalRevenue || 0;
    totalOrders.value = dashboardStats.totalOrders || 0;
    newCustomers.value = dashboardStats.newCustomers || 0;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }
});
</script>