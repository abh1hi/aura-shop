<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled"
    v-bind="linkProps"
    @click="handleClick"
  >
    <BaseIcon
      v-if="icon && iconPosition === 'left'"
      :name="icon"
      :size="iconSize"
      :class="iconClasses"
    />
    
    <span v-if="$slots.default" :class="textClasses">
      <slot />
    </span>
    
    <BaseIcon
      v-if="icon && iconPosition === 'right'"
      :name="icon"
      :size="iconSize"
      :class="iconClasses"
    />
    
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin ml-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </component>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'BaseButton',
  components: {
    BaseIcon
  },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'ghost', 'danger', 'success'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    icon: {
      type: String,
      default: null
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value)
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: null
    },
    href: {
      type: String,
      default: null
    },
    target: {
      type: String,
      default: null
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    tag() {
      if (this.to) return 'router-link'
      if (this.href) return 'a'
      return 'button'
    },
    linkProps() {
      if (this.to) return { to: this.to }
      if (this.href) return { href: this.href, target: this.target }
      return {}
    },
    buttonClasses() {
      return [
        // Base styles
        'inline-flex items-center justify-center font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Size styles
        this.sizeClasses,
        
        // Variant styles
        this.variantClasses,
        
        // Full width
        this.fullWidth ? 'w-full' : '',
        
        // Icon only styles
        this.iconOnly ? 'aspect-square' : ''
      ]
    },
    sizeClasses() {
      const sizes = {
        xs: this.iconOnly ? 'p-1.5 rounded-md' : 'px-2.5 py-1.5 text-xs rounded-md',
        sm: this.iconOnly ? 'p-2 rounded-md' : 'px-3 py-2 text-sm rounded-md',
        md: this.iconOnly ? 'p-2.5 rounded-lg' : 'px-4 py-2.5 text-sm rounded-lg',
        lg: this.iconOnly ? 'p-3 rounded-lg' : 'px-6 py-3 text-base rounded-lg',
        xl: this.iconOnly ? 'p-4 rounded-xl' : 'px-8 py-4 text-lg rounded-xl'
      }
      return sizes[this.size]
    },
    variantClasses() {
      const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg',
        secondary: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 focus:ring-primary-500 shadow-sm hover:shadow-md',
        ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-primary-500',
        danger: 'bg-accent-red text-white hover:bg-red-600 focus:ring-red-500 shadow-md hover:shadow-lg',
        success: 'bg-accent-green text-white hover:bg-green-600 focus:ring-green-500 shadow-md hover:shadow-lg'
      }
      return variants[this.variant]
    },
    iconSize() {
      const sizeMap = {
        xs: 'xs',
        sm: 'sm',
        md: 'sm',
        lg: 'md',
        xl: 'lg'
      }
      return sizeMap[this.size]
    },
    iconClasses() {
      if (this.iconOnly) return ''
      return this.iconPosition === 'left' ? 'mr-2' : 'ml-2'
    },
    textClasses() {
      return this.loading ? 'opacity-70' : ''
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>
