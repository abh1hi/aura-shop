<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Dashboard Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">New report</h1>
          <div class="flex items-center space-x-4 mt-2">
            <div class="flex items-center space-x-2">
              <BaseIcon name="calendar" size="sm" class="text-neutral-400" />
              <span class="text-sm text-neutral-600">{{ dateRange }}</span>
            </div>
            <div class="flex -space-x-2">
              <img
                v-for="user in teamMembers"
                :key="user.id"
                :src="user.avatar"
                :alt="user.name"
                :title="user.name"
                class="w-8 h-8 rounded-full border-2 border-white"
              >
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="filter" size="sm">
            Filters
          </BaseButton>
          <BaseButton variant="ghost" icon="share" size="sm">
            Export
          </BaseButton>
          <BaseButton variant="primary" icon="plus" size="sm">
            New Report
          </BaseButton>
        </div>
      </div>
      
      <!-- Main Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Revenue Card -->
        <div class="lg:col-span-2">
          <BaseCard variant="default" padding="normal">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-neutral-900">Revenue</h3>
                <div class="flex items-center space-x-2">
                  <BaseBadge variant="danger" size="sm">-7.9%</BaseBadge>
                  <span class="text-sm text-neutral-500">$27,335.09</span>
                </div>
              </div>
              
              <div>
                <div class="flex items-baseline space-x-2">
                  <span class="text-3xl font-bold text-neutral-900">$528,976</span>
                  <span class="text-lg text-neutral-400">.82</span>
                </div>
                <p class="text-sm text-neutral-500 mt-1">
                  vs prev. $501,641.73 Jun 1 - Aug 31, 2023
                </p>
              </div>
            </div>
          </BaseCard>
        </div>
        
        <!-- Top Sales -->
        <MetricCard
          label="Top sales"
          value="72"
          icon="trending-up"
          icon-color="success"
          :trend="{ type: 'up', value: '8.5%' }"
          badge="Featured"
          badge-variant="success"
        />
        
        <!-- Best Deal -->
        <MetricCard
          label="Best deal"
          value="$298"
          icon="heart"
          icon-color="danger"
          :trend="{ type: 'up', value: '12%' }"
          currency
        />
      </div>
      
      <!-- Secondary Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          v-for="metric in secondaryMetrics"
          :key="metric.id"
          :label="metric.label"
          :value="metric.value"
          size="sm"
          :trend="metric.trend"
        />
      </div>
      
      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Platform Performance -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Sales Dynamic Chart -->
          <ChartCard
            title="Sales dynamic"
            type="line"
            :chart-data="salesChartData"
            :loading="chartsLoading"
            height="280px"
            @filter-change="handleChartFilter"
          />
          
          <!-- Work with Platforms -->
          <BaseCard title="Work with platforms" variant="default" padding="none">
            <div class="divide-y divide-neutral-200">
              <PlatformItem
                v-for="platform in platforms"
                :key="platform.id"
                :platform="platform"
                :value="platform.revenue"
                :percentage="platform.percentage"
                :trend="platform.trend"
              />
            </div>
          </BaseCard>
        </div>
        
        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Platform Value Chart -->
          <BaseCard title="Platform value" variant="default" padding="normal">
            <div class="space-y-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-neutral-900">45.3%</div>
                <div class="text-sm text-neutral-500">$71,048</div>
              </div>
              
              <!-- Pie chart placeholder -->
              <div class="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                <div class="w-16 h-16 bg-white rounded-full"></div>
              </div>
              
              <div class="space-y-2">
                <div v-for="item in platformValues" :key="item.label" class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-2">
                    <div :class="['w-3 h-3 rounded-full', item.color]"></div>
                    <span class="text-neutral-600">{{ item.label }}</span>
                  </div>
                  <span class="font-medium text-neutral-900">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </BaseCard>
          
          <!-- Top Performers -->
          <BaseCard title="Top performers" variant="default" padding="none">
            <div class="divide-y divide-neutral-200">
              <ListItem
                v-for="performer in topPerformers"
                :key="performer.id"
                :title="performer.name"
                :subtitle="performer.role"
                :avatar="performer.avatar"
                :metrics="{ primary: performer.sales, secondary: performer.deals + ' deals' }"
                :trend="performer.trend"
                :bordered="false"
              />
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseIcon from '../components/base/BaseIcon.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'
import ChartCard from '../components/dashboard/ChartCard.vue'
import PlatformItem from '../components/dashboard/PlatformItem.vue'
import ListItem from '../components/dashboard/ListItem.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AdminLayout,
    BaseCard,
    BaseButton,
    BaseIcon,
    BaseBadge,
    MetricCard,
    ChartCard,
    PlatformItem,
    ListItem
  },
  data() {
    return {
      chartsLoading: false,
      dateRange: 'Sep 1 - Nov 30, 2023',
      teamMembers: [
        {
          id: 1,
          name: 'Armin A.',
          avatar: 'https://ui-avatars.com/api/?name=Armin+A&background=3b82f6&color=fff'
        },
        {
          id: 2,
          name: 'Eren Y.',
          avatar: 'https://ui-avatars.com/api/?name=Eren+Y&background=10b981&color=fff'
        },
        {
          id: 3,
          name: 'Mikasa A.',
          avatar: 'https://ui-avatars.com/api/?name=Mikasa+A&background=f59e0b&color=fff'
        }
      ],
      secondaryMetrics: [
        {
          id: 1,
          label: 'Armin A.',
          value: '$209,633',
          trend: { type: 'up', value: '11%' }
        },
        {
          id: 2,
          label: 'Mikasa A.',
          value: '$156,841',
          trend: { type: 'neutral', value: '54%' }
        },
        {
          id: 3,
          label: 'Deals',
          value: '5',
          trend: { type: 'up', value: '7.9%' }
        },
        {
          id: 4,
          label: 'Value',
          value: '$288',
          trend: { type: 'up', value: '1.2%' }
        },
        {
          id: 5,
          label: 'Win rate',
          value: '64%',
          trend: { type: 'down', value: '2.1%' }
        }
      ],
      salesChartData: [
        { label: 'Jan', sales: 65, revenue: 45000, leads: 120 },
        { label: 'Feb', sales: 75, revenue: 52000, leads: 140 },
        { label: 'Mar', sales: 85, revenue: 61000, leads: 160 },
        { label: 'Apr', sales: 70, revenue: 48000, leads: 130 },
        { label: 'May', sales: 95, revenue: 71000, leads: 180 },
        { label: 'Jun', sales: 88, revenue: 65000, leads: 170 },
        { label: 'Jul', sales: 92, revenue: 68000, leads: 175 },
        { label: 'Aug', sales: 78, revenue: 55000, leads: 145 }
      ],
      platforms: [
        {
          id: 1,
          name: 'Dribbble',
          icon: 'heart',
          color: 'bg-pink-500',
          revenue: 227669,
          percentage: '43%',
          trend: { type: 'up', value: '5.2%' }
        },
        {
          id: 2,
          name: 'Instagram',
          icon: 'camera',
          color: 'bg-gradient-to-br from-purple-600 to-pink-500',
          revenue: 142823,
          percentage: '27%',
          trend: { type: 'up', value: '3.1%' }
        },
        {
          id: 3,
          name: 'Behance',
          icon: 'squares-2x2',
          color: 'bg-blue-600',
          revenue: 89835,
          percentage: '17%',
          trend: { type: 'down', value: '1.2%' }
        },
        {
          id: 4,
          name: 'Google',
          icon: 'magnifying-glass',
          color: 'bg-blue-500',
          revenue: 37028,
          percentage: '7%',
          trend: { type: 'up', value: '2.8%' }
        }
      ],
      platformValues: [
        { label: 'Dribbble', value: '28.1%', color: 'bg-pink-500' },
        { label: 'Instagram', value: '5.4%', color: 'bg-purple-500' },
        { label: 'Other', value: '7.1%', color: 'bg-neutral-300' }
      ],
      topPerformers: [
        {
          id: 1,
          name: 'Armin A.',
          role: 'Sales Manager',
          avatar: 'https://ui-avatars.com/api/?name=Armin+A&background=3b82f6&color=fff',
          sales: '$209,633',
          deals: 118,
          trend: { type: 'up', value: '11%' }
        },
        {
          id: 2,
          name: 'Mikasa A.',
          role: 'Marketing Lead',
          avatar: 'https://ui-avatars.com/api/?name=Mikasa+A&background=f59e0b&color=fff',
          sales: '$156,841',
          deals: 103,
          trend: { type: 'up', value: '8.2%' }
        },
        {
          id: 3,
          name: 'Eren Y.',
          role: 'Business Dev',
          avatar: 'https://ui-avatars.com/api/?name=Eren+Y&background=10b981&color=fff',
          sales: '$117,115',
          deals: 84,
          trend: { type: 'up', value: '5.4%' }
        }
      ]
    }
  },
  methods: {
    handleChartFilter(filter) {
      console.log('Chart filter changed to:', filter)
      // Implement chart filter logic
    }
  }
}
</script>
