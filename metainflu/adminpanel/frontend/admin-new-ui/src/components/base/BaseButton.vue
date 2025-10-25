<template>
  <button :type="type" :disabled="disabled || loading" :class="classes" @click="$emit('click', $event)">
    <span v-if="icon" class="-ml-1 mr-2 h-5 w-5"><BaseIcon :name="icon" /></span>
    <span><slot /></span>
  </button>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'BaseButton',
  components: { BaseIcon },
  props: {
    type: { type: String, default: 'button' },
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    fullWidth: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    icon: { type: String, default: '' }
  },
  computed: {
    classes() {
      const base = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed '
      const variants = {
        primary: 'text-white bg-primary-600 hover:bg-primary-700 border-transparent focus:ring-primary-500',
        secondary: 'text-neutral-700 bg-white hover:bg-neutral-50 border-neutral-300 focus:ring-primary-500',
        danger: 'text-white bg-red-600 hover:bg-red-700 border-transparent focus:ring-red-500',
        ghost: 'text-neutral-700 bg-transparent hover:bg-neutral-100 border-transparent',
        outline: 'text-neutral-700 bg-transparent border-neutral-300 hover:bg-neutral-50'
      }
      const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-4 py-2 text-base'
      }
      const width = this.fullWidth ? ' w-full' : ''
      return base + variants[this.variant] + ' ' + sizes[this.size] + width
    }
  }
}
</script>
