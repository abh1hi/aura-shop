<template>
  <span :class="badgeClasses">
    <BaseIcon
      v-if="icon"
      :name="icon"
      size="xs"
      class="mr-1"
    />
    <slot />
  </span>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'BaseBadge',
  components: {
    BaseIcon
  },
  props: {
    variant: {
      type: String,
      default: 'neutral',
      validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    icon: {
      type: String,
      default: null
    },
    dot: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    badgeClasses() {
      return [
        // Base styles
        'inline-flex items-center font-medium',
        
        // Size styles
        this.sizeClasses,
        
        // Variant styles
        this.variantClasses,
        
        // Dot style
        this.dot ? 'pl-2' : ''
      ]
    },
    sizeClasses() {
      const sizes = {
        sm: 'px-2 py-0.5 text-xs rounded-md',
        md: 'px-2.5 py-1 text-xs rounded-lg',
        lg: 'px-3 py-1.5 text-sm rounded-lg'
      }
      return sizes[this.size]
    },
    variantClasses() {
      const variants = {
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-neutral-100 text-neutral-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        neutral: 'bg-neutral-100 text-neutral-600'
      }
      return variants[this.variant]
    }
  }
}
</script>
