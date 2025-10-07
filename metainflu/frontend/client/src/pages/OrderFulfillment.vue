<template>
  <div class="page-container">
    <h1 class="page-title">Order Fulfillment Center</h1>

    <div class="status-grid">
      <div class="status-card" v-for="status in orderStatuses" :key="status.label" :style="{ '--card-color': status.color }">
        <div class="status-label">{{ status.label }}</div>
        <div class="status-count">{{ status.count }}</div>
      </div>
    </div>

    <div class="table-card mt-8">
      <h2 class="section-subtitle">Orders Awaiting Shipment</h2>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in pendingOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.date }}</td>
              <td>${{ order.total.toFixed(2) }}</td>
              <td><span :class="getStatusClass(order.status)">{{ order.status }}</span></td>
              <td>
                <button class="action-btn view-btn">View Details</button>
                <button class="action-btn ship-btn">Mark Shipped</button>
              </td>
            </tr>
            <tr v-if="pendingOrders.length === 0">
                <td colspan="6" class="text-center text-gray-500 py-4">No pending orders at this time.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const orderStatuses = ref([
    { label: 'New Orders', count: 5, color: '#f59e0b' }, // Amber
    { label: 'Awaiting Payment', count: 2, color: '#ef4444' }, // Red
    { label: 'Ready to Ship', count: 8, color: '#3b82f6' }, // Blue
    { label: 'Returns', count: 1, color: '#a855f7' }, // Purple
]);

const pendingOrders = ref([
    { id: 1001, customer: 'Jane Doe', date: 'Oct 8, 2025', total: 125.50, status: 'Processing' },
    { id: 1002, customer: 'John Smith', date: 'Oct 7, 2025', total: 89.99, status: 'Processing' },
    { id: 1003, customer: 'Alice Brown', date: 'Oct 7, 2025', total: 340.00, status: 'New' },
]);

const getStatusClass = (status) => {
    switch (status) {
        case 'New': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'Processing': return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'Shipped': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
        default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
};
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
.status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}
.status-card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    border-left: 5px solid var(--card-color);
}
.status-label {
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
}
.status-count {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
}
.table-card {
    background-color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.section-subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
}
.table-responsive {
    overflow-x: auto;
}
table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
}
th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
}
th {
    background-color: #f8f8f8;
    font-weight: 600;
    color: #555;
}
.action-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-right: 0.5rem;
    border: none;
    transition: opacity 0.2s;
}
.view-btn {
    background-color: #f0f4ff;
    color: #3b82f6;
}
.ship-btn {
    background-color: #d1fae5;
    color: #059669;
}
@media (max-width: 768px) {
    .status-count {
        font-size: 2rem;
    }
}
</style>
