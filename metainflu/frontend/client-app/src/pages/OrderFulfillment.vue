<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Order Fulfillment</h1>

    <div v-if="loadingOrders" class="text-center text-gray-500 py-8">Loading orders...</div>
    <div v-else-if="error" class="text-red-500 p-4 bg-red-100 rounded-lg">Error fetching orders: {{ error }}</div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
          <h3 class="text-lg font-semibold text-gray-600">Pending</h3>
          <p class="text-3xl font-bold text-gray-800">{{ pendingOrders.length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-lg font-semibold text-gray-600">Shipped</h3>
          <p class="text-3xl font-bold text-gray-800">{{ shippedOrders.length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-lg font-semibold text-gray-600">Delivered</h3>
          <p class="text-3xl font-bold text-gray-800">{{ deliveredOrders.length }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 class="text-lg font-semibold text-gray-600">Cancelled</h3>
          <p class="text-3xl font-bold text-gray-800">{{ cancelledOrders.length }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Pending Orders</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Order ID</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                <th class="text-right py-3 px-4 font-semibold text-gray-600">Total</th>
                <th class="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                <th class="text-center py-3 px-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in pendingOrders" :key="order._id" class="border-b">
                <td class="py-3 px-4 text-gray-700">#{{ order._id.substring(0, 8) }}...</td>
                <td class="py-3 px-4 text-gray-700">{{ order.user ? order.user.name : 'N/A' }}</td>
                <td class="py-3 px-4 text-gray-700">{{ formatDate(order.createdAt) }}</td>
                <td class="py-3 px-4 text-right text-gray-700">${{ order.total.toFixed(2) }}</td>
                <td class="py-3 px-4 text-center"><span :class="getStatusClass(order.status)">{{ order.status }}</span></td>
                <td class="py-3 px-4 text-center space-x-2">
                  <button @click="viewDetails(order)" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Details</button>
                  <button @click="markShipped(order._id)" class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600" :disabled="shippingId === order._id">
                    {{ shippingId === order._id ? 'Updating...' : 'Ship' }}
                  </button>
                </td>
              </tr>
              <tr v-if="pendingOrders.length === 0">
                <td colspan="6" class="text-center text-gray-500 py-4">No pending orders.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import vendorService from '../services/vendorService';

const orders = ref([]);
const loadingOrders = ref(true);
const shippingId = ref(null);
const error = ref(null);

const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'));
const shippedOrders = computed(() => orders.value.filter(o => o.status === 'shipped'));
const deliveredOrders = computed(() => orders.value.filter(o => o.status === 'delivered'));
const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'cancelled'));

const fetchOrders = async () => {
  loadingOrders.value = true;
  error.value = null;
  try {
    const response = await vendorService.getVendorOrders();
    orders.value = response;
  } catch (err) {
    console.error("Failed to fetch vendor orders:", err);
    error.value = err.message || 'Could not load order fulfillment data.';
    orders.value = [];
  } finally {
    loadingOrders.value = false;
  }
};

const markShipped = async (orderId) => {
  shippingId.value = orderId;
  error.value = null;
  try {
    await vendorService.markOrderShipped(orderId);
    const index = orders.value.findIndex(o => o._id === orderId);
    if (index !== -1) {
      orders.value[index].status = 'shipped';
    }
  } catch (err) {
    console.error('Error marking order as shipped:', err);
    error.value = err.message || `Failed to ship order #${orderId}.`;
  } finally {
    shippingId.value = null;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'shipped': return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'delivered': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'cancelled': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
    default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const viewDetails = (order) => {
  console.log('Viewing order details:', order);
  // Placeholder for modal implementation
};

onMounted(fetchOrders);
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>
