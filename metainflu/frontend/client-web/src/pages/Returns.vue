<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Returns</h1>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="flex items-center space-x-4">
        <label for="status-filter" class="text-gray-600 font-semibold">Filter by status:</label>
        <select id="status-filter" v-model="selectedStatus" class="bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div class="relative">
        <input type="text" placeholder="Search by Order ID or Product..." v-model="searchQuery" class="bg-white border border-gray-300 rounded-md py-2 px-4 w-full sm:w-64">
        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </div>

    <!-- Returns Table -->
    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Order ID</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Product</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
            <th class="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
            <th class="text-center py-3 px-4 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredReturns.length === 0">
            <td colspan="6" class="text-center py-10 text-gray-500">No returns found.</td>
          </tr>
          <tr v-for="item in filteredReturns" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="py-3 px-4 text-gray-700">#{{ item.orderId }}</td>
            <td class="py-3 px-4 text-gray-700">{{ item.customer }}</td>
            <td class="py-3 px-4 text-gray-700">{{ item.product }}</td>
            <td class="py-3 px-4 text-gray-700">{{ item.date }}</td>
            <td class="py-3 px-4 text-center">
              <span :class="statusClass(item.status)" class="px-3 py-1 rounded-full text-sm font-semibold">
                {{ item.status }}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <button v-if="item.status === 'pending'" @click="approveReturn(item.id)" class="text-green-600 hover:text-green-800 font-semibold mr-2">Approve</button>
              <button v-if="item.status === 'pending'" @click="rejectReturn(item.id)" class="text-red-600 hover:text-red-800 font-semibold">Reject</button>
              <button @click="viewDetails(item.id)" class="text-blue-600 hover:text-blue-800 font-semibold ml-2">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const returns = ref([
  { id: 1, orderId: '1001', customer: 'John Doe', product: 'Classic Tee', date: '2025-10-10', status: 'pending' },
  { id: 2, orderId: '1002', customer: 'Jane Smith', product: 'Denim Jeans', date: '2025-10-09', status: 'approved' },
  { id: 3, orderId: '1003', customer: 'Peter Jones', product: 'Hoodie', date: '2025-10-08', status: 'rejected' },
  { id: 4, orderId: '1004', customer: 'Sarah Miller', product: 'Classic Tee', date: '2025-10-07', status: 'pending' },
]);

const selectedStatus = ref('all');
const searchQuery = ref('');

const filteredReturns = computed(() => {
  return returns.value.filter(item => {
    const statusMatch = selectedStatus.value === 'all' || item.status === selectedStatus.value;
    const searchMatch = item.orderId.includes(searchQuery.value) || item.product.toLowerCase().includes(searchQuery.value.toLowerCase());
    return statusMatch && searchMatch;
  });
});

const statusClass = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'pending',
    'bg-green-100 text-green-800': status === 'approved',
    'bg-red-100 text-red-800': status === 'rejected',
  };
};

const approveReturn = (id) => {
  const item = returns.value.find(r => r.id === id);
  if (item) item.status = 'approved';
};

const rejectReturn = (id) => {
  const item = returns.value.find(r => r.id === id);
  if (item) item.status = 'rejected';
};

const viewDetails = (id) => {
  alert(`Viewing details for return ID: ${id}`);
};
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>