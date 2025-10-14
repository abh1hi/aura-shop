<template>
    <div class="p-4 sm:p-6 md:p-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Analytics</h1>
        <div class="flex items-center space-x-4">
          <select v-model="selectedRange" @change="handleDateRangeChange" class="bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button @click="fetchAnalyticsData" class="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center text-gray-500 py-10">Fetching analytics data...</div>
      <div v-else-if="error" class="text-center py-10 text-red-500">Error loading analytics: {{ error }}</div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div class="bg-green-100 p-3 rounded-full mr-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-600">Total Revenue</h3>
              <p class="text-3xl font-bold text-green-600">${{ stats.totalRevenue.toFixed(2) }}</p>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div class="bg-blue-100 p-3 rounded-full mr-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-600">Units Sold</h3>
              <p class="text-3xl font-bold text-gray-800">{{ stats.unitsSold }}</p>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div class="bg-purple-100 p-3 rounded-full mr-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-600">Total Orders</h3>
              <p class="text-3xl font-bold text-gray-800">{{ stats.totalOrders }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Sales Performance</h3>
          <div class="h-64 md:h-96">
            <canvas ref="salesChart"></canvas>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-gray-700 mb-4">Top Selling Products</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Product</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-600">Units Sold</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-600">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in paginatedProducts" :key="product.id" class="border-b">
                    <td class="py-3 px-4 text-gray-700">{{ product.name }}</td>
                    <td class="py-3 px-4 text-right text-gray-700">{{ product.units }}</td>
                    <td class="py-3 px-4 text-right text-gray-700">${{ product.revenue.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex justify-between items-center mt-4">
              <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-300 text-gray-700 py-2 px-4 rounded-md disabled:opacity-50">Previous</button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-300 text-gray-700 py-2 px-4 rounded-md disabled:opacity-50">Next</button>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-gray-700 mb-4">Commission & Payouts</h3>
            <div class="space-y-4">
              <div>
                <p class="text-gray-600">Pending Commission</p>
                <p class="text-2xl font-bold text-gray-800">${{ (stats.totalRevenue * 0.1).toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Next Payout Date</p>
                <p class="text-lg font-semibold text-gray-800">{{ nextPayoutDate }}</p>
              </div>
              <button class="w-full bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors">Request Payout</button>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors mt-2">View Payout History</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import vendorService from '../services/vendorService';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const stats = ref({
  totalRevenue: 0,
  unitsSold: 0,
  totalOrders: 0,
  topProducts: [],
});
const isLoading = ref(true);
const error = ref(null);
const salesChart = ref(null);
const selectedRange = ref('30');
const nextPayoutDate = ref('N/A');

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => {
  return Math.ceil(stats.value.topProducts.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return stats.value.topProducts.slice(startIndex, endIndex);
});

const fetchAnalyticsData = async () => {
  isLoading.value = true;
  error.value = null;
  let salesData = null;
  try {
    const params = {
      days: selectedRange.value
    };
    const data = await vendorService.getVendorDashboardStats(params);
    stats.value = {
      totalRevenue: data.totalRevenue || 0,
      unitsSold: data.unitsSold || 0,
      totalOrders: data.totalOrders || 0,
      topProducts: data.topProducts || [],
    };
    salesData = data.salesData;
    calculateNextPayoutDate();
  } catch (err) {
    error.value = err.message;
    console.error("Failed to fetch analytics:", err);
  } finally {
    isLoading.value = false;
    if (salesData) {
      await nextTick(); // Wait for DOM to update
      renderChart(salesData);
    }
  }
};

const renderChart = (salesData) => {
  if (salesChart.value) {
    const chartInstance = Chart.getChart(salesChart.value);
    if (chartInstance) {
      chartInstance.destroy();
    }
    new Chart(salesChart.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: salesData?.labels || [],
        datasets: [{
          label: 'Sales',
          data: salesData?.data || [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
};

const calculateNextPayoutDate = () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
  nextPayoutDate.value = nextMonth.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleDateRangeChange = () => {
  fetchAnalyticsData();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(() => {
  fetchAnalyticsData();
});
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>
