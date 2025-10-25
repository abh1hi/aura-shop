<template>
  <BaseCard
    :variant="variant"
    :hover="clickable"
    :clickable="clickable"
    padding="normal"
    @click="handleClick"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <!-- Label -->
        <p class="text-sm font-medium text-neutral-600 mb-1">
          {{ label }}
        </p>
        
        <!-- Value -->
        <div class="flex items-baseline space-x-2">
          <p :class="valueClasses">
            {{ formattedValue }}
          </p>
          <BaseBadge
            v-if="badge"
            :variant="badgeVariant"
            size="sm"
          >
            {{ badge }}
          </BaseBadge>
        </div>
        
        <!-- Trend -->
        <div v-if="trend" class="flex items-center mt-2 space-x-1">
          <BaseIcon
            :name="trendIcon"
            size="xs"
            :class="trendIconClasses"
          />
          <span :class="trendTextClasses">
            {{ trendText }}
          </span>
        </div>
      </div>
      
      <!-- Icon -->
      <div v-if="icon" :class="iconContainerClasses">
        <BaseIcon
          :name="icon"
          :size="iconSize"
          class="text-white"
        />
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../base/BaseCard.vue'
import BaseIcon from '../base/BaseIcon.vue'
import BaseBadge from '../base/BaseBadge.vue'

export default {
  name: 'MetricCard',
  components: {
    BaseCard,
    BaseIcon,
    BaseBadge
  },
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: null
    },
    iconColor: {
      type: String,
      default: 'primary'
    },
    trend: {
      type: Object,
      default: null
      // Expected format: { type: 'up'|'down'|'neutral', value: '7.9%', period: 'vs prev. $501,641.73 Jun 1 - Aug 31, 2023' }
    },
    badge: {
      type: String,
      default: null
    },
    badgeVariant: {
      type: String,
      default: 'neutral'
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    variant: {
      type: String,
      default: 'default'
    },
    clickable: {
      type: Boolean,
      default: false
    },
    currency: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
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
    valueClasses() {
      const sizes = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-3xl'
      }
      return [
        'font-bold text-neutral-900',
        sizes[this.size]
      ]
    },
    iconSize() {
      const sizes = {
        sm: 'md',
        md: 'lg',
        lg: 'xl'
      }
      return sizes[this.size]
    },
    iconContainerClasses() {
      const colors = {
        primary: 'bg-primary-500',
        success: 'bg-accent-green',
        warning: 'bg-accent-yellow',
        danger: 'bg-accent-red',
        info: 'bg-accent-blue',
        purple: 'bg-accent-purple'
      }
      
      const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
      }
      
      return [
        'flex items-center justify-center rounded-lg',
        colors[this.iconColor] || colors.primary,
        sizes[this.size]
      ]
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
    trendIconClasses() {
      if (!this.trend) return ''
      
      const colors = {
        up: 'text-accent-green',
        down: 'text-accent-red',
        neutral: 'text-neutral-400'
      }
      return colors[this.trend.type] || colors.neutral
    },
    trendTextClasses() {
      if (!this.trend) return ''
      
      const colors = {
        up: 'text-accent-green',
        down: 'text-accent-red',
        neutral: 'text-neutral-500'
      }
      return [
        'text-xs font-medium',
        colors[this.trend.type] || colors.neutral
      ]
    },
    trendText() {
      if (!this.trend) return ''
      return `${this.trend.value} ${this.trend.period || ''}`
    }
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('click')
      }
    }
  }
}
</script>
