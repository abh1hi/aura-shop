<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p class="text-neutral-600 mt-1">Comprehensive data insights and performance metrics</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="calendar" size="sm">
            Date Range
          </BaseButton>
          <BaseButton variant="ghost" icon="arrow-down-tray" size="sm">
            Export
          </BaseButton>
        </div>
      </div>
      
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Revenue"
          :value="analyticsData.totalRevenue"
          currency
          icon="banknotes"
          icon-color="success"
          :trend="{ type: 'up', value: '12.5%', period: 'vs last month' }"
        />
        
        <MetricCard
          label="Conversion Rate"
          :value="analyticsData.conversionRate + '%'"
          icon="arrow-trending-up"
          icon-color="primary"
          :trend="{ type: 'up', value: '2.3%', period: 'vs last month' }"
        />
        
        <MetricCard
          label="Average Order"
          :value="analyticsData.averageOrder"
          currency
          icon="shopping-cart"
          icon-color="info"
          :trend="{ type: 'down', value: '1.2%', period: 'vs last month' }"
        />
        
        <MetricCard
          label="Total Orders"
          :value="analyticsData.totalOrders"
          icon="clipboard-document-list"
          icon-color="warning"
          :trend="{ type: 'up', value: '8.7%', period: 'vs last month' }"
        />
      </div>
      
      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <ChartCard
          title="Revenue Over Time"
          type="line"
          :chart-data="revenueChartData"
          :loading="chartsLoading"
          height="300px"
        />
        
        <!-- Orders Chart -->
        <ChartCard
          title="Orders by Category"
          type="doughnut"
          :chart-data="ordersChartData"
          :loading="chartsLoading"
          height="300px"
        />
      </div>
      
      <!-- Traffic Sources -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <BaseCard title="Traffic Sources" variant="default" padding="none">
            <div class="divide-y divide-neutral-200">
              <div
                v-for="source in trafficSources"
                :key="source.name"
                class="flex items-center justify-between p-4 hover:bg-neutral-50"
              >
                <div class="flex items-center space-x-3">
                  <div :class="['w-3 h-3 rounded-full', source.color]"></div>
                  <div>
                    <p class="font-medium text-neutral-900">{{ source.name }}</p>
                    <p class="text-sm text-neutral-500">{{ source.description }}</p>
                  </div>
                </div>
                
                <div class="text-right">
                  <p class="font-semibold text-neutral-900">{{ source.visitors }}</p>
                  <p class="text-sm text-neutral-500">{{ source.percentage }}%</p>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
        
        <!-- Top Pages -->
        <BaseCard title="Top Pages" variant="default" padding="none">
          <div class="divide-y divide-neutral-200">
            <div
              v-for="page in topPages"
              :key="page.path"
              class="p-4 hover:bg-neutral-50"
            >
              <p class="font-medium text-neutral-900 truncate">{{ page.path }}</p>
              <div class="flex items-center justify-between mt-1">
                <p class="text-sm text-neutral-500">{{ page.views }} views</p>
                <BaseBadge
                  :variant="page.trend > 0 ? 'success' : 'danger'"
                  size="sm"
                >
                  {{ page.trend > 0 ? '+' : '' }}{{ page.trend }}%
                </BaseBadge>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'
import ChartCard from '../components/dashboard/ChartCard.vue'

export default {
  name: 'AdminAnalytics',
  components: {
    AdminLayout,
    BaseCard,
    BaseButton,
    BaseBadge,
    MetricCard,
    ChartCard
  },
  data() {
    return {
      chartsLoading: false,
      analyticsData: {
        totalRevenue: 1247863,
        conversionRate: 3.2,
        averageOrder: 157.50,
        totalOrders: 2847
      },
      revenueChartData: [
        { label: 'Jan', revenue: 45000 },
        { label: 'Feb', revenue: 52000 },
        { label: 'Mar', revenue: 48000 },
        { label: 'Apr', revenue: 61000 },
        { label: 'May', revenue: 55000 },
        { label: 'Jun', revenue: 67000 }
      ],
      ordersChartData: [
        { label: 'Electronics', orders: 450 },
        { label: 'Clothing', orders: 320 },
        { label: 'Home & Kitchen', orders: 280 },
        { label: 'Books', orders: 180 }
      ],
      trafficSources: [
        {
          name: 'Organic Search',
          description: 'Google, Bing, etc.',
          visitors: '12,487',
          percentage: '45.2',
          color: 'bg-green-500'
        },
        {
          name: 'Direct',
          description: 'Direct visits',
          visitors: '8,234',
          percentage: '29.8',
          color: 'bg-blue-500'
        },
        {
          name: 'Social Media',
          description: 'Facebook, Twitter, etc.',
          visitors: '4,123',
          percentage: '14.9',
          color: 'bg-purple-500'
        },
        {
          name: 'Referral',
          description: 'Other websites',
          visitors: '2,789',
          percentage: '10.1',
          color: 'bg-yellow-500'
        }
      ],
      topPages: [
        {
          path: '/products',
          views: '24,567',
          trend: 12.5
        },
        {
          path: '/categories/electronics',
          views: '18,234',
          trend: 8.2
        },
        {
          path: '/dashboard',
          views: '15,789',
          trend: -2.3
        },
        {
          path: '/checkout',
          views: '12,456',
          trend: 15.7
        }
      ]
    }
  }
}
</script>