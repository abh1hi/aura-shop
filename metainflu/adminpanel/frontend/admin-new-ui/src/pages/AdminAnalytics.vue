<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p class="text-neutral-600 mt-1">Sales performance and business insights</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseSelect v-model="selectedPeriod" :options="periodOptions" @change="fetchAnalytics" />
          <BaseButton variant="ghost" icon="arrow-path" :loading="isLoading" @click="refresh">Refresh</BaseButton>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" :value="formatCurrency(stats.totalRevenue)" icon="currency-dollar" variant="success" />
        <StatsCard title="Total Orders" :value="stats.totalOrders" icon="shopping-cart" variant="info" />
        <StatsCard title="Avg Order Value" :value="formatCurrency(avgOrderValue)" icon="chart-bar" variant="primary" />
        <StatsCard title="Growth Rate" :value="formatPercentage(growthRate)" icon="trending-up" variant="warning" />
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard title="Sales Trend">
          <div class="h-64 flex items-center justify-center text-neutral-500">
            <div>Sales chart will be implemented here</div>
          </div>
        </BaseCard>
        
        <BaseCard title="Top Products">
          <div class="space-y-3">
            <div v-for="product in topProducts" :key="product._id" class="flex items-center justify-between py-2">
              <div>
                <div class="font-medium">{{ product.product?.name || 'Unknown Product' }}</div>
                <div class="text-sm text-neutral-500">{{ product.totalSold }} sold</div>
              </div>
              <div class="text-right">
                <div class="font-medium">{{ formatCurrency(product.totalRevenue) }}</div>
              </div>
            </div>
            <div v-if="topProducts.length === 0" class="text-center py-4 text-neutral-500">
              No product data available
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseButton from '../components/base/BaseButton.vue'
import StatsCard from '../components/StatsCard.vue'
import adminService from '../services/adminService.js'

export default {
  name: 'AdminAnalytics',
  components: { AdminLayout, BaseCard, BaseSelect, BaseButton, StatsCard },
  setup() {
    const isLoading = ref(false)
    const selectedPeriod = ref('30d')
    const analyticsData = ref(null)
    
    const periodOptions = [
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' },
      { value: '90d', label: 'Last 90 days' },
      { value: '1y', label: 'Last year' }
    ]
    
    const stats = computed(() => analyticsData.value?.stats || {})
    const topProducts = computed(() => analyticsData.value?.topProducts || [])
    const salesData = computed(() => analyticsData.value?.salesData || [])
    
    const avgOrderValue = computed(() => {
      return stats.value.totalOrders > 0 ? stats.value.totalRevenue / stats.value.totalOrders : 0
    })
    
    const growthRate = computed(() => {
      // Placeholder calculation
      return 12.5
    })
    
    const fetchAnalytics = async () => {
      try {
        isLoading.value = true
        const response = await adminService.getAnalytics(selectedPeriod.value)
        analyticsData.value = response.data
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    const refresh = () => fetchAnalytics()
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value || 0)
    }
    
    const formatPercentage = (value) => {
      return `${(value || 0).toFixed(1)}%`
    }
    
    onMounted(() => {
      fetchAnalytics()
    })
    
    return {
      isLoading,
      selectedPeriod,
      periodOptions,
      stats,
      topProducts,
      avgOrderValue,
      growthRate,
      fetchAnalytics,
      refresh,
      formatCurrency,
      formatPercentage
    }
  }
}
</script>