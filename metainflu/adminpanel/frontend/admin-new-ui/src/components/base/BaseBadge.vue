<template>
  <span :class="badgeClasses"><slot /></span>
</template>

<script>
export default {
  name: 'BaseBadge',
  props: {
    variant: {
      type: String,
      default: 'neutral'
    }
  },
  computed: {
    badgeClasses() {
      const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '
      const map = {
        neutral: 'bg-neutral-100 text-neutral-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
      }
      return base + (map[this.variant] || map.neutral)
    }
  }
}
</script>
