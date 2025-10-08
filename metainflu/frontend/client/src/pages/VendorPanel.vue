<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <div v-if="loading" class="text-center text-gray-500 py-8">
      Loading dashboard data...
    </div>
    <div v-else class="dashboard-grid">
      <div class="dashboard-card">
        <h3>Total Sales (Approx.)</h3>
        <p>${{ stats.totalSales ? stats.totalSales.toFixed(2) : '0.00' }}</p>
      </div>
      <div class="dashboard-card">
        <h3>Total Orders</h3>
        <p>{{ stats.totalOrders !== undefined ? stats.totalOrders : 0 }}</p>
      </div>
      <div class="dashboard-card">
        <h3>New Orders</h3>
        <p>{{ stats.newOrders !== undefined ? stats.newOrders : 0 }}</p>
      </div>
      <div class="dashboard-card">
        <h3>Pending Returns</h3>
        <p>{{ stats.pendingReturns !== undefined ? stats.pendingReturns : 0 }}</p>
      </div>
    </div>
    <div v-if="error" class="text-red-500 mt-4 p-4 bg-red-100 rounded-lg">
      Error fetching data: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import vendorService from '../services/vendorService'; // Import the new service

const stats = ref({});
const loading = ref(true);
const error = ref(null);

/**
 * Fetches dashboard statistics from the backend API.
 */
const fetchStats = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await vendorService.getDashboardStats();
    // Assuming the response structure matches: { totalSales, totalOrders, newOrders, pendingReturns }
    stats.value = response;
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    error.value = err.message || 'Could not connect to the server.';
    // Set mock fallback data in case of failure
    stats.value = { totalSales: 0, totalOrders: 0, newOrders: 0, pendingReturns: 0 };
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.dashboard-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #555;
}

.dashboard-card p {
  font-size: 2rem;
  font-weight: 700;
  color: var(--c5);
}
</style>
