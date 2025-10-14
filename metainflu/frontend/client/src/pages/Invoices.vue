<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Invoices</h1>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="flex items-center space-x-4">
        <label for="status-filter" class="text-gray-600 font-semibold">Filter by status:</label>
        <select id="status-filter" v-model="selectedStatus" class="bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700">
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div class="relative">
        <input type="text" placeholder="Search by Invoice ID or Customer..." v-model="searchQuery" class="bg-white border border-gray-300 rounded-md py-2 px-4 w-full sm:w-64">
        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </div>

    <!-- Invoices Table -->
    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Invoice ID</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
            <th class="text-right py-3 px-4 font-semibold text-gray-600">Amount</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Due Date</th>
            <th class="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
            <th class="text-center py-3 px-4 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredInvoices.length === 0">
            <td colspan="6" class="text-center py-10 text-gray-500">No invoices found.</td>
          </tr>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="border-b hover:bg-gray-50">
            <td class="py-3 px-4 text-gray-700">#{{ invoice.id }}</td>
            <td class="py-3 px-4 text-gray-700">{{ invoice.customer }}</td>
            <td class="py-3 px-4 text-right text-gray-700">${{ invoice.amount.toFixed(2) }}</td>
            <td class="py-3 px-4 text-gray-700">{{ invoice.dueDate }}</td>
            <td class="py-3 px-4 text-center">
              <span :class="statusClass(invoice.status)" class="px-3 py-1 rounded-full text-sm font-semibold">
                {{ invoice.status }}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <button @click="viewInvoice(invoice.id)" class="text-blue-600 hover:text-blue-800 font-semibold mr-2">View</button>
              <button @click="downloadPdf(invoice.id)" class="text-gray-600 hover:text-gray-800 font-semibold">Download</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const invoices = ref([
  { id: 'INV-001', customer: 'John Doe', amount: 150.00, dueDate: '2025-10-25', status: 'paid' },
  { id: 'INV-002', customer: 'Jane Smith', amount: 200.50, dueDate: '2025-10-20', status: 'pending' },
  { id: 'INV-003', customer: 'Peter Jones', amount: 75.00, dueDate: '2025-09-30', status: 'overdue' },
  { id: 'INV-004', customer: 'Sarah Miller', amount: 300.00, dueDate: '2025-11-01', status: 'pending' },
]);

const selectedStatus = ref('all');
const searchQuery = ref('');

const filteredInvoices = computed(() => {
  return invoices.value.filter(invoice => {
    const statusMatch = selectedStatus.value === 'all' || invoice.status === selectedStatus.value;
    const searchMatch = invoice.id.toLowerCase().includes(searchQuery.value.toLowerCase()) || invoice.customer.toLowerCase().includes(searchQuery.value.toLowerCase());
    return statusMatch && searchMatch;
  });
});

const statusClass = (status) => {
  return {
    'bg-green-100 text-green-800': status === 'paid',
    'bg-yellow-100 text-yellow-800': status === 'pending',
    'bg-red-100 text-red-800': status === 'overdue',
  };
};

const viewInvoice = (id) => {
  alert(`Viewing invoice: ${id}`);
};

const downloadPdf = (id) => {
  alert(`Downloading PDF for invoice: ${id}`);
};
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>