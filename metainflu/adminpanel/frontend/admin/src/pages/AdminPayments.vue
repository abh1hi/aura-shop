
// File: frontend/admin/src/pages/AdminPayments.vue
<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Manage Payments</h2>
    <div class="bg-white p-6 rounded-xl shadow-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="payment in payments" :key="payment.id" class="py-4 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-800">Payment for {{ payment.campaignTitle }}</h3>
            <p class="text-sm text-gray-500">Amount: {{ payment.amount }}</p>
          </div>
          <span :class="getStatusColor(payment.status)" class="px-3 py-1 rounded-full text-sm font-medium">
            {{ payment.status }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPayments',
  data() {
    return {
      payments: [
        { id: 1, campaignTitle: 'Summer Collection', amount: '$500', status: 'paid' },
        { id: 2, campaignTitle: 'New Product', amount: '$300', status: 'pending' },
      ],
    };
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'paid':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
  },
};
</script>
