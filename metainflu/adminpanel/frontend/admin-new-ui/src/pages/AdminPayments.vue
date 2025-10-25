<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Payments</h1>
          <p class="text-neutral-600 mt-1">Monitor transactions and payment processing</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="arrow-path" :loading="isLoading" @click="refresh">Refresh</BaseButton>
          <BaseButton variant="primary" icon="cog-6-tooth" @click="configurePayments">Configure</BaseButton>
        </div>
      </div>
      
      <!-- Payment Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Processed" :value="formatCurrency(paymentStats.totalProcessed)" icon="currency-dollar" variant="success" />
        <StatsCard title="Pending" :value="formatCurrency(paymentStats.pending)" icon="clock" variant="warning" />
        <StatsCard title="Failed" :value="formatCurrency(paymentStats.failed)" icon="exclamation-triangle" variant="danger" />
        <StatsCard title="Refunded" :value="formatCurrency(paymentStats.refunded)" icon="arrow-uturn-left" variant="info" />
      </div>
      
      <!-- Payments Table -->
      <BaseCard title="Recent Transactions">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200">
            <thead class="bg-neutral-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Transaction</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Method</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Amount</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-neutral-200">
              <tr v-if="!isLoading && payments.length === 0">
                <td colspan="7" class="px-4 py-10 text-center text-neutral-500">
                  No payment transactions found
                </td>
              </tr>
              <tr v-if="isLoading">
                <td colspan="7" class="px-4 py-6 text-center text-neutral-500">Loading transactions...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import StatsCard from '../components/StatsCard.vue'

export default {
  name: 'AdminPayments',
  components: { AdminLayout, BaseCard, BaseButton, StatsCard },
  setup() {
    const toast = useToast()
    
    const payments = ref([])
    const isLoading = ref(false)
    
    const paymentStats = ref({
      totalProcessed: 0,
      pending: 0,
      failed: 0,
      refunded: 0
    })
    
    const fetchPayments = async () => {
      try {
        isLoading.value = true
        // TODO: Implement payments API
        payments.value = []
      } catch (error) {
        console.error('Failed to fetch payments:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    const refresh = () => fetchPayments()
    
    const configurePayments = () => {
      toast.info('Payment configuration feature coming soon')
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value || 0)
    }
    
    onMounted(() => {
      fetchPayments()
    })
    
    return {
      payments,
      paymentStats,
      isLoading,
      refresh,
      configurePayments,
      formatCurrency
    }
  }
}
</script>