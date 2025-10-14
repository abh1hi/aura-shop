<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
    <div v-if="loading" class="text-center text-gray-500 py-8">
      Loading dashboard data...
    </div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Total Revenue</h3>
          <p class="text-3xl font-bold text-gray-800">${{ stats.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00' }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Total Orders</h3>
          <p class="text-3xl font-bold text-gray-800">{{ stats.totalOrders !== undefined ? stats.totalOrders : 0 }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Units Sold</h3>
          <p class="text-3xl font-bold text-gray-800">{{ stats.unitsSold !== undefined ? stats.unitsSold : 0 }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Details</th>
                <th class="text-right py-3 px-4 font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activity, index) in recentActivity" :key="index" class="border-b">
                <td class="py-3 px-4 text-gray-700">{{ activity.date }}</td>
                <td class="py-3 px-4 text-gray-700">{{ activity.type }}</td>
                <td class="py-3 px-4 text-gray-700">{{ activity.details }}</td>
                <td class="py-3 px-4 text-right text-gray-700">{{ activity.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="error" class="text-red-500 mt-4 p-4 bg-red-100 rounded-lg">
      Error fetching data: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import vendorService from '../services/vendorService';

const stats = ref({});
const loading = ref(true);
const error = ref(null);
const recentActivity = ref([]);

const fetchStats = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await vendorService.getVendorDashboardStats();
    stats.value = response;
    // Mock recent activity data
    recentActivity.value = [
      { date: '2025-10-14', type: 'Sale', details: 'Product A', amount: '$100.00' },
      { date: '2025-10-13', type: 'Sale', details: 'Product B', amount: '$50.00' },
      { date: '2025-10-12', type: 'Return', details: 'Product C', amount: '-$25.00' },
    ];
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    error.value = err.message || 'Could not connect to the server.';
    stats.value = { totalRevenue: 0, totalOrders: 0, unitsSold: 0 };
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>