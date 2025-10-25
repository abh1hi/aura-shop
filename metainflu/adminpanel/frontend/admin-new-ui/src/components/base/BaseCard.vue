<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div
      v-if="$slots.header || title"
      :class="[
        'px-6 py-4',
        $slots.default ? 'border-b border-neutral-200' : ''
      ]"
    >
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-neutral-900">
          {{ title }}
        </h3>
      </slot>
    </div>
    
    <!-- Content -->
    <div v-if="$slots.default" :class="contentClasses">
      <slot />
    </div>
    
    <!-- Footer -->
    <div
      v-if="$slots.footer"
      :class="[
        'px-6 py-4 bg-neutral-50 rounded-b-xl',
        $slots.default ? 'border-t border-neutral-200' : ''
      ]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'bordered', 'elevated', 'flat'].includes(value)
    },
    padding: {
      type: String,
      default: 'normal',
      validator: (value) => ['none', 'compact', 'normal', 'spacious'].includes(value)
    },
    hover: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardClasses() {
      return [
        // Base styles
        'bg-white overflow-hidden transition-smooth',
        
        // Variant styles
        this.variantClasses,
        
        // Interactive styles
        this.hover || this.clickable ? 'hover:shadow-medium' : '',
        this.clickable ? 'cursor-pointer' : ''
      ]
    },
    variantClasses() {
      const variants = {
        default: 'rounded-xl shadow-soft',
        bordered: 'rounded-xl border border-neutral-200',
        elevated: 'rounded-xl shadow-medium',
        flat: 'rounded-xl'
      }
      return variants[this.variant]
    },
    contentClasses() {
      const paddings = {
        none: '',
        compact: 'p-4',
        normal: 'p-6',
        spacious: 'p-8'
      }
      return paddings[this.padding]
    }
  }
}
</script>
