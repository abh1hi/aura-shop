<template>
  <div :class="wrapperClasses" role="alert">
    <div class="flex">
      <div v-if="$slots.icon || icon" class="flex-shrink-0">
        <slot name="icon">
          <BaseIcon :name="iconMap[variant]" />
        </slot>
      </div>
      <div class="ml-3">
        <h3 v-if="$slots.title || title" class="text-sm font-medium" :class="titleClasses">
          <slot name="title">{{ title }}</slot>
        </h3>
        <div class="mt-2 text-sm" :class="textClasses">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'BaseAlert',
  components: { BaseIcon },
  props: {
    variant: {
      type: String,
      default: 'info', // info | success | warning | danger
      validator: (v) => ['info', 'success', 'warning', 'danger'].includes(v)
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    wrapperClasses() {
      const base = 'rounded-md p-4 border '
      const map = {
        info: 'bg-blue-50 border-blue-200',
        success: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        danger: 'bg-red-50 border-red-200'
      }
      return base + map[this.variant]
    },
    titleClasses() {
      const map = {
        info: 'text-blue-800',
        success: 'text-green-800',
        warning: 'text-yellow-800',
        danger: 'text-red-800'
      }
      return map[this.variant]
    },
    textClasses() {
      const map = {
        info: 'text-blue-700',
        success: 'text-green-700',
        warning: 'text-yellow-700',
        danger: 'text-red-700'
      }
      return map[this.variant]
    },
    iconMap() {
      return {
        info: 'information-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'x-circle'
      }
    }
  }
}
</script>
