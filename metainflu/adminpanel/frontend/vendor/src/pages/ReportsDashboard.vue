<template>
  <div class="p-4 space-y-5">
    <h1 class="text-xl font-semibold text-gray-dark-text mb-4 mt-2">Reports Dashboard</h1>

    <!-- Tabs for Reports --><div class="flex bg-gray-bg p-1 rounded-lg">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="['flex-1 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                 activeTab === tab ? 'bg-primary-blue text-white shadow-md' : 'text-gray-text hover:bg-gray-100']"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Content based on activeTab --><div v-if="activeTab === 'Standard Reports'">
      <!-- Vendors by Profile Chart --><div class="card p-4 mb-5">
        <h2 class="text-lg font-semibold text-gray-dark-text mb-4">Vendors by Profile</h2>
        <div class="h-48">
          <BarChart :chart-data="vendorsByProfileData" :chart-options="{ scales: { y: { beginAtZero: true, ticks: { callback: (value) => value } } } }" />
        </div>
      </div>

      <!-- Usage Analysis Doughnut Chart --><div class="card p-4 mb-5 flex flex-col items-center">
        <h2 class="text-lg font-semibold text-gray-dark-text mb-4">Usage Analysis</h2>
        <div class="w-40 h-40 relative">
          <DoughnutChart :chart-data="usageAnalysisData" :chart-options="{ cutout: '75%' }" />
          <div class="absolute inset-0 flex items-center justify-center text-primary-blue text-3xl font-bold">
            {{ usagePercentage }}%
          </div>
        </div>
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-text">{{ usageAnalysisDescription }}</p>
          <div class="flex items-center justify-center mt-2 space-x-4">
            <div class="chart-legend-item">
              <span class="bg-primary-blue"></span><span>Subscriptions used</span>
            </div>
            <div class="chart-legend-item">
              <span class="bg-gray-border"></span><span>Not used</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Spend by Department --><div class="card p-4">
        <h2 class="text-lg font-semibold text-gray-dark-text mb-4">Spend by Department</h2>
        <div class="space-y-3">
          <div v-for="department in spendByDepartment" :key="department.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center mr-3', department.bgColor]">
                <component :is="department.icon" :class="['w-5 h-5', department.iconColor]" />
              </div>
              <span class="text-gray-dark-text">{{ department.name }}</span>
            </div>
            <span :class="['font-semibold', department.value < 0 ? 'text-danger-red' : 'text-gray-dark-text']">{{ department.value < 0 ? '-' : '' }}${{ Math.abs(department.value).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="card p-4 text-gray-text text-center">Content for {{ activeTab }} reports will be available here.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BarChart from '../components/charts/BarChart.vue';
import DoughnutChart from '../components/charts/DoughnutChart.vue';
import vendorService from '../services/vendorService'; // Your API service
import { UserGroupIcon, LifebuoyIcon as SupportIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'; // Example icons

const route = useRoute();
route.meta.title = 'Reports'; // Set page title for mobile header

const activeTab = ref('Standard Reports');
const tabs = ['Standard Reports', 'Financial', 'Renewal'];

// Mock Data for Charts
const vendorsByProfileData = ref({
  labels: ['Strategic', 'Tactical', 'Operational'],
  datasets: [
    {
      label: 'Vendors',
      data: [15000, 30000, 10000], // Example data points
      backgroundColor: ['#84E0FF', '#D9D0FF', '#84E0FF'], // Consistent with dashboard
      borderRadius: 6,
      barThickness: 24, // Adjust for thicker bars
    }
  ]
});

const usagePercentage = ref(75);
const usageAnalysisDescription = ref('Subscriptions used');
const usageAnalysisData = ref({
  labels: ['Used', 'Not Used'],
  datasets: [
    {
      data: [usagePercentage.value, 100 - usagePercentage.value],
      backgroundColor: ['#7B61FF', '#E0E0E0'], // primary-blue, gray-border
      borderColor: '#FFFFFF', // White border for separation
      borderWidth: 2,
    }
  ]
});

const spendByDepartment = ref([
  { name: 'Customer Service', value: -2470.00, icon: SupportIcon, bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
  { name: 'Human Resources', value: -3580.00, icon: UserGroupIcon, bgColor: 'bg-red-100', iconColor: 'text-red-500' },
  { name: 'Finance', value: -1100.00, icon: CurrencyDollarIcon, bgColor: 'bg-green-100', iconColor: 'text-green-500' },
  // ... more departments
]);

onMounted(async () => {
  // Fetch data for reports from vendorService
  try {
    // Example calls:
    // const reportsData = await vendorService.getReports();
    // vendorsByProfileData.value = processReportsData(reportsData.vendorsByProfile);
    // usagePercentage.value = reportsData.usageAnalysis.percentage;
    // usageAnalysisData.value.datasets[0].data = [usagePercentage.value, 100 - usagePercentage.value];
    // spendByDepartment.value = reportsData.spendByDepartment;
  } catch (error) {
    console.error("Failed to fetch reports data:", error);
  }
});
</script>