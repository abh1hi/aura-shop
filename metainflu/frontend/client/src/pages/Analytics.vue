<template>
  <div class="page-container">
    <h1 class="page-title">Sales Analytics & Reports</h1>

    <div v-if="isLoading" class="text-center py-10">
        <p class="text-xl text-gray-500">Fetching live analytics data...</p>
    </div>
    <div v-else-if="error" class="text-center py-10">
        <p class="text-xl text-red-500">Error loading analytics: {{ error }}</p>
    </div>
    <div v-else>
        <!-- STATS OVERVIEW -->
        <div class="stats-overview">
            <div class="stat-card">
                <p class="stat-label">Total Revenue (30 Days)</p>
                <p class="stat-value text-green-600">${{ stats.totalRevenue.toFixed(2) }}</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Units Sold (30 Days)</p>
                <p class="stat-value">{{ stats.unitsSold }}</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Total Orders Handled</p>
                <p class="stat-value">{{ stats.totalOrders }}</p>
            </div>
        </div>
        
        <!-- Sales Chart Placeholder (Placeholder remains until chart library integration) -->
        <div class="chart-card">
            <h2 class="section-subtitle">Monthly Sales Performance</h2>
            <div class="chart-placeholder">
                <p class="text-gray-500 mt-4">Actual chart implementation (using Chart.js/D3) would go here, displaying revenue trends over time.</p>
            </div>
        </div>

        <!-- Top Products/Commissions -->
        <div class="grid-2-col">
            <div class="table-card">
                <h2 class="section-subtitle">Top Selling Products</h2>
                 <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Units Sold</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in stats.topProducts" :key="product.id">
                                <td>{{ product.name }}</td>
                                <td>{{ product.units }}</td>
                                <td>${{ product.revenue.toFixed(2) }}</td>
                            </tr>
                            <tr v-if="stats.topProducts.length === 0">
                                <td colspan="3" class="text-center text-gray-500 py-4">No sales data available.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-card">
                <h2 class="section-subtitle">Commission & Payouts</h2>
                <div class="payout-info">
                    <p><strong>Next Payout:</strong> N/A</p>
                    <p><strong>Pending Commission:</strong> ${{ (stats.totalRevenue * 0.1).toFixed(2) }} (10% of Sales)</p>
                    <button class="cta-button">View Payout History</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import vendorService from '../services/vendorService';

const stats = ref({
    totalRevenue: 0,
    unitsSold: 0,
    totalOrders: 0,
    topProducts: [],
});
const isLoading = ref(true);
const error = ref(null);

const fetchAnalyticsData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const data = await vendorService.getVendorDashboardStats();
        
        // Map the data structure from the API to the local state structure
        stats.value = {
            totalRevenue: data.totalRevenue || 0,
            unitsSold: data.unitsSold || 0,
            totalOrders: data.totalOrders || 0,
            topProducts: data.topProducts || [],
        };
        
    } catch (err) {
        error.value = err.message;
        console.error("Failed to fetch analytics:", err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchAnalyticsData();
});
</script>

<style scoped>
.page-container {
    background-color: #f4f4f9;
    min-height: 100%;
}
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}
.stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}
.stat-card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.stat-label {
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
}
.stat-value {
    font-size: 2.5rem;
    font-weight: 700;
}
.chart-card {
    background-color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    margin-bottom: 2rem;
}
.chart-placeholder {
    height: 300px;
    background-color: #f0f0f5;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Image of a placeholder line chart showing sales over time */
.chart-placeholder::before {
    content: "Sales Chart Placeholder";
    font-size: 1.5rem;
    color: #777;
}

.section-subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
}
.grid-2-col {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}
.table-card {
    background-color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.table-responsive {
    overflow-x: auto;
}
table {
    width: 100%;
    min-width: 400px;
    border-collapse: collapse;
}
th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}
th {
    background-color: #f8f8f8;
    font-weight: 600;
    color: #555;
}
.payout-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}
.cta-button {
    background-color: var(--c5);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
    display: inline-block;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}
</style>
