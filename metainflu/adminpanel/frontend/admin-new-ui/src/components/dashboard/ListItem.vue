<template>
  <div :class="itemClasses">
    <!-- Left content -->
    <div class="flex items-center space-x-3">
      <!-- Avatar/Icon -->
      <div v-if="avatar || icon" :class="avatarClasses">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="title"
          class="w-full h-full object-cover"
        >
        <BaseIcon
          v-else-if="icon"
          :name="icon"
          size="sm"
          class="text-white"
        />
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <p class="font-medium text-neutral-900 truncate">{{ title }}</p>
          <BaseBadge
            v-if="badge"
            :variant="badge.variant || 'neutral'"
            size="sm"
          >
            {{ badge.text }}
          </BaseBadge>
        </div>
        
        <p v-if="subtitle" class="text-sm text-neutral-500 truncate">
          {{ subtitle }}
        </p>
        
        <!-- Stats row -->
        <div v-if="stats && stats.length > 0" class="flex items-center space-x-4 mt-1">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex items-center space-x-1 text-xs text-neutral-500"
          >
            <BaseIcon v-if="stat.icon" :name="stat.icon" size="xs" />
            <span>{{ stat.label }}: {{ stat.value }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right content -->
    <div class="flex items-center space-x-3">
      <!-- Metrics -->
      <div v-if="metrics" class="text-right">
        <p class="font-semibold text-neutral-900">{{ metrics.primary }}</p>
        <p v-if="metrics.secondary" class="text-sm text-neutral-500">
          {{ metrics.secondary }}
        </p>
      </div>
      
      <!-- Trend -->
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
      
      <!-- Actions -->
      <div v-if="$slots.actions" class="flex items-center space-x-1">
        <slot name="actions" />
      </div>
      
      <BaseButton
        v-else-if="clickable"
        variant="ghost"
        icon-only
        size="sm"
        icon="chevron-right"
      />
    </div>
  </div>
</template>

<script>
import BaseIcon from '../base/BaseIcon.vue'
import BaseBadge from '../base/BaseBadge.vue'
import BaseButton from '../base/BaseButton.vue'

export default {
  name: 'ListItem',
  components: {
    BaseIcon,
    BaseBadge,
    BaseButton
  },
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconColor: {
      type: String,
      default: 'primary'
    },
    badge: {
      type: Object,
      default: null
      // Expected format: { text, variant }
    },
    stats: {
      type: Array,
      default: () => []
      // Expected format: [{ label, value, icon? }]
    },
    metrics: {
      type: Object,
      default: null
      // Expected format: { primary, secondary? }
    },
    trend: {
      type: Object,
      default: null
      // Expected format: { type: 'up'|'down'|'neutral', value }
    },
    clickable: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    itemClasses() {
      return [
        'flex items-center justify-between p-4 transition-colors',
        this.clickable ? 'hover:bg-neutral-50 cursor-pointer' : '',
        this.bordered ? 'border-b border-neutral-200 last:border-b-0' : ''
      ]
    },
    avatarClasses() {
      const colors = {
        primary: 'bg-primary-500',
        success: 'bg-accent-green',
        warning: 'bg-accent-yellow',
        danger: 'bg-accent-red',
        info: 'bg-accent-blue',
        purple: 'bg-accent-purple'
      }
      
      return [
        'w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden',
        this.avatar ? '' : (colors[this.iconColor] || colors.primary)
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
