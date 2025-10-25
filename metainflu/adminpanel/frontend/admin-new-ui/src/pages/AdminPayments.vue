<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Payments</h1>
          <p class="text-neutral-600 mt-1">Monitor transactions and payment analytics</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="funnel" size="sm">
            Filter
          </BaseButton>
          <BaseButton variant="ghost" icon="arrow-down-tray" size="sm">
            Export
          </BaseButton>
        </div>
      </div>
      
      <!-- Payment Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Total Revenue"
          :value="paymentStats.totalRevenue"
          currency
          icon="banknotes"
          icon-color="success"
          :trend="{ type: 'up', value: '12.5%', period: 'vs last month' }"
        />
        <MetricCard
          label="Transactions"
          :value="paymentStats.totalTransactions"
          icon="credit-card"
          icon-color="primary"
          :trend="{ type: 'up', value: '8.2%', period: 'vs last month' }"
        />
        <MetricCard
          label="Success Rate"
          :value="paymentStats.successRate + '%'"
          icon="check-circle"
          icon-color="success"
          :trend="{ type: 'up', value: '0.5%', period: 'vs last month' }"
        />
        <MetricCard
          label="Pending"
          :value="paymentStats.pending"
          icon="clock"
          icon-color="warning"
        />
      </div>
      
      <!-- Placeholder for future implementation -->
      <div class="text-center py-12">
        <BaseIcon name="credit-card" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Payment Management</h3>
        <p class="text-neutral-500 mb-4">Detailed payment management features coming soon</p>
        <BaseButton variant="primary" disabled>
          Coming Soon
        </BaseButton>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseIcon from '../components/base/BaseIcon.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'

export default {
  name: 'AdminPayments',
  components: {
    AdminLayout,
    BaseButton,
    BaseIcon,
    MetricCard
  },
  data() {
    return {
      paymentStats: {
        totalRevenue: 1247863,
        totalTransactions: 5847,
        successRate: 98.5,
        pending: 23
      }
    }
  }
}
</script>