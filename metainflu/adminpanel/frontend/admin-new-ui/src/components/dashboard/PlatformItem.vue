<template>
  <div class="flex items-center justify-between py-3 px-4 hover:bg-neutral-50 rounded-lg transition-colors">
    <!-- Left: Platform info -->
    <div class="flex items-center space-x-3">
      <div :class="logoClasses">
        <BaseIcon
          v-if="platform.icon"
          :name="platform.icon"
          size="sm"
          class="text-white"
        />
        <img
          v-else-if="platform.logo"
          :src="platform.logo"
          :alt="platform.name"
          class="w-5 h-5 object-contain"
        >
        <span v-else class="text-white font-bold text-sm">
          {{ platform.name.charAt(0) }}
        </span>
      </div>
      
      <div>
        <p class="font-medium text-neutral-900">{{ platform.name }}</p>
        <p v-if="platform.description" class="text-sm text-neutral-500">
          {{ platform.description }}
        </p>
      </div>
    </div>
    
    <!-- Right: Metrics -->
    <div class="flex items-center space-x-6 text-right">
      <div>
        <p class="font-semibold text-neutral-900">{{ formattedValue }}</p>
        <p class="text-sm text-neutral-500">{{ valueLabel }}</p>
      </div>
      
      <div v-if="percentage" class="flex items-center space-x-1">
        <span class="text-sm font-medium text-neutral-600">{{ percentage }}</span>
      </div>
      
      <!-- Trend indicator -->
      <div v-if="trend" class="flex items-center space-x-1">
        <BaseIcon
          :name="trendIcon"
          size="xs"
          :class="trendClasses"
        />
        <span :class="trendClasses + ' text-sm font-medium'">
          {{ trend.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import BaseIcon from '../base/BaseIcon.vue'

export default {
  name: 'PlatformItem',
  components: {
    BaseIcon
  },
  props: {
    platform: {
      type: Object,
      required: true
      // Expected format: { name, icon?, logo?, description?, color? }
    },
    value: {
      type: [String, Number],
      required: true
    },
    valueLabel: {
      type: String,
      default: 'Revenue'
    },
    percentage: {
      type: String,
      default: null
    },
    trend: {
      type: Object,
      default: null
      // Expected format: { type: 'up'|'down'|'neutral', value: '7.9%' }
    },
    currency: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    formattedValue() {
      if (this.currency && typeof this.value === 'number') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(this.value)
      }
      return this.value
    },
    logoClasses() {
      const baseClasses = 'w-8 h-8 rounded-lg flex items-center justify-center'
      
      // Use platform-specific colors or default
      if (this.platform.color) {
        return `${baseClasses} ${this.platform.color}`
      }
      
      // Default colors based on platform name
      const colors = {
        dribbble: 'bg-pink-500',
        instagram: 'bg-gradient-to-br from-purple-600 to-pink-500',
        google: 'bg-blue-500',
        behance: 'bg-blue-600',
        facebook: 'bg-blue-600',
        twitter: 'bg-blue-400',
        linkedin: 'bg-blue-700',
        youtube: 'bg-red-600'
      }
      
      const platformColor = colors[this.platform.name.toLowerCase()] || 'bg-neutral-500'
      return `${baseClasses} ${platformColor}`
    },
    trendIcon() {
      if (!this.trend) return null
      
      const icons = {
        up: 'trending-up',
        down: 'trending-down',
        neutral: 'minus'
      }
      return icons[this.trend.type] || icons.neutral
    },
    trendClasses() {
      if (!this.trend) return ''
      
      const colors = {
        up: 'text-accent-green',
        down: 'text-accent-red',
        neutral: 'text-neutral-400'
      }
      return colors[this.trend.type] || colors.neutral
    }
  }
}
</script>
