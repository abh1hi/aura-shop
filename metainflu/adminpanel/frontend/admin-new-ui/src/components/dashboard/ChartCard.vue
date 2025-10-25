<template>
  <BaseCard :title="title" variant="default" padding="normal">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
        <div class="flex items-center space-x-2">
          <BaseButton
            v-for="filter in filters"
            :key="filter.value"
            :variant="activeFilter === filter.value ? 'primary' : 'ghost'"
            size="sm"
            @click="setActiveFilter(filter.value)"
          >
            {{ filter.label }}
          </BaseButton>
        </div>
      </div>
    </template>
    
    <div class="relative">
      <!-- Chart container -->
      <div :id="chartId" class="w-full" :style="{ height: height }"></div>
      
      <!-- Loading state -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
      >
        <div class="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
      
      <!-- Empty state -->
      <div
        v-if="!loading && (!chartData || chartData.length === 0)"
        class="absolute inset-0 flex items-center justify-center text-neutral-500"
      >
        <div class="text-center">
          <BaseIcon name="chart-bar" size="xl" class="mx-auto mb-2 text-neutral-300" />
          <p>No data available</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseIcon from '../base/BaseIcon.vue'

Chart.register(...registerables)

let chartIdCounter = 0

export default {
  name: 'ChartCard',
  components: {
    BaseCard,
    BaseButton,
    BaseIcon
  },
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'bar', 'doughnut', 'pie', 'area'].includes(value)
    },
    chartData: {
      type: Array,
      default: () => []
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '300px'
    },
    filters: {
      type: Array,
      default: () => [
        { label: 'Sales', value: 'sales' },
        { label: 'Revenue', value: 'revenue' },
        { label: 'Leads', value: 'leads' }
      ]
    },
    defaultFilter: {
      type: String,
      default: 'sales'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['filter-change'],
  data() {
    return {
      chartId: `chart-${++chartIdCounter}`,
      chart: null,
      activeFilter: this.defaultFilter
    }
  },
  watch: {
    chartData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    initChart() {
      const ctx = document.getElementById(this.chartId)
      if (!ctx) return
      
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          y: {
            grid: {
              color: '#f3f4f6'
            },
            border: {
              display: false
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
      
      this.chart = new Chart(ctx, {
        type: this.type === 'area' ? 'line' : this.type,
        data: this.processChartData(),
        options: {
          ...defaultOptions,
          ...this.chartOptions
        }
      })
    },
    updateChart() {
      if (!this.chart) return
      
      this.chart.data = this.processChartData()
      this.chart.update()
    },
    processChartData() {
      // Transform the data based on chart type and current filter
      return {
        labels: this.chartData.map(item => item.label || item.x),
        datasets: [{
          label: this.activeFilter.charAt(0).toUpperCase() + this.activeFilter.slice(1),
          data: this.chartData.map(item => item[this.activeFilter] || item.y || item.value),
          backgroundColor: this.type === 'area' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.8)',
          borderColor: '#ec4899',
          borderWidth: 2,
          fill: this.type === 'area'
        }]
      }
    },
    setActiveFilter(filter) {
      this.activeFilter = filter
      this.updateChart()
      this.$emit('filter-change', filter)
    }
  }
}
</script>
