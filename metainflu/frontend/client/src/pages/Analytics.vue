<template>
  <div class="page-container">
    <h1 class="page-title">Sales Analytics & Reports</h1>

    <div class="stats-overview">
      <div class="stat-card">
        <p class="stat-label">Total Revenue (30 Days)</p>
        <p class="stat-value text-green-600">$18,450.25</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Units Sold (30 Days)</p>
        <p class="stat-value">489</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Average Order Value</p>
        <p class="stat-value">$75.50</p>
      </div>
    </div>
    
    <!-- Sales Chart Placeholder -->
    <div class="chart-card">
      <h2 class="section-subtitle">Monthly Sales Performance</h2>
      <div class="chart-placeholder">
        
        <p class="text-gray-500 mt-4">Actual chart implementation (using Chart.js/D3) would go here, displaying revenue trends over the last 6 months.</p>
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
                        <tr v-for="product in topProducts" :key="product.id">
                            <td>{{ product.name }}</td>
                            <td>{{ product.units }}</td>
                            <td>${{ product.revenue.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="table-card">
            <h2 class="section-subtitle">Commission & Payouts</h2>
            <div class="payout-info">
                <p><strong>Next Payout:</strong> October 31, 2025</p>
                <p><strong>Pending Commission:</strong> $1,845.03 (10% of Sales)</p>
                <button class="cta-button">View Payout History</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const topProducts = ref([
  { id: 1, name: 'Slim Denim Jeans', units: 150, revenue: 16500.00 },
  { id: 2, name: 'Minimalist Tee', units: 120, revenue: 5400.00 },
  { id: 3, name: 'Wool Coat', units: 80, revenue: 23920.00 },
]);
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
