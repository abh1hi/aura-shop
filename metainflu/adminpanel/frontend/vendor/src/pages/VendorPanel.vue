<template>
  <div class="p-4 space-y-5">
    <!-- Welcome Header --><div class="flex items-center justify-between mt-2">
      <div>
        <h1 class="text-xl font-semibold text-gray-dark-text">Welcome, {{ store.user?.name || 'Jane!' }}</h1>
        <p class="text-gray-text text-sm">Here's your dashboard summary.</p>
      </div>
      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <img :src="store.user?.avatar || 'https://api.dicebear.com/8.x/initials/svg?seed=JD'" alt="User Avatar" class="w-full h-full object-cover">
      </div>
    </div>

    <!-- Total Active Cost Card --><div class="card p-5 bg-secondary-blue overflow-hidden relative">
      <div class="absolute top-0 right-0 h-full w-2/5 bg-chart-light-green rounded-bl-3xl opacity-50"></div>
      <h2 class="text-sm text-gray-text mb-2 relative z-10">Total Active Cost</h2>
      <p class="text-3xl font-bold text-gray-dark-text relative z-10">$ {{ totalActiveCost.toFixed(2) }}</p>
      <p class="text-xs text-gray-text relative z-10">**** 1234</p>
    </div>

    <!-- Active Subscriptions & Upcoming Renewals --><div class="grid grid-cols-2 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-center bg-chart-light-blue w-10 h-10 rounded-lg mb-2">
          <svg class="w-6 h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <p class="text-3xl font-bold text-gray-dark-text">{{ activeSubscriptions }}</p>
        <p class="text-sm text-gray-text">Active Subscriptions</p>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-center bg-chart-light-purple w-10 h-10 rounded-lg mb-2">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <p class="text-3xl font-bold text-gray-dark-text">$ {{ upcomingRenewals.toFixed(2) }}</p>
        <p class="text-sm text-gray-text">Upcoming Renewals</p>
      </div>
    </div>

    <!-- Budget vs Actual Report Chart --><div class="card p-4">
      <h2 class="text-lg font-semibold text-gray-dark-text mb-4">Budget vs Actual Report</h2>
      <div class="h-48">
        <LineChart :chart-data="budgetVsActualData" />
      </div>
    </div>

    <!-- Weekly Spend Trend Chart --><div class="card p-4 mb-6">
      <h2 class="text-lg font-semibold text-gray-dark-text mb-4">Weekly Spend Trend</h2>
      <div class="h-48">
        <BarChart :chart-data="weeklySpendTrendData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import LineChart from '../components/charts/LineChart.vue';
import BarChart from '../components/charts/BarChart.vue';
import vendorService from '../services/vendorService'; // Your API service
import { useRoute } from 'vue-router'; // To update meta title

const store = inject('store');
const route = useRoute();
route.meta.title = 'Dashboard'; // Set page title for mobile header

const totalActiveCost = ref(0);
const activeSubscriptions = ref(0);
const upcomingRenewals = ref(0);
const budgetVsActualData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Budget',
      data: [3000, 2500, 3500, 3000, 4000, 3800, 4200],
      borderColor: '#A7ED86', // chart-green
      backgroundColor: 'rgba(167, 237, 134, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHitRadius: 10,
    },
    {
      label: 'Actual',
      data: [2500, 2800, 3000, 3200, 3500, 3700, 4000],
      borderColor: '#7B61FF', // chart-blue
      backgroundColor: 'rgba(123, 97, 255, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHitRadius: 10,
    }
  ]
});
const weeklySpendTrendData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Spend',
      data: [500, 700, 600, 900, 800, 1100, 1000],
      backgroundColor: [
        '#84E0FF', '#D9D0FF', '#84E0FF', '#D9D0FF', '#84E0FF', '#D9D0FF', '#84E0FF'
      ],
      borderRadius: 6,
      barThickness: 12,
    }
  ]
});

onMounted(async () => {
  // Fetch data from vendorService
  try {
    const dashboardStats = await vendorService.getDashboardStats();
    totalActiveCost.value = dashboardStats.totalActiveCost || 22729.00;
    activeSubscriptions.value = dashboardStats.activeSubscriptions || 11;
    upcomingRenewals.value = dashboardStats.upcomingRenewals || 5580.00;

    // Update chart data with fetched data
    // Example: if dashboardStats had budgetVsActual and weeklySpend
    // budgetVsActualData.value.datasets[0].data = dashboardStats.budgetVsActual.budget;
    // budgetVsActualData.value.datasets[1].data = dashboardStats.budgetVsActual.actual;
    // weeklySpendTrendData.value.datasets[0].data = dashboardStats.weeklySpend;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    // Use default mock data if API fails
  }
});
</script>